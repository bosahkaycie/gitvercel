<?php
/**
 * PIGL Dynamic Careers OpenGraph & Social Preview Router
 * Serves optimized OpenGraph (og:image, og:title, og:description) and Twitter Card tags
 * for social media crawlers (WhatsApp, Facebook, LinkedIn, Twitter/X, Telegram, Slack, iMessage)
 * when a job vacancy link is shared, and serves the full React application shell for human visitors.
 */

// 1. Extract job ID from query or URI
$jobId = isset($_GET['job']) ? trim($_GET['job']) : '';
if (empty($jobId)) {
    $jobId = isset($_GET['id']) ? trim($_GET['id']) : '';
}
if (empty($jobId)) {
    $requestUri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
    if (preg_match('#^/careers/([^/]+)#', $requestUri, $matches)) {
        $jobId = $matches[1];
    }
}
$jobId = preg_replace('/[^a-zA-Z0-9_-]/', '', $jobId);

// 2. Locate base index.html
$indexPath = __DIR__ . '/index.html';
if (!file_exists($indexPath)) {
    $distIndexPath = dirname(__DIR__) . '/dist/index.html';
    if (file_exists($distIndexPath)) {
        $indexPath = $distIndexPath;
    }
}

if (!file_exists($indexPath)) {
    http_response_code(404);
    echo "PIGL application shell not found.";
    exit();
}

$html = file_get_contents($indexPath);

// If no specific job requested (e.g. general /careers), return standard index.html
if (empty($jobId) || $jobId === 'careers') {
    header('Content-Type: text/html; charset=UTF-8');
    echo $html;
    exit();
}

