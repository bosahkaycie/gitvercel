<?php
/**
 * Polaris Integrated & GeoSolutions (PIGL)
 * Production Social Media Links Backend Handler for Hostinger
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

$storage_file = 'config/social_links.json';

$default_social_links = [
    [
        'id' => 'social-linkedin',
        'platform' => 'linkedin',
        'label' => 'LinkedIn',
        'url' => 'https://www.linkedin.com/company/polarisigl/',
        'handle' => '@polarisigl',
        'icon_type' => 'preset',
        'brand_color' => '#0A66C2',
        'hover_color' => '#004182',
        'is_active' => true,
        'display_order' => 1,
        'show_in_footer' => true,
        'show_in_contact' => true,
        'show_in_header' => false,
        'aria_label' => 'PIGL on LinkedIn',
        'created_at' => '2026-01-01T00:00:00.000Z',
        'updated_at' => '2026-01-01T00:00:00.000Z'
    ],
    [
        'id' => 'social-youtube',
        'platform' => 'youtube',
        'label' => 'YouTube',
        'url' => 'https://www.youtube.com/@polarisigl',
        'handle' => '@polarisigl',
        'icon_type' => 'preset',
        'brand_color' => '#FF0000',
        'hover_color' => '#CC0000',
        'is_active' => true,
        'display_order' => 2,
        'show_in_footer' => true,
        'show_in_contact' => true,
        'show_in_header' => false,
        'aria_label' => 'PIGL Official YouTube Channel',
        'created_at' => '2026-01-01T00:00:00.000Z',
        'updated_at' => '2026-01-01T00:00:00.000Z'
    ],
    [
        'id' => 'social-whatsapp',
        'platform' => 'whatsapp',
        'label' => 'WhatsApp Business',
        'url' => 'https://wa.me/2348097081333',
        'handle' => '+234 809 7081 333',
        'icon_type' => 'preset',
        'brand_color' => '#25D366',
        'hover_color' => '#128C7E',
        'is_active' => true,
        'display_order' => 3,
        'show_in_footer' => true,
        'show_in_contact' => true,
        'show_in_header' => false,
        'aria_label' => 'Chat with PIGL on WhatsApp',
        'created_at' => '2026-01-01T00:00:00.000Z',
        'updated_at' => '2026-01-01T00:00:00.000Z'
    ],
    [
        'id' => 'social-twitter',
        'platform' => 'twitter',
        'label' => 'X (Twitter)',
        'url' => 'https://x.com/polarisigl',
        'handle' => '@polarisigl',
        'icon_type' => 'preset',
        'brand_color' => '#000000',
        'hover_color' => '#1DA1F2',
        'is_active' => false,
        'display_order' => 4,
        'show_in_footer' => true,
        'show_in_contact' => true,
        'show_in_header' => false,
        'aria_label' => 'PIGL on X (Twitter)',
        'created_at' => '2026-01-01T00:00:00.000Z',
        'updated_at' => '2026-01-01T00:00:00.000Z'
    ],
    [
        'id' => 'social-instagram',
        'platform' => 'instagram',
        'label' => 'Instagram',
        'url' => 'https://www.instagram.com/polarisigl',
        'handle' => '@polarisigl',
        'icon_type' => 'preset',
        'brand_color' => '#E4405F',
        'hover_color' => '#C13584',
        'is_active' => false,
        'display_order' => 5,
        'show_in_footer' => true,
        'show_in_contact' => true,
        'show_in_header' => false,
        'aria_label' => 'PIGL on Instagram',
        'created_at' => '2026-01-01T00:00:00.000Z',
        'updated_at' => '2026-01-01T00:00:00.000Z'
    ],
    [
        'id' => 'social-facebook',
        'platform' => 'facebook',
        'label' => 'Facebook',
        'url' => 'https://www.facebook.com/polarisigl',
        'handle' => 'polarisigl',
        'icon_type' => 'preset',
        'brand_color' => '#1877F2',
        'hover_color' => '#0d65d9',
        'is_active' => false,
        'display_order' => 6,
        'show_in_footer' => true,
        'show_in_contact' => true,
        'show_in_header' => false,
        'aria_label' => 'PIGL on Facebook',
        'created_at' => '2026-01-01T00:00:00.000Z',
        'updated_at' => '2026-01-01T00:00:00.000Z'
    ]
];

function fetch_supabase_storage($url, $key, $path) {
    $endpoint = rtrim($url, '/') . '/storage/v1/object/media/' . $path;
    $ch = curl_init($endpoint);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'apikey: ' . $key,
        'Authorization: Bearer ' . $key
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    $res = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ['code' => $code, 'body' => $res];
}

function upload_supabase_storage($url, $key, $path, $json_data) {
    $endpoint = rtrim($url, '/') . '/storage/v1/object/media/' . $path;
    $ch = curl_init($endpoint);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'apikey: ' . $key,
        'Authorization: Bearer ' . $key,
        'Content-Type: application/json',
        'x-upsert: true'
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    $res = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ['code' => $code, 'body' => $res];
}

// 1. GET: Fetch current social links
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $resp = fetch_supabase_storage($supabase_url, $supabase_key, $storage_file);
    if ($resp['code'] === 200 && !empty($resp['body'])) {
        $data = json_decode($resp['body'], true);
        if ($data) {
            $links = isset($data['social_links']) ? $data['social_links'] : (is_array($data) ? $data : $default_social_links);
            echo json_encode(['success' => true, 'social_links' => $links]);
            exit();
        }
    }
    // Fallback default
    echo json_encode(['success' => true, 'social_links' => $default_social_links]);
    exit();
}

// 2. POST: Save updated social links
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $payload = json_decode($input, true);

    if (!$payload) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid JSON payload.']);
        exit();
    }

    $links = isset($payload['social_links']) ? $payload['social_links'] : $payload;
    if (!is_array($links)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'social_links must be an array.']);
        exit();
    }

    $save_payload = [
        'social_links' => $links,
        'updated_at' => date('c'),
        'updated_by' => isset($payload['updated_by']) ? $payload['updated_by'] : 'admin@polarisigl.com'
    ];

    $upload_resp = upload_supabase_storage($supabase_url, $supabase_key, $storage_file, json_encode($save_payload, JSON_PRETTY_PRINT));

    if ($upload_resp['code'] >= 200 && $upload_resp['code'] < 300) {
        echo json_encode(['success' => true, 'social_links' => $links, 'updated_at' => $save_payload['updated_at']]);
        exit();
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to save to Supabase storage.', 'details' => $upload_resp['body']]);
        exit();
    }
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed.']);
