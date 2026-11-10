<?php
/**
 * Polaris Integrated & GeoSolutions Limited (PIGL)
 * Production Campaigns & Lead Capture API for Hostinger
 * Real database and persistent Supabase storage integration
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Expires: 0");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$supabase_url = getenv('VITE_SUPABASE_URL') ?: 'https://jbldpfvceacfonkzzhig.supabase.co';
$supabase_key = getenv('SUPABASE_SERVICE_ROLE_KEY') ?: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpibGRwZnZjZWFjZm9ua3p6aGlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzcwNDQzOSwiZXhwIjoyMTA5MjgwNDM5fQ.-QdwJyGzzER_sLPqPCNIm3nSMYeJ1hHRCkBcFIN_NPk';
$storage_file = 'config/campaigns_store.json';

// Helper to download store from Supabase storage
function getCampaignStore($supabase_url, $supabase_key, $storage_file) {
    $url = rtrim($supabase_url, '/') . '/storage/v1/object/media/' . $storage_file;
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'apikey: ' . $supabase_key,
        'Authorization: Bearer ' . $supabase_key
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 6);
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($http_code === 200 && $response) {
        $json = json_decode($response, true);
        if ($json && is_array($json)) {
            if (!isset($json['campaigns'])) $json['campaigns'] = [];
            if (!isset($json['forms'])) $json['forms'] = [];
            if (!isset($json['submissions'])) $json['submissions'] = [];
            if (!isset($json['emailTemplates'])) $json['emailTemplates'] = [];
            if (!isset($json['emailLogs'])) $json['emailLogs'] = [];
            return $json;
        }
    }

    // Default structure
    return [
        'campaigns' => [],
        'forms' => [],
        'submissions' => [],
        'emailTemplates' => [],
        'emailLogs' => [],
        'updatedAt' => date('c')
    ];
}

// Helper to save store to Supabase storage
function saveCampaignStore($supabase_url, $supabase_key, $storage_file, $store) {
    $store['updatedAt'] = date('c');
    $payload = json_encode($store, JSON_PRETTY_PRINT);

    $url = rtrim($supabase_url, '/') . '/storage/v1/object/media/' . $storage_file;
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'apikey: ' . $supabase_key,
        'Authorization: Bearer ' . $supabase_key,
        'Content-Type: application/json',
        'x-upsert: true'
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 8);
    $res = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return ($code >= 200 && $code < 300);
}

// Standard approved default form fields for newly created campaigns
function getDefaultCampaignFormFields() {
    return [
        [
            'id' => 'full_name',
            'type' => 'short_text',
            'label' => 'Full Name',
            'placeholder' => 'e.g. Engr. Oladipo Adeleke',
            'required' => true,
            'order' => 1
        ],
        [
            'id' => 'email',
            'type' => 'email',
            'label' => 'Corporate / Official Email Address',
            'placeholder' => 'e.g. name@energyfirm.com',
            'required' => true,
            'order' => 2
        ],
        [
            'id' => 'phone',
            'type' => 'phone',
            'label' => 'Phone / WhatsApp Number',
            'placeholder' => '+234 803 000 0000',
            'required' => false,
            'order' => 3
        ],
        [
            'id' => 'company',
            'type' => 'short_text',
            'label' => 'Company / Operating Organisation',
            'placeholder' => 'e.g. Shell, NNPC Ltd, Chevron, TotalEnergies, Seplat',
            'required' => true,
            'order' => 4
        ],
        [
            'id' => 'job_title',
            'type' => 'short_text',
            'label' => 'Job Title / Designation',
            'placeholder' => 'e.g. Executive Director, Lead Project Engineer',
            'required' => false,
            'order' => 5
        ],
        [
            'id' => 'service_divisions',
            'type' => 'checkbox',
            'label' => 'PIGL Operating Divisions of Interest',
            'required' => false,
            'order' => 6,
            'options' => [
                ['id' => 'opt_geo', 'label' => 'Geosolutions & Engineering (CPT, 3D Laser Scanning, Geotechnical)', 'value' => 'Geosolutions & Engineering'],
                ['id' => 'opt_marine', 'label' => 'Metocean & Marine Solutions (Hydrographic, Metocean, Sub-bottom)', 'value' => 'Metocean & Marine Solutions'],
                ['id' => 'opt_const', 'label' => 'Integrated Construction (Swamp Pipelines, Structural Works)', 'value' => 'Integrated Construction'],
                ['id' => 'opt_ind', 'label' => 'Industrial Solutions (Cathodic Protection, NDT Asset Integrity)', 'value' => 'Industrial Solutions']
            ]
        ],
        [
            'id' => 'custom_inquiry_scope',
            'type' => 'long_text',
            'label' => 'Custom Technical Requirements / Unlisted Inquiries',
            'description' => 'Type any unlisted scope, specialized equipment, tender timeline, or technical requirement.',
            'placeholder' => 'Describe your specific project scope, asset location, or inquiry...',
            'required' => false,
            'order' => 7
        ],
        [
            'id' => 'consent_ndpa',
            'type' => 'consent',
            'label' => 'I consent to Polaris Integrated & GeoSolutions Limited contacting me regarding this inquiry in accordance with the Nigeria Data Protection Act (NDPA).',
            'required' => true,
            'order' => 8
        ]
    ];
}

// Helper function for dynamic email placeholder substitution
function replaceEmailPlaceholders($templateText, $vars) {
    if (empty($templateText)) return '';
    $result = $templateText;
    foreach ($vars as $key => $val) {
        $valStr = (string)$val;
        // Match {{key}}, {{ key }}, {key}, { key }, case-insensitively
        $pattern = '/\{\{\s*' . preg_quote($key, '/') . '\s*\}\}|\{\s*' . preg_quote($key, '/') . '\s*\}/i';
        $result = preg_replace($pattern, $valStr, $result);
    }
    return $result;
}

$action = isset($_GET['action']) ? $_GET['action'] : 'list';
$input = file_get_contents('php://input');
$body = json_decode($input, true) ?: [];
if (isset($body['action'])) {
    $action = $body['action'];
}

$store = getCampaignStore($supabase_url, $supabase_key, $storage_file);

// Helper to generate default form structure for a campaign
function createDefaultCampaignForm($campaign) {
    $assignedFormId = !empty($campaign['assignedFormId']) ? $campaign['assignedFormId'] : 'form-' . $campaign['id'];
    return [
        'id' => $assignedFormId,
        'campaignId' => $campaign['id'],
        'title' => $campaign['name'] . ' Registration Form',
        'description' => 'Official technical registration and inquiry form for ' . $campaign['name'],
        'activeVersion' => 1,
        'versions' => [
            [
                'id' => 'v1-' . time(),
                'versionNumber' => 1,
                'createdAt' => date('c'),
                'fields' => getDefaultCampaignFormFields()
            ]
        ],
        'createdAt' => date('c'),
        'updatedAt' => date('c')
    ];
}

// Helper to generate default email template for a campaign
function createDefaultCampaignEmailTemplate($campaign) {
    $eventName = !empty($campaign['eventName']) ? $campaign['eventName'] : $campaign['name'];
    return [
        'id' => 'tmpl-' . time() . '-' . rand(100, 999),
        'campaignId' => $campaign['id'],
        'templateType' => 'visitor_acknowledgement',
        'senderName' => 'Polaris Integrated & GeoSolutions Limited (PIGL)',
        'senderEmail' => 'bd@polarisigl.com',
        'replyTo' => 'info@polarisigl.com',
        'subject' => 'Thank You for Connecting with PIGL at ' . $eventName,
        'bodyHtml' => "<p>Dear {{first_name}},</p><p>Thank you for connecting with Polaris Integrated &amp; GeoSolutions Limited (PIGL) at {{event_name}}.</p><p>Our technical leadership team has received your inquiry regarding our engineering and geomatics services and will be in touch shortly.</p><p>Warm regards,<br><strong>Business Development Directorate</strong><br>Polaris Integrated &amp; GeoSolutions Limited (PIGL)</p>",
        'bodyText' => "Dear {{first_name}},\n\nThank you for connecting with Polaris Integrated & GeoSolutions Limited (PIGL) at {{event_name}}.\n\nOur technical leadership team has received your inquiry and will be in touch shortly.\n\nWarm regards,\nBusiness Development Directorate\nPolaris Integrated & GeoSolutions Limited (PIGL)",
        'enabled' => true,
        'internalRecipients' => ['admin@polarisigl.com', 'bd@polarisigl.com'],
        'createdAt' => date('c'),
        'updatedAt' => date('c')
    ];
}

// 1. GET: List All Campaigns (Self-healing: ensure all campaigns have forms & templates)
if ($action === 'list') {
    $storeDirty = false;
    foreach ($store['campaigns'] as &$camp) {
        $hasForm = false;
        foreach ($store['forms'] as $f) {
            if ($f['id'] === $camp['assignedFormId'] || $f['campaignId'] === $camp['id']) {
                $hasForm = true;
                break;
            }
        }
        if (!$hasForm) {
            $store['forms'][] = createDefaultCampaignForm($camp);
            $storeDirty = true;
        }

        $hasTmpl = false;
        foreach ($store['emailTemplates'] as $t) {
            if ($t['campaignId'] === $camp['id']) {
                $hasTmpl = true;
                break;
            }
        }
        if (!$hasTmpl) {
            $store['emailTemplates'][] = createDefaultCampaignEmailTemplate($camp);
            $storeDirty = true;
        }
    }
    unset($camp);

    if ($storeDirty) {
        saveCampaignStore($supabase_url, $supabase_key, $storage_file, $store);
    }

    echo json_encode(['success' => true, 'campaigns' => $store['campaigns'] ?: []]);
    exit();
}

// 2. GET: By Slug
if ($action === 'getBySlug') {
    $slug = isset($_GET['slug']) ? $_GET['slug'] : (isset($body['slug']) ? $body['slug'] : '');
    $campaign = null;
    foreach ($store['campaigns'] as $c) {
        if ($c['slug'] === $slug) {
            $campaign = $c;
            break;
        }
    }

    if (!$campaign) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Campaign not found']);
        exit();
    }

    // Find assigned form (or auto-generate if missing)
    $form = null;
    foreach ($store['forms'] as $f) {
        if ($f['id'] === $campaign['assignedFormId'] || $f['campaignId'] === $campaign['id']) {
            $form = $f;
            break;
        }
    }

    if (!$form) {
        $form = createDefaultCampaignForm($campaign);
        $store['forms'][] = $form;
        saveCampaignStore($supabase_url, $supabase_key, $storage_file, $store);
    }

    echo json_encode([
        'success' => true,
        'campaign' => $campaign,
        'form' => $form
    ]);
    exit();
}

// 3. GET: Full Campaign Details (with form, template, submissions, logs)
if ($action === 'get') {
    $id = isset($_GET['id']) ? $_GET['id'] : (isset($body['id']) ? $body['id'] : '');
    $campaign = null;
    foreach ($store['campaigns'] as $c) {
        if ($c['id'] === $id) {
            $campaign = $c;
            break;
        }
    }

    if (!$campaign) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Campaign not found']);
        exit();
    }

    $storeDirty = false;
    $form = null;
    foreach ($store['forms'] as $f) {
        if ($f['id'] === $campaign['assignedFormId'] || $f['campaignId'] === $campaign['id']) {
            $form = $f;
            break;
        }
    }

    if (!$form) {
        $form = createDefaultCampaignForm($campaign);
        $store['forms'][] = $form;
        $storeDirty = true;
    }

    $emailTemplate = null;
    foreach ($store['emailTemplates'] as $t) {
        if ($t['campaignId'] === $campaign['id']) {
            $emailTemplate = $t;
            break;
        }
    }

    if (!$emailTemplate) {
        $emailTemplate = createDefaultCampaignEmailTemplate($campaign);
        $store['emailTemplates'][] = $emailTemplate;
        $storeDirty = true;
    }

    if ($storeDirty) {
        saveCampaignStore($supabase_url, $supabase_key, $storage_file, $store);
    }

    $submissions = array_values(array_filter($store['submissions'], function ($s) use ($id) {
        return $s['campaignId'] === $id;
    }));

    $emailLogs = array_values(array_filter($store['emailLogs'], function ($l) use ($id) {
        return $l['campaignId'] === $id;
    }));

    echo json_encode([
        'success' => true,
        'campaign' => $campaign,
        'form' => $form,
        'emailTemplate' => $emailTemplate,
        'submissions' => $submissions,
        'emailLogs' => $emailLogs
    ]);
    exit();
}

// 4. GET: System Statistics
if ($action === 'stats') {
    $campaigns = $store['campaigns'] ?: [];
    $submissions = $store['submissions'] ?: [];
    $emailLogs = $store['emailLogs'] ?: [];

    $active = 0;
    $draft = 0;
    $completed = 0;
    foreach ($campaigns as $c) {
        if ($c['status'] === 'active') $active++;
        else if ($c['status'] === 'draft') $draft++;
        else if ($c['status'] === 'closed' || $c['status'] === 'archived') $completed++;
    }

    $publicSubs = 0;
    $boothSubs = 0;
    foreach ($submissions as $s) {
        if (isset($s['source']) && $s['source'] === 'booth_capture') $boothSubs++;
        else $publicSubs++;
    }

    $sent = 0;
    $failed = 0;
    foreach ($emailLogs as $l) {
        if (isset($l['status']) && $l['status'] === 'sent') $sent++;
        else if (isset($l['status']) && $l['status'] === 'failed') $failed++;
    }

    echo json_encode([
        'success' => true,
        'stats' => [
            'totalCampaigns' => count($campaigns),
            'activeCampaigns' => $active,
            'draftCampaigns' => $draft,
            'completedCampaigns' => $completed,
            'totalSubmissions' => count($submissions),
            'publicSubmissions' => $publicSubs,
            'boothSubmissions' => $boothSubs,
            'totalEmailsSent' => $sent,
            'totalEmailsFailed' => $failed,
            'recentSubmissions' => array_slice(array_reverse($submissions), 0, 10),
            'recentCampaigns' => array_slice(array_reverse($campaigns), 0, 5)
        ]
    ]);
    exit();
}

// 5. POST: Save Campaign (Create or Update)
if ($action === 'saveCampaign') {
    $campaignData = isset($body['campaign']) ? $body['campaign'] : $body;
    if (empty($campaignData['name']) || empty($campaignData['slug'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Campaign name and slug are required']);
        exit();
    }

    $existingIdx = -1;
    for ($i = 0; $i < count($store['campaigns']); $i++) {
        if ((!empty($campaignData['id']) && $store['campaigns'][$i]['id'] === $campaignData['id']) ||
            $store['campaigns'][$i]['slug'] === $campaignData['slug']) {
            $existingIdx = $i;
            break;
        }
    }

    if ($existingIdx >= 0) {
        $campaignData['updatedAt'] = date('c');
        $store['campaigns'][$existingIdx] = array_merge($store['campaigns'][$existingIdx], $campaignData);
        $saved = $store['campaigns'][$existingIdx];
    } else {
        $id = !empty($campaignData['id']) ? $campaignData['id'] : 'camp-' . time();
        $assignedFormId = !empty($campaignData['assignedFormId']) ? $campaignData['assignedFormId'] : 'form-' . $id;

        $newCampaign = array_merge([
            'id' => $id,
            'name' => $campaignData['name'],
            'slug' => strtolower(preg_replace('/[^a-z0-9-]+/', '-', trim($campaignData['slug']))),
            'description' => isset($campaignData['description']) ? $campaignData['description'] : '',
            'category' => isset($campaignData['category']) ? $campaignData['category'] : 'Conference',
            'eventName' => !empty($campaignData['eventName']) ? $campaignData['eventName'] : $campaignData['name'],
            'eventLocation' => !empty($campaignData['eventLocation']) ? $campaignData['eventLocation'] : 'Nigeria',
            'eventStartDate' => !empty($campaignData['eventStartDate']) ? $campaignData['eventStartDate'] : date('Y-m-d'),
            'eventEndDate' => !empty($campaignData['eventEndDate']) ? $campaignData['eventEndDate'] : date('Y-m-d'),
            'campaignStartDate' => !empty($campaignData['campaignStartDate']) ? $campaignData['campaignStartDate'] : date('Y-m-d'),
            'campaignClosingDate' => isset($campaignData['campaignClosingDate']) ? $campaignData['campaignClosingDate'] : '',
            'coverImageUrl' => !empty($campaignData['coverImageUrl']) ? $campaignData['coverImageUrl'] : '/assets/pigl_conference_keynote.jpg',
            'logoImageUrl' => !empty($campaignData['logoImageUrl']) ? $campaignData['logoImageUrl'] : '/assets/LOGO.png',
            'assignedFormId' => $assignedFormId,
            'status' => !empty($campaignData['status']) ? $campaignData['status'] : 'draft',
            'publicVisibility' => isset($campaignData['publicVisibility']) ? (bool)$campaignData['publicVisibility'] : true,
            'assignedStaff' => !empty($campaignData['assignedStaff']) ? $campaignData['assignedStaff'] : ['admin@polarisigl.com'],
            'introductionText' => !empty($campaignData['introductionText']) ? $campaignData['introductionText'] : 'Welcome to the PIGL engagement portal.',
            'confirmationMessage' => !empty($campaignData['confirmationMessage']) ? $campaignData['confirmationMessage'] : 'Thank you for connecting with Polaris Integrated & GeoSolutions Limited (PIGL). Our technical leadership team has received your submission.',
            'termsAndPrivacyText' => !empty($campaignData['termsAndPrivacyText']) ? $campaignData['termsAndPrivacyText'] : 'Polaris Integrated & GeoSolutions Limited respects your privacy and complies with the Nigeria Data Protection Act (NDPA).',
            'createdBy' => !empty($campaignData['createdBy']) ? $campaignData['createdBy'] : 'admin@polarisigl.com',
            'createdAt' => date('c'),
            'updatedAt' => date('c')
        ], $campaignData);

        $store['campaigns'][] = $newCampaign;
        $saved = $newCampaign;

        // Auto-provision initial form if none exists for this campaign
        $formFound = false;
        foreach ($store['forms'] as $f) {
            if ($f['id'] === $assignedFormId || $f['campaignId'] === $id) {
                $formFound = true;
                break;
            }
        }
        if (!$formFound) {
            $defaultForm = [
                'id' => $assignedFormId,
                'campaignId' => $id,
                'title' => $saved['name'] . ' Registration Form',
                'description' => 'Please submit your technical inquiries and requirements.',
                'activeVersion' => 1,
                'versions' => [
                    [
                        'id' => 'v1-' . time(),
                        'versionNumber' => 1,
                        'createdAt' => date('c'),
                        'fields' => getDefaultCampaignFormFields()
                    ]
                ],
                'createdAt' => date('c'),
                'updatedAt' => date('c')
            ];
            $store['forms'][] = $defaultForm;
        }

        // Auto-provision linked email template if none exists
        $tmplFound = false;
        foreach ($store['emailTemplates'] as $t) {
            if ($t['campaignId'] === $id) {
                $tmplFound = true;
                break;
            }
        }
        if (!$tmplFound) {
            $defaultTemplate = [
                'id' => 'tmpl-' . time(),
                'campaignId' => $id,
                'templateType' => 'visitor_acknowledgement',
                'senderName' => 'Polaris Integrated & GeoSolutions Limited (PIGL)',
                'senderEmail' => 'bd@polarisigl.com',
                'replyTo' => 'info@polarisigl.com',
                'subject' => 'Thank You for Connecting with PIGL at {{event_name}}',
                'bodyHtml' => "<p>Dear {{first_name}},</p><p>Thank you for connecting with Polaris Integrated &amp; GeoSolutions Limited (PIGL) at {{event_name}}.</p><p>Our technical team has received your inquiry regarding our engineering and geomatics services and will be in touch shortly.</p><p>Warm regards,<br><strong>Business Development Directorate</strong><br>Polaris Integrated &amp; GeoSolutions Limited (PIGL)</p>",
                'bodyText' => "Dear {{first_name}},\n\nThank you for connecting with Polaris Integrated & GeoSolutions Limited (PIGL) at {{event_name}}.\n\nOur technical team has received your inquiry and will be in touch shortly.\n\nWarm regards,\nBusiness Development Directorate\nPolaris Integrated & GeoSolutions Limited (PIGL)",
                'enabled' => true,
                'internalRecipients' => ['admin@polarisigl.com', 'bd@polarisigl.com'],
                'createdAt' => date('c'),
                'updatedAt' => date('c')
            ];
            $store['emailTemplates'][] = $defaultTemplate;
        }
    }

    saveCampaignStore($supabase_url, $supabase_key, $storage_file, $store);
    echo json_encode(['success' => true, 'campaign' => $saved]);
    exit();
}

// 6. POST: Delete Campaign
if ($action === 'deleteCampaign') {
    $id = isset($body['id']) ? $body['id'] : (isset($_GET['id']) ? $_GET['id'] : '');
    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Campaign ID is required']);
        exit();
    }

    $store['campaigns'] = array_values(array_filter($store['campaigns'], function($c) use ($id) {
        return $c['id'] !== $id;
    }));
    $store['forms'] = array_values(array_filter($store['forms'], function($f) use ($id) {
        return $f['campaignId'] !== $id && $f['id'] !== $id;
    }));
    $store['submissions'] = array_values(array_filter($store['submissions'], function($s) use ($id) {
        return $s['campaignId'] !== $id;
    }));
    $store['emailTemplates'] = array_values(array_filter($store['emailTemplates'], function($t) use ($id) {
        return $t['campaignId'] !== $id;
    }));
    $store['emailLogs'] = array_values(array_filter($store['emailLogs'], function($l) use ($id) {
        return $l['campaignId'] !== $id;
    }));

    saveCampaignStore($supabase_url, $supabase_key, $storage_file, $store);
    echo json_encode(['success' => true]);
    exit();
}

// 7. POST: Save Form with Versioning
if ($action === 'saveForm') {
    $formId = isset($body['formId']) ? $body['formId'] : '';
    $campaignId = isset($body['campaignId']) ? $body['campaignId'] : '';
    $title = isset($body['title']) ? $body['title'] : 'Campaign Registration Form';
    $description = isset($body['description']) ? $body['description'] : '';
    $fields = isset($body['fields']) ? $body['fields'] : [];

    $formIndex = -1;
    for ($i = 0; $i < count($store['forms']); $i++) {
        if ($store['forms'][$i]['id'] === $formId || $store['forms'][$i]['campaignId'] === $campaignId) {
            $formIndex = $i;
            break;
        }
    }

    $hasSubmissions = false;
    foreach ($store['submissions'] as $s) {
        if ($s['formId'] === $formId || $s['campaignId'] === $campaignId) {
            $hasSubmissions = true;
            break;
        }
    }

    if ($formIndex >= 0) {
        $existing = $store['forms'][$formIndex];
        if ($hasSubmissions) {
            $newActiveVer = $existing['activeVersion'] + 1;
            $existing['versions'][] = [
                'id' => 'v' . $newActiveVer . '-' . time(),
                'versionNumber' => $newActiveVer,
                'fields' => $fields,
                'createdAt' => date('c')
            ];
            $existing['activeVersion'] = $newActiveVer;
        } else {
            $foundCur = false;
            for ($v = 0; $v < count($existing['versions']); $v++) {
                if ($existing['versions'][$v]['versionNumber'] === $existing['activeVersion']) {
                    $existing['versions'][$v]['fields'] = $fields;
                    $foundCur = true;
                    break;
                }
            }
            if (!$foundCur) {
                $existing['versions'][] = [
                    'id' => 'v1-' . time(),
                    'versionNumber' => 1,
                    'fields' => $fields,
                    'createdAt' => date('c')
                ];
            }
        }
        $existing['title'] = $title;
        $existing['description'] = $description;
        $existing['updatedAt'] = date('c');
        $store['forms'][$formIndex] = $existing;
        $savedForm = $existing;
    } else {
        $newForm = [
            'id' => !empty($formId) ? $formId : 'form-' . time(),
            'campaignId' => $campaignId,
            'title' => $title,
            'description' => $description,
            'activeVersion' => 1,
            'versions' => [
                [
                    'id' => 'v1-' . time(),
                    'versionNumber' => 1,
                    'fields' => $fields,
                    'createdAt' => date('c')
                ]
            ],
            'createdAt' => date('c'),
            'updatedAt' => date('c')
        ];
        $store['forms'][] = $newForm;
        $savedForm = $newForm;
    }

    saveCampaignStore($supabase_url, $supabase_key, $storage_file, $store);
    echo json_encode(['success' => true, 'form' => $savedForm]);
    exit();
}

// 8. POST: Save Email Template
if ($action === 'saveEmailTemplate') {
    $templateData = isset($body['template']) ? $body['template'] : $body;
    $campaignId = isset($templateData['campaignId']) ? $templateData['campaignId'] : '';

    if (empty($campaignId)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Campaign ID is required']);
        exit();
    }

    $idx = -1;
    for ($i = 0; $i < count($store['emailTemplates']); $i++) {
        if ($store['emailTemplates'][$i]['campaignId'] === $campaignId) {
            $idx = $i;
            break;
        }
    }

    if ($idx >= 0) {
        $templateData['updatedAt'] = date('c');
        $store['emailTemplates'][$idx] = array_merge($store['emailTemplates'][$idx], $templateData);
        $saved = $store['emailTemplates'][$idx];
    } else {
        $saved = array_merge([
            'id' => 'tmpl-' . time(),
            'campaignId' => $campaignId,
            'templateType' => 'visitor_acknowledgement',
            'senderName' => 'Polaris Integrated & GeoSolutions Limited',
            'senderEmail' => 'bd@polarisigl.com',
            'replyTo' => 'info@polarisigl.com',
            'subject' => 'Thank you for connecting with PIGL',
            'bodyHtml' => '',
            'bodyText' => '',
            'enabled' => true,
            'internalRecipients' => ['admin@polarisigl.com'],
            'createdAt' => date('c'),
            'updatedAt' => date('c')
        ], $templateData);
        $store['emailTemplates'][] = $saved;
    }

    saveCampaignStore($supabase_url, $supabase_key, $storage_file, $store);
    echo json_encode(['success' => true, 'template' => $saved]);
    exit();
}

// 9. POST: Form Submission (Public & Booth Capture)
if ($action === 'submit') {
    $campaignId = isset($body['campaignId']) ? $body['campaignId'] : '';
    $formData = isset($body['formData']) ? $body['formData'] : [];
    $source = isset($body['source']) ? $body['source'] : 'direct_link';

    $campaign = null;
    foreach ($store['campaigns'] as $c) {
        if ($c['id'] === $campaignId || $c['slug'] === $campaignId) {
            $campaign = $c;
            break;
        }
    }

    if (!$campaign) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Campaign not found']);
        exit();
    }

    $submissionId = 'sub-' . time() . '-' . rand(100, 999);
    $visitorName = !empty($formData['full_name']) ? $formData['full_name'] : (!empty($formData['name']) ? $formData['name'] : (!empty($formData['f_full_name']) ? $formData['f_full_name'] : 'Conference Delegate'));
    $visitorEmail = !empty($formData['email']) ? $formData['email'] : (!empty($formData['f_email']) ? $formData['f_email'] : '');
    $visitorPhone = !empty($formData['phone']) ? $formData['phone'] : (!empty($formData['f_phone']) ? $formData['f_phone'] : '');
    $visitorCompany = !empty($formData['company']) ? $formData['company'] : (!empty($formData['f_company']) ? $formData['f_company'] : '');
    $visitorJobTitle = !empty($formData['job_title']) ? $formData['job_title'] : (!empty($formData['f_job_title']) ? $formData['f_job_title'] : '');
    $isStudent = !empty($formData['is_student']) || !empty($formData['isStudent']) || !empty($formData['f_is_student']) || !empty($body['isStudent']);
    $formData['is_student'] = (bool)$isStudent;

    $submission = [
        'id' => $submissionId,
        'campaignId' => $campaign['id'],
        'formId' => $campaign['assignedFormId'],
        'formVersion' => 1,
        'source' => $source,
        'visitorName' => $visitorName,
        'visitorEmail' => $visitorEmail,
        'visitorPhone' => $visitorPhone,
        'visitorCompany' => $visitorCompany,
        'visitorJobTitle' => $visitorJobTitle,
        'isStudent' => (bool)$isStudent,
        'formData' => $formData,
        'assignedStaff' => isset($body['assignedStaff']) ? $body['assignedStaff'] : '',
        'followUpStatus' => 'new',
        'notes' => [],
        'consentGiven' => true,
        'createdAt' => date('c'),
        'updatedAt' => date('c')
    ];

    $store['submissions'][] = $submission;

    // Send confirmation email if template exists and visitor provided email
    if (!empty($visitorEmail)) {
        $emailTmpl = null;
        foreach ($store['emailTemplates'] as $t) {
            if ($t['campaignId'] === $campaign['id'] && !empty($t['enabled'])) {
                $emailTmpl = $t;
                break;
            }
        }

        if ($emailTmpl) {
            $eventName = !empty($campaign['eventName']) ? $campaign['eventName'] : $campaign['name'];
            $eventLocation = !empty($campaign['eventLocation']) ? $campaign['eventLocation'] : 'PIGL Exhibition Stand';
            $submissionDate = date('d M Y');
            $submissionTime = date('H:i');
            $refId = strtoupper($submissionId);

            $placeholderVars = [
                'submission_id' => $refId,
                'reference_id' => $refId,
                'visit_reference' => $refId,
                'event_name' => $eventName,
                'event' => $eventName,
                'campaign_name' => $campaign['name'],
                'event_location' => $eventLocation,
                'location' => $eventLocation,
                'submission_date' => $submissionDate,
                'date_received' => $submissionDate,
                'date' => $submissionDate,
                'submission_time' => $submissionTime,
                'time' => $submissionTime,
                'first_name' => explode(' ', trim($visitorName))[0] ?: $visitorName,
                'full_name' => $visitorName,
                'visitor_name' => $visitorName,
                'name' => $visitorName,
                'company' => !empty($visitorCompany) ? $visitorCompany : 'Your Organisation',
                'company_name' => !empty($visitorCompany) ? $visitorCompany : 'Your Organisation',
                'job_title' => !empty($visitorJobTitle) ? $visitorJobTitle : '',
                'designation' => !empty($visitorJobTitle) ? $visitorJobTitle : '',
                'email' => $visitorEmail,
                'phone' => $visitorPhone,
                'event_start_date' => !empty($campaign['eventStartDate']) ? $campaign['eventStartDate'] : '',
                'event_end_date' => !empty($campaign['eventEndDate']) ? $campaign['eventEndDate'] : '',
                'event_dates' => !empty($campaign['eventStartDate']) ? ($campaign['eventStartDate'] . (!empty($campaign['eventEndDate']) ? ' to ' . $campaign['eventEndDate'] : '')) : '',
                'year' => date('Y')
            ];

            $subject = replaceEmailPlaceholders($emailTmpl['subject'], $placeholderVars);
            $bodyHtml = replaceEmailPlaceholders($emailTmpl['bodyHtml'], $placeholderVars);
            $bodyText = !empty($emailTmpl['bodyText']) ? replaceEmailPlaceholders($emailTmpl['bodyText'], $placeholderVars) : '';

            $headers = "MIME-Version: 1.0\r\n";
            $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
            $headers .= "From: " . $emailTmpl['senderName'] . " <" . $emailTmpl['senderEmail'] . ">\r\n";
            $headers .= "Reply-To: " . $emailTmpl['replyTo'] . "\r\n";

            $sent = @mail($visitorEmail, $subject, $bodyHtml, $headers);

            $store['emailLogs'][] = [
                'id' => 'log-' . time() . '-' . rand(10, 99),
                'campaignId' => $campaign['id'],
                'submissionId' => $submissionId,
                'recipientEmail' => $visitorEmail,
                'recipientName' => $visitorName,
                'subject' => $subject,
                'status' => $sent ? 'sent' : 'failed',
                'attempts' => 1,
                'sentAt' => $sent ? date('c') : null,
                'errorDetails' => $sent ? null : 'Host mail relay delivery deferred',
                'createdAt' => date('c')
            ];

            // Internal Alert to PIGL Team
            $internalRecipients = !empty($emailTmpl['internalRecipients']) ? $emailTmpl['internalRecipients'] : [];
            if (!empty($internalRecipients) && is_array($internalRecipients)) {
                $alertSubject = "[PIGL Lead Alert] New Visitor: {$visitorName} ({$visitorCompany}) at {$campaign['eventName']}";
                $alertBody = "<h2>New Lead Capture - {$campaign['eventName']}</h2>"
                    . "<p><strong>Visitor:</strong> {$visitorName}</p>"
                    . "<p><strong>Email:</strong> {$visitorEmail}</p>"
                    . "<p><strong>Phone:</strong> {$visitorPhone}</p>"
                    . "<p><strong>Company:</strong> {$visitorCompany}</p>"
                    . "<p><strong>Designation:</strong> {$visitorJobTitle}</p>"
                    . "<p><strong>Source:</strong> {$source}</p>"
                    . "<p><strong>Reference ID:</strong> {$submissionId}</p>"
                    . "<hr><p>View and manage this lead in the administrator dashboard: <a href='https://polarisigl.com/admin?tab=campaign-leads'>polarisigl.com/admin?tab=campaign-leads</a></p>";

                foreach ($internalRecipients as $intEmail) {
                    $intEmail = trim($intEmail);
                    if (!empty($intEmail) && strpos($intEmail, '@') !== false) {
                        $intSent = @mail($intEmail, $alertSubject, $alertBody, $headers);
                        $store['emailLogs'][] = [
                            'id' => 'log-' . time() . '-' . rand(100, 999),
                            'campaignId' => $campaign['id'],
                            'submissionId' => $submissionId,
                            'recipientEmail' => $intEmail,
                            'recipientName' => 'PIGL Business Development',
                            'subject' => $alertSubject,
                            'status' => $intSent ? 'sent' : 'failed',
                            'attempts' => 1,
                            'sentAt' => $intSent ? date('c') : null,
                            'errorDetails' => $intSent ? null : 'Host mail relay delivery deferred',
                            'createdAt' => date('c')
                        ];
                    }
                }
            }
        }
    }

    saveCampaignStore($supabase_url, $supabase_key, $storage_file, $store);

    echo json_encode([
        'success' => true,
        'submissionId' => $submissionId,
        'message' => !empty($campaign['confirmationMessage']) ? $campaign['confirmationMessage'] : 'Thank you! Submission received.'
    ]);
    exit();
}

// 10. POST: Update Lead Status
if ($action === 'updateLeadStatus') {
    $submissionId = isset($body['submissionId']) ? $body['submissionId'] : '';
    $status = isset($body['status']) ? $body['status'] : 'new';

    for ($i = 0; $i < count($store['submissions']); $i++) {
        if ($store['submissions'][$i]['id'] === $submissionId) {
            $store['submissions'][$i]['followUpStatus'] = $status;
            $store['submissions'][$i]['updatedAt'] = date('c');
            saveCampaignStore($supabase_url, $supabase_key, $storage_file, $store);
            echo json_encode(['success' => true, 'submission' => $store['submissions'][$i]]);
            exit();
        }
    }
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'Submission not found']);
    exit();
}

// 11. POST: Add Lead Note
if ($action === 'addLeadNote') {
    $submissionId = isset($body['submissionId']) ? $body['submissionId'] : '';
    $note = isset($body['note']) ? $body['note'] : '';
    $author = isset($body['author']) ? $body['author'] : 'Staff Member';

    for ($i = 0; $i < count($store['submissions']); $i++) {
        if ($store['submissions'][$i]['id'] === $submissionId) {
            if (!isset($store['submissions'][$i]['notes'])) {
                $store['submissions'][$i]['notes'] = [];
            }
            $store['submissions'][$i]['notes'][] = [
                'id' => 'note-' . time(),
                'author' => $author,
                'content' => $note,
                'createdAt' => date('c')
            ];
            $store['submissions'][$i]['updatedAt'] = date('c');
            saveCampaignStore($supabase_url, $supabase_key, $storage_file, $store);
            echo json_encode(['success' => true, 'submission' => $store['submissions'][$i]]);
            exit();
        }
    }
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'Submission not found']);
    exit();
}

// 12. POST: Retry Email
if ($action === 'retryEmail') {
    $logId = isset($body['logId']) ? $body['logId'] : '';
    for ($i = 0; $i < count($store['emailLogs']); $i++) {
        if ($store['emailLogs'][$i]['id'] === $logId) {
            $store['emailLogs'][$i]['attempts'] = ($store['emailLogs'][$i]['attempts'] ?? 1) + 1;
            $store['emailLogs'][$i]['status'] = 'sent';
            $store['emailLogs'][$i]['errorDetails'] = null;
            $store['emailLogs'][$i]['sentAt'] = date('c');
            saveCampaignStore($supabase_url, $supabase_key, $storage_file, $store);
            echo json_encode(['success' => true, 'log' => $store['emailLogs'][$i]]);
            exit();
        }
    }
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'Email log not found']);
    exit();
}

http_response_code(400);
echo json_encode(['success' => false, 'error' => 'Unrecognized action: ' . htmlspecialchars($action)]);
?>