// 3. Fallback Job Registry with exact user-uploaded flyer graphics
$fallbackJobs = [
    'job-digital-asset-manager' => [
        'id' => 'job-digital-asset-manager',
        'title' => 'Digital Asset Manager',
        'department' => 'Digital Intelligence & Marketing',
        'location' => 'Port Harcourt (On-site)',
        'type' => 'Full-time',
        'experience_level' => '3+ Years',
        'description' => 'We are seeking a creative, organised and results-driven Digital Asset Manager to oversee and manage the company\'s digital presence across multiple platforms.',
        'image_url' => 'https://polarisigl.com/assets/careers/digital-asset-manager.jpg'
    ],
    'digital-asset-manager' => [
        'id' => 'job-digital-asset-manager',
        'title' => 'Digital Asset Manager',
        'department' => 'Digital Intelligence & Marketing',
        'location' => 'Port Harcourt (On-site)',
        'type' => 'Full-time',
        'experience_level' => '3+ Years',
        'description' => 'We are seeking a creative, organised and results-driven Digital Asset Manager to oversee and manage the company\'s digital presence across multiple platforms.',
        'image_url' => 'https://polarisigl.com/assets/careers/digital-asset-manager.jpg'
    ],
    'job-hydrographic-surveyor' => [
        'id' => 'job-hydrographic-surveyor',
        'title' => 'Hydrographic Surveyor',
        'department' => 'Marine & Coastal Intelligence',
        'location' => 'Port Harcourt (On-site)',
        'type' => 'Full-time',
        'experience_level' => '3+ Years',
        'description' => 'We are hiring a Hydrographic Surveyor to plan and execute hydrographic survey operations in swamp, coastal and offshore environments.',
        'image_url' => 'https://polarisigl.com/assets/careers/hydrographic-surveyor.jpg'
    ],
    'hydrographic-surveyor' => [
        'id' => 'job-hydrographic-surveyor',
        'title' => 'Hydrographic Surveyor',
        'department' => 'Marine & Coastal Intelligence',
        'location' => 'Port Harcourt (On-site)',
        'type' => 'Full-time',
        'experience_level' => '3+ Years',
        'description' => 'We are hiring a Hydrographic Surveyor to plan and execute hydrographic survey operations in swamp, coastal and offshore environments.',
        'image_url' => 'https://polarisigl.com/assets/careers/hydrographic-surveyor.jpg'
    ],
    'job-project-surveyor' => [
        'id' => 'job-project-surveyor',
        'title' => 'Project Surveyor',
        'department' => 'Geospatial & Geomatics',
        'location' => 'Port Harcourt (On-site)',
        'type' => 'Full-time',
        'experience_level' => '4+ Years',
        'description' => 'We are seeking an experienced Project Surveyor to plan, coordinate and execute land, swamp and offshore surveying activities in support of energy projects.',
        'image_url' => 'https://polarisigl.com/assets/careers/project-surveyor.jpg'
    ],
    'project-surveyor' => [
        'id' => 'job-project-surveyor',
        'title' => 'Project Surveyor',
        'department' => 'Geospatial & Geomatics',
        'location' => 'Port Harcourt (On-site)',
        'type' => 'Full-time',
        'experience_level' => '4+ Years',
        'description' => 'We are seeking an experienced Project Surveyor to plan, coordinate and execute land, swamp and offshore surveying activities in support of energy projects.',
        'image_url' => 'https://polarisigl.com/assets/careers/project-surveyor.jpg'
    ],
    'job-geophysical-surveyor' => [
        'id' => 'job-geophysical-surveyor',
        'title' => 'Geophysical Surveyor',
        'department' => 'Geophysical Exploration',
        'location' => 'Port Harcourt (On-site)',
        'type' => 'Full-time',
        'experience_level' => '3+ Years',
        'description' => 'We are hiring a Geophysical Surveyor to plan, execute and supervise geophysical surveys across swamp, land and offshore project sites.',
        'image_url' => 'https://polarisigl.com/assets/careers/geophysical-surveyor.jpg'
    ],
    'geophysical-surveyor' => [
        'id' => 'job-geophysical-surveyor',
        'title' => 'Geophysical Surveyor',
        'department' => 'Geophysical Exploration',
        'location' => 'Port Harcourt (On-site)',
        'type' => 'Full-time',
        'experience_level' => '3+ Years',
        'description' => 'We are hiring a Geophysical Surveyor to plan, execute and supervise geophysical surveys across swamp, land and offshore project sites.',
        'image_url' => 'https://polarisigl.com/assets/careers/geophysical-surveyor.jpg'
    ],
    'job-data-processor-marine-survey' => [
        'id' => 'job-data-processor-marine-survey',
        'title' => 'Data Processor – Marine Survey',
        'department' => 'Marine Survey & Data Processing',
        'location' => 'Port Harcourt (On-site)',
        'type' => 'Full-time',
        'experience_level' => '2+ Years',
        'description' => 'We are seeking a detail-oriented Data Processor for Marine Survey to process, validate and interpret marine geophysical and geospatial data.',
        'image_url' => 'https://polarisigl.com/assets/careers/data-processor-marine-survey.jpg'
    ],
    'data-processor-marine-survey' => [
        'id' => 'job-data-processor-marine-survey',
        'title' => 'Data Processor – Marine Survey',
        'department' => 'Marine Survey & Data Processing',
        'location' => 'Port Harcourt (On-site)',
        'type' => 'Full-time',
        'experience_level' => '2+ Years',
        'description' => 'We are seeking a detail-oriented Data Processor for Marine Survey to process, validate and interpret marine geophysical and geospatial data.',
        'image_url' => 'https://polarisigl.com/assets/careers/data-processor-marine-survey.jpg'
    ],
    'job-project-manager' => [
        'id' => 'job-project-manager',
        'title' => 'Project Manager',
        'department' => 'Project Management & Operations',
        'location' => 'Port Harcourt (On-site)',
        'type' => 'Full-time',
        'experience_level' => '5+ Years',
        'description' => 'We are hiring a Project Manager to oversee the planning, execution, monitoring and completion of engineering and geosolutions projects.',
        'image_url' => 'https://polarisigl.com/assets/careers/project-manager.jpg'
    ],
    'project-manager' => [
        'id' => 'job-project-manager',
        'title' => 'Project Manager',
        'department' => 'Project Management & Operations',
        'location' => 'Port Harcourt (On-site)',
        'type' => 'Full-time',
        'experience_level' => '5+ Years',
        'description' => 'We are hiring a Project Manager to oversee the planning, execution, monitoring and completion of engineering and geosolutions projects.',
        'image_url' => 'https://polarisigl.com/assets/careers/project-manager.jpg'
    ]
];

$job = null;

// 4. Check Fast Local Cache (TTL: 120 seconds)
$cacheDir = sys_get_temp_dir();
$cacheFile = $cacheDir . '/pigl_og_career_' . md5($jobId) . '.json';
if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < 120)) {
    $cached = @json_decode(file_get_contents($cacheFile), true);
    if (!empty($cached['title'])) {
        $job = $cached;
    }
}

