<?php
/**
 * Polaris Integrated & GeoSolutions (PIGL)
 * Production Sliders API Handler for Hostinger
 * Supports both local server persistence and Supabase sync
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$supabase_url = getenv('VITE_SUPABASE_URL') ?: 'https://jbldpfvceacfonkzzhig.supabase.co';
$supabase_key = getenv('SUPABASE_SERVICE_ROLE_KEY') ?: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpibGRwZnZjZWFjZm9ua3p6aGlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzcwNDQzOSwiZXhwIjoyMTA5MjgwNDM5fQ.-QdwJyGzzER_sLPqPCNIm3nSMYeJ1hHRCkBcFIN_NPk';

$data_dir = dirname(__DIR__) . '/data';
if (!is_dir($data_dir)) {
    mkdir($data_dir, 0755, true);
}
$storage_file = $data_dir . '/sliders.json';

$default_sliders = [
    [
        'id' => '3bd59604-1015-41e0-bcb1-c087fa769342',
        'title' => 'Metocean & Marine Solutions',
        'subtitle' => 'LIFECYCLE PHASE 01 // METOCEAN & MARINE SOLUTIONS',
        'description' => 'Real-time ocean observation, metocean forecasting, marine environmental monitoring, and operational advisory across maritime domains.',
        'desktop_image' => '/assets/new_ocean.webp',
        'mobile_image' => '/assets/DJI_0003.jpg',
        'video_url' => '/assets/FRANKSTAR LOOP.mp4',
        'cta_text' => 'Explore Division Capabilities',
        'cta_url' => '/services/metocean-marine-solutions',
        'display_order' => 1,
        'is_active' => true,
        'updated_at' => '2026-10-24T20:00:00.000Z'
    ],
    [
        'id' => 'c72b6c96-00ff-48d7-9589-1f2ef3a24aee',
        'title' => 'GeoSolutions & Engineering Services',
        'subtitle' => 'LIFECYCLE PHASE 02 // GEOSOLUTIONS & ENGINEERING',
        'description' => 'Accurate data. Deeper insight. Smarter engineering. High-resolution seismic, geophysical & hydrographic survey, geotechnical investigation, reality capture, and laboratory testing.',
        'desktop_image' => '/assets/seismic_survey.webp',
        'mobile_image' => '/assets/DJI_0003.jpg',
        'video_url' => '/assets/OFFSHORE INTELLIGENCE.mp4',
        'cta_text' => 'Explore Division Capabilities',
        'cta_url' => '/services/geosolutions-engineering-services',
        'display_order' => 2,
        'is_active' => true,
        'updated_at' => '2026-10-24T20:00:00.000Z'
    ],
    [
        'id' => '52f9111a-7fc9-4668-9f04-3fdbb37ef77d',
        'title' => 'Integrated Construction Services',
        'subtitle' => 'LIFECYCLE PHASE 03 // INTEGRATED CONSTRUCTION SERVICES',
        'description' => 'From engineering preparation to successful project delivery. Integrated pipeline construction, civil infrastructure, structural steel fabrication, and commissioning support.',
        'desktop_image' => '/assets/newpipeline.webp',
        'mobile_image' => '/assets/DJI_0003.jpg',
        'video_url' => '/assets/PIPELINE_CONSTRUCTION.mp4',
        'cta_text' => 'Explore Division Capabilities',
        'cta_url' => '/services/integrated-construction-services',
        'display_order' => 3,
        'is_active' => true,
        'updated_at' => '2026-10-24T20:00:00.000Z'
    ],
    [
        'id' => '9f5faf33-0d6b-4373-b86b-c989b330ba60',
        'title' => 'Industrial Solutions',
        'subtitle' => 'LIFECYCLE PHASE 04 // INDUSTRIAL SOLUTIONS',
        'description' => 'Cleaner water. Healthier communities. Sustainable industries. Produced water treatment, industrial & domestic water solutions, water laboratory analysis, and wastewater recovery.',
        'desktop_image' => '/assets/water_treatment_skid.jpg',
        'mobile_image' => '/assets/DJI_0003.jpg',
        'video_url' => '/assets/DIGITAL INTELLINGENCE.mp4',
        'cta_text' => 'Explore Division Capabilities',
        'cta_url' => '/services/industrial-solutions',
        'display_order' => 4,
        'is_active' => true,
        'updated_at' => '2026-10-24T20:00:00.000Z'
    ]
];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // 1. Try local storage file first
    if (file_exists($storage_file)) {
        $content = file_get_contents($storage_file);
        $json = json_decode($content, true);
        if ($json && is_array($json) && count($json) > 0) {
            echo $content;
            exit();
        }
    }

    // 2. Try Supabase REST database
    $query_url = rtrim($supabase_url, '/') . '/rest/v1/sliders?select=*&order=display_order.asc';
    $ch = curl_init($query_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'apikey: ' . $supabase_key,
        'Authorization: Bearer ' . $supabase_key
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 3);
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($http_code === 200 && $response) {
        $parsed = json_decode($response, true);
        if ($parsed && is_array($parsed) && count($parsed) > 0) {
            file_put_contents($storage_file, $response);
            echo $response;
            exit();
        }
    }

    // 3. Fallback to default seed sliders
    echo json_encode($default_sliders);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw_input = file_get_contents('php://input');
    $body = json_decode($raw_input, true) ?: [];

    $current_sliders = [];
    if (file_exists($storage_file)) {
        $current_sliders = json_decode(file_get_contents($storage_file), true) ?: [];
    }
    if (empty($current_sliders)) {
        $current_sliders = $default_sliders;
    }

    $action = $body['action'] ?? 'save_all';

    if ($action === 'save' && !empty($body['slider'])) {
        $slider = $body['slider'];
        $found = false;
        foreach ($current_sliders as $idx => $s) {
            if ($s['id'] === $slider['id']) {
                $current_sliders[$idx] = array_merge($s, $slider);
                $found = true;
                break;
            }
        }
        if (!$found) {
            $current_sliders[] = $slider;
        }
    } elseif ($action === 'delete' && !empty($body['id'])) {
        $id = $body['id'];
        $current_sliders = array_values(array_filter($current_sliders, function($s) use ($id) {
            return $s['id'] !== $id;
        }));
    } elseif (isset($body['sliders']) && is_array($body['sliders'])) {
        $current_sliders = $body['sliders'];
    } elseif (is_array($body) && array_is_list($body)) {
        $current_sliders = $body;
    }

    file_put_contents($storage_file, json_encode($current_sliders, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    @chmod($storage_file, 0666);

    echo json_encode(['success' => true, 'sliders' => $current_sliders]);
    exit();
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed']);
