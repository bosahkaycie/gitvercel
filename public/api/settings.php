<?php
/**
 * Polaris Integrated & GeoSolutions (PIGL)
 * Production Site Settings API Handler for Hostinger
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
$storage_file = 'config/site_settings.json';

$default_settings = [
    'phone' => '+234 809 708 1333',
    'phone_raw' => '+2348097081333',
    'emergency_line' => '+234 803 708 1333',
    'whatsapp_number' => '+234 809 708 1333',
    'whatsapp_url' => 'https://wa.me/2348097081333',
    'email_info' => 'hello@polarisigl.com',
    'email_support' => 'support@polarisigl.com',
    'email_inquiries' => 'inquiries@polarisigl.com',
    'email_procurement' => 'procurement@polarisigl.com',
    'email_careers' => 'careers@polarisigl.com',
    'address_hq' => '#3, Diamond Close, Castle & Green Estate, Off Eneka Link Road, Port Harcourt, Rivers State, Nigeria',
    'address_short' => '#3, Diamond Close, Port Harcourt, Rivers State, Nigeria',
    'linkedin_url' => 'https://www.linkedin.com/company/polarisigl/',
    'youtube_url' => 'https://www.youtube.com/@polarisigl',
    'stat_years_experience' => '15+',
    'stat_safe_hours' => '500k+',
    'stat_completed_projects' => '120+',
    'stat_client_satisfaction' => '99%',
    'hero_slide_interval' => 10
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
        if ($json) {
            echo json_encode(['success' => true, 'settings' => array_merge($default_settings, $json)]);
            exit();
        }
    }

    echo json_encode(['success' => true, 'settings' => $default_settings]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    $new_settings = isset($data['settings']) ? $data['settings'] : ($data ?: []);
    $payload = array_merge($default_settings, $new_settings);
    $payload['updated_at'] = date('c');

    $url = rtrim($supabase_url, '/') . '/storage/v1/object/media/' . $storage_file;
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
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

    if ($http_code >= 200 && $http_code < 300) {
        echo json_encode(['success' => true, 'settings' => $payload]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Storage persistence failed', 'settings' => $payload]);
    }
    exit();
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed']);