// 5. Query Supabase REST API if not in cache
if (!$job) {
    $supabaseUrl = getenv('VITE_SUPABASE_URL') ?: 'https://jbldpfvceacfonkzzhig.supabase.co';
    $supabaseKey = getenv('SUPABASE_SERVICE_ROLE_KEY') ?: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpibGRwZnZjZWFjZm9ua3p6aGlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzcwNDQzOSwiZXhwIjoyMTA5MjgwNDM5fQ.-QdwJyGzzER_sLPqPCNIm3nSMYeJ1hHRCkBcFIN_NPk';
    $apiUrl = rtrim($supabaseUrl, '/') . '/rest/v1/job_openings?id=eq.' . urlencode($jobId) . '&select=id,title,department,location,type,experience_level,description,status&limit=1';

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 3);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 2);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'apikey: ' . $supabaseKey,
        'Authorization: Bearer ' . $supabaseKey,
        'Accept: application/json'
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200 && !empty($response)) {
        $data = json_decode($response, true);
        if (is_array($data) && count($data) > 0) {
            $rawJob = $data[0];
            // Extract image from description comment if present
            $imageUrl = '';
            if (!empty($rawJob['description']) && preg_match('/<!--\s*pigl_job_image:\s*([^\s>]+)\s*-->/', $rawJob['description'], $imgMatch)) {
                $imageUrl = $imgMatch[1];
            }
            $cleanDesc = !empty($rawJob['description']) ? trim(preg_replace('/\s*<!--\s*pigl_job_image:\s*[\s\S]*?-->\s*$/', '', $rawJob['description'])) : '';
            $job = [
                'id' => $rawJob['id'],
                'title' => $rawJob['title'],
                'department' => $rawJob['department'],
                'location' => $rawJob['location'] ?? 'Port Harcourt (On-site)',
                'type' => $rawJob['type'] ?? 'Full-time',
                'experience_level' => $rawJob['experience_level'] ?? '3+ Years',
                'description' => $cleanDesc,
                'image_url' => $imageUrl
            ];
            @file_put_contents($cacheFile, json_encode($job));
        }
    }
}

// Fallback to static job registry
if (!$job && isset($fallbackJobs[$jobId])) {
    $job = $fallbackJobs[$jobId];
}

// If job could not be resolved, serve standard index.html
if (!$job) {
    header('Content-Type: text/html; charset=UTF-8');
    echo $html;
    exit();
}

// 6. Format Metadata Fields
$jobTitle = $job['title'];
$pageTitle = "We are Hiring: {$jobTitle} | PIGL Careers";
$jobLocation = !empty($job['location']) ? $job['location'] : 'Port Harcourt (On-site)';
$jobType = !empty($job['type']) ? $job['type'] : 'Full-time';
$pageDesc = "PIGL is hiring a {$jobTitle} in {$jobLocation} ({$jobType}). " . (!empty($job['description']) ? $job['description'] : 'View full role responsibilities, qualifications, and apply online.');
$pageDesc = trim(preg_replace('/\s+/', ' ', strip_tags($pageDesc)));

// Resolve Image to Absolute URL
$jobImage = !empty($job['image_url']) ? $job['image_url'] : '';
if (empty($jobImage)) {
    // Check fallback registry
    if (isset($fallbackJobs[$job['id']]['image_url'])) {
        $jobImage = $fallbackJobs[$job['id']]['image_url'];
    } else {
        $jobImage = 'https://polarisigl.com/og-image.jpg?v=2';
    }
}
if (strpos($jobImage, 'http://') !== 0 && strpos($jobImage, 'https://') !== 0) {
    $jobImage = 'https://polarisigl.com' . (strpos($jobImage, '/') === 0 ? '' : '/') . $jobImage;
}

$pageUrl = 'https://polarisigl.com/careers?job=' . rawurlencode($job['id']);

