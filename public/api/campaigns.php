<?php
/**
 * Polaris Integrated & GeoSolutions Limited (PIGL)
 * Production Campaigns & Lead Capture API for Hostinger
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

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
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($http_code === 200 && $response) {
        $json = json_decode($response, true);
        if ($json && is_array($json)) {
            return $json;
        }
    }

    // Default fallback structure
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
    curl_setopt($ch, CURLOPT_TIMEOUT, 6);
    $res = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return ($code >= 200 && $code < 300);
}

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : 'list';
$input = file_get_contents('php://input');
$body = json_decode($input, true) ?: [];
if (isset($body['action'])) {
    $action = $body['action'];
}

$store = getCampaignStore($supabase_url, $supabase_key, $storage_file);

// 1. GET: List
if ($action === 'list') {
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
    $form = null;
    foreach ($store['forms'] as $f) {
        if ($f['id'] === $campaign['assignedFormId'] || $f['campaignId'] === $campaign['id']) {
            $form = $f;
            break;
        }
    }
    echo json_encode(['success' => true, 'campaign' => $campaign, 'form' => $form]);
    exit();
}

// 3. GET: Full Details for Admin
if ($action === 'get') {
    $id = isset($_GET['id']) ? $_GET['id'] : '';
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
    $form = null;
    foreach ($store['forms'] as $f) {
        if ($f['id'] === $campaign['assignedFormId'] || $f['campaignId'] === $campaign['id']) {
            $form = $f;
            break;
        }
    }
    $emailTemplate = null;
    foreach ($store['emailTemplates'] as $t) {
        if ($t['campaignId'] === $campaign['id']) {
            $emailTemplate = $t;
            break;
        }
    }
    $submissions = array_values(array_filter($store['submissions'], function($s) use ($id) {
        return $s['campaignId'] === $id;
    }));
    $emailLogs = array_values(array_filter($store['emailLogs'], function($l) use ($id) {
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

// 4. GET: Stats
if ($action === 'stats') {
    $campaigns = $store['campaigns'] ?: [];
    $submissions = $store['submissions'] ?: [];
    $logs = $store['emailLogs'] ?: [];

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
        if ($s['source'] === 'booth_capture') $boothSubs++;
        else $publicSubs++;
    }

    $sent = 0;
    $failed = 0;
    foreach ($logs as $l) {
        if ($l['status'] === 'sent') $sent++;
        else if ($l['status'] === 'failed') $failed++;
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

// 5. POST: Save Campaign
if ($action === 'saveCampaign') {
    $campaignData = isset($body['campaign']) ? $body['campaign'] : $body;
    if (empty($campaignData['name']) || empty($campaignData['slug'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Campaign name and slug required']);
        exit();
    }

    $existingIdx = -1;
    for ($i = 0; $i < count($store['campaigns']); $i++) {
        if ($store['campaigns'][$i]['id'] === $campaignData['id'] || $store['campaigns'][$i]['slug'] === $campaignData['slug']) {
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
        $campaignData['id'] = $id;
        $campaignData['createdAt'] = date('c');
        $campaignData['updatedAt'] = date('c');
        $store['campaigns'][] = $campaignData;
        $saved = $campaignData;
    }

    saveCampaignStore($supabase_url, $supabase_key, $storage_file, $store);
    echo json_encode(['success' => true, 'campaign' => $saved]);
    exit();
}

// 6. POST: Form Submission
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

    $submissionId = 'sub-' . time() . '-' . substr(md5(uniqid()), 0, 4);
    $visitorName = !empty($formData['f_full_name']) ? $formData['f_full_name'] : (!empty($formData['full_name']) ? $formData['full_name'] : 'Conference Delegate');
    $visitorEmail = !empty($formData['f_email']) ? $formData['f_email'] : (!empty($formData['email']) ? $formData['email'] : '');
    $visitorPhone = !empty($formData['f_phone']) ? $formData['f_phone'] : '';
    $visitorCompany = !empty($formData['f_company']) ? $formData['f_company'] : '';
    $visitorJobTitle = !empty($formData['f_job_title']) ? $formData['f_job_title'] : '';

    $submission = [
        'id' => $submissionId,
        'campaignId' => $campaign['id'],
        'campaignSlug' => $campaign['slug'],
        'formId' => $campaign['assignedFormId'],
        'formVersionId' => 'v1',
        'source' => $source,
        'visitorName' => $visitorName,
        'visitorEmail' => $visitorEmail,
        'visitorPhone' => $visitorPhone,
        'visitorCompany' => $visitorCompany,
        'visitorJobTitle' => $visitorJobTitle,
        'formData' => $formData,
        'assignedStaff' => isset($body['assignedStaff']) ? $body['assignedStaff'] : '',
        'followUpStatus' => 'new',
        'notes' => [],
        'consentGiven' => true,
        'createdAt' => date('c'),
        'updatedAt' => date('c')
    ];

    $store['submissions'][] = $submission;
    saveCampaignStore($supabase_url, $supabase_key, $storage_file, $store);

    echo json_encode([
        'success' => true,
        'submissionId' => $submissionId,
        'message' => !empty($campaign['confirmationMessage']) ? $campaign['confirmationMessage'] : 'Thank you! Submission received.'
    ]);
    exit();
}

// 7. POST: Update Lead Status
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

http_response_code(400);
echo json_encode(['success' => false, 'error' => 'Unknown action']);
?>
