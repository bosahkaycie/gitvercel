<?php
/**
 * Polaris Integrated & GeoSolutions (PIGL)
 * Production Page Headers & Breadcrumbs API Handler for Hostinger
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: public, max-age=60");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$supabase_url = getenv('VITE_SUPABASE_URL') ?: 'https://jbldpfvceacfonkzzhig.supabase.co';
$supabase_key = getenv('SUPABASE_SERVICE_ROLE_KEY') ?: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpibGRwZnZjZWFjZm9ua3p6aGlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzcwNDQzOSwiZXhwIjoyMTA5MjgwNDM5fQ.-QdwJyGzzER_sLPqPCNIm3nSMYeJ1hHRCkBcFIN_NPk';
$storage_file = 'config/page_headers.json';

$default_headers = [
    'pages' => [
        'home' => [
            'id' => 'home',
            'page_slug' => '/',
            'page_name' => 'Home',
            'breadcrumb_title' => 'Home',
            'fallback_image' => '/assets/newoffshore.png',
            'overlay_opacity' => 0.35
        ],
        'about' => [
            'id' => 'about',
            'page_slug' => '/about',
            'page_name' => 'About Us',
            'breadcrumb_title' => 'About Us',
            'fallback_image' => '/assets/teaching.jpeg',
            'overlay_opacity' => 0.30
        ],
        'services' => [
            'id' => 'services',
            'page_slug' => '/services',
            'page_name' => 'Our Services',
            'breadcrumb_title' => 'Services',
            'fallback_image' => '/assets/road.png',
            'overlay_opacity' => 0.35
        ],
        'projects' => [
            'id' => 'projects',
            'page_slug' => '/projects',
            'page_name' => 'Executed Projects & Case Studies',
            'breadcrumb_title' => 'Case studies',
            'fallback_image' => '/assets/newoffshore.png',
            'overlay_opacity' => 0.40
        ],
        'contact' => [
            'id' => 'contact',
            'page_slug' => '/contact',
            'page_name' => 'Contact Us',
            'breadcrumb_title' => 'Contact',
            'fallback_image' => '/assets/slider.jpeg',
            'overlay_opacity' => 0.40
        ],
        'careers' => [
            'id' => 'careers',
            'page_slug' => '/careers',
            'page_name' => 'Careers & Talent Acquisition',
            'breadcrumb_title' => 'Careers',
            'fallback_image' => '/assets/team.jpeg',
            'overlay_opacity' => 0.35
        ],
        'hsse' => [
            'id' => 'hsse',
            'page_slug' => '/hsse',
            'page_name' => 'Health, Safety, Security & Environment (HSSE)',
            'breadcrumb_title' => 'HSSE Policy',
            'fallback_image' => '/assets/boots_on_ground.jpeg',
            'overlay_opacity' => 0.35
        ],
        'network' => [
            'id' => 'network',
            'page_slug' => '/network',
            'page_name' => 'Regional & Global Network',
            'breadcrumb_title' => 'Our Network',
            'fallback_image' => '/assets/nigeria_footprint.png',
            'overlay_opacity' => 0.25
        ]
    ],
    'top_header' => [
        'top_header_bg_image' => '',
        'top_header_overlay_opacity' => 0.75,
        'top_header_active' => false
    ]
];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $url = rtrim($supabase_url, '/') . '/storage/v1/object/media/' . $storage_file;
    $ch = curl_init($url);
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
        $json = json_decode($response, true);
        if ($json && isset($json['pages'])) {
            $merged_pages = array_merge($default_headers['pages'], $json['pages']);
            $merged_top = isset($json['top_header']) ? array_merge($default_headers['top_header'], $json['top_header']) : $default_headers['top_header'];
            echo json_encode([
                'success' => true,
                'headers' => [
                    'pages' => $merged_pages,
                    'top_header' => $merged_top,
                    'updated_at' => isset($json['updated_at']) ? $json['updated_at'] : date('c')
                ]
            ]);
            exit();
        }
    }

    echo json_encode(['success' => true, 'headers' => $default_headers]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $body = json_decode($input, true) ?: [];

    $url = rtrim($supabase_url, '/') . '/storage/v1/object/media/' . $storage_file;
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($ch, CURLOPT_POSTFIELDS, $input);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'apikey: ' . $supabase_key,
        'Authorization: Bearer ' . $supabase_key,
        'Content-Type: application/json',
        'x-upsert: true'
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    echo json_encode(['success' => true, 'message' => 'Headers updated']);
    exit();
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed']);