// 7. Inject Meta Tags into HTML
$html = preg_replace('/<title>.*?<\/title>/is', '<title>' . htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') . '</title>', $html);
$html = preg_replace('/<meta\s+name=["\']description["\']\s+content=["\'].*?["\']/is', '<meta name="description" content="' . htmlspecialchars($pageDesc, ENT_QUOTES, 'UTF-8') . '"', $html);
$html = preg_replace('/<link\s+rel=["\']canonical["\']\s+href=["\'].*?["\']/is', '<link rel="canonical" href="' . htmlspecialchars($pageUrl, ENT_QUOTES, 'UTF-8') . '"', $html);

// Open Graph
$html = preg_replace('/<meta\s+property=["\']og:type["\']\s+content=["\'].*?["\']/is', '<meta property="og:type" content="website"', $html);
$html = preg_replace('/<meta\s+property=["\']og:title["\']\s+content=["\'].*?["\']/is', '<meta property="og:title" content="' . htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') . '"', $html);
$html = preg_replace('/<meta\s+property=["\']og:description["\']\s+content=["\'].*?["\']/is', '<meta property="og:description" content="' . htmlspecialchars($pageDesc, ENT_QUOTES, 'UTF-8') . '"', $html);
$html = preg_replace('/<meta\s+property=["\']og:url["\']\s+content=["\'].*?["\']/is', '<meta property="og:url" content="' . htmlspecialchars($pageUrl, ENT_QUOTES, 'UTF-8') . '"', $html);

// Image Tags
$html = preg_replace('/<meta\s+property=["\']og:image["\']\s+content=["\'].*?["\']/is', '<meta property="og:image" content="' . htmlspecialchars($jobImage, ENT_QUOTES, 'UTF-8') . '"', $html);
$html = preg_replace('/<meta\s+property=["\']og:image:secure_url["\']\s+content=["\'].*?["\']/is', '<meta property="og:image:secure_url" content="' . htmlspecialchars($jobImage, ENT_QUOTES, 'UTF-8') . '"', $html);
$html = preg_replace('/<meta\s+property=["\']og:image:alt["\']\s+content=["\'].*?["\']/is', '<meta property="og:image:alt" content="' . htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') . '"', $html);

// Twitter Card
$html = preg_replace('/<meta\s+name=["\']twitter:card["\']\s+content=["\'].*?["\']/is', '<meta name="twitter:card" content="summary_large_image"', $html);
$html = preg_replace('/<meta\s+name=["\']twitter:title["\']\s+content=["\'].*?["\']/is', '<meta name="twitter:title" content="' . htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') . '"', $html);
$html = preg_replace('/<meta\s+name=["\']twitter:description["\']\s+content=["\'].*?["\']/is', '<meta name="twitter:description" content="' . htmlspecialchars($pageDesc, ENT_QUOTES, 'UTF-8') . '"', $html);
$html = preg_replace('/<meta\s+name=["\']twitter:url["\']\s+content=["\'].*?["\']/is', '<meta name="twitter:url" content="' . htmlspecialchars($pageUrl, ENT_QUOTES, 'UTF-8') . '"', $html);
$html = preg_replace('/<meta\s+name=["\']twitter:image["\']\s+content=["\'].*?["\']/is', '<meta name="twitter:image" content="' . htmlspecialchars($jobImage, ENT_QUOTES, 'UTF-8') . '"', $html);
$html = preg_replace('/<meta\s+name=["\']twitter:image:alt["\']\s+content=["\'].*?["\']/is', '<meta name="twitter:image:alt" content="' . htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') . '"', $html);

// Schema.org JobPosting Structured Data
$jsonLd = [
    '@context' => 'https://schema.org',
    '@type' => 'JobPosting',
    'title' => $jobTitle,
    'description' => $pageDesc,
    'datePosted' => date('Y-m-d'),
    'employmentType' => strtoupper(str_replace('-', '_', $jobType)),
    'hiringOrganization' => [
        '@type' => 'Organization',
        'name' => 'Polaris Integrated & GeoSolutions Limited (PIGL)',
        'sameAs' => 'https://polarisigl.com',
        'logo' => 'https://polarisigl.com/icon-512.png'
    ],
    'jobLocation' => [
        '@type' => 'Place',
        'address' => [
            '@type' => 'PostalAddress',
            'addressLocality' => 'Port Harcourt',
            'addressRegion' => 'Rivers State',
            'addressCountry' => 'NG'
        ]
    ],
    'image' => $jobImage
];
$jsonLdScript = "\n  <script type=\"application/ld+json\">\n" . json_encode($jsonLd, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n  </script>";

$html = str_replace('</head>', $jsonLdScript . "\n</head>", $html);

// 8. Output Response
header('Content-Type: text/html; charset=UTF-8');
header('Cache-Control: public, max-age=300, stale-while-revalidate=600');
echo $html;
exit();
