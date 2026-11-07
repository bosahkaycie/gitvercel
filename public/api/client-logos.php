<?php
/**
 * Polaris Integrated & GeoSolutions (PIGL)
 * Production Client Logos API Handler for Hostinger
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
$storage_file = 'config/client_logos.json';

$default_clients = [
    [
        'id' => 'client-shell',
        'name' => 'Shell',
        'category' => 'Direct Client',
        'role' => 'Operating Engagement',
        'logo_url' => '/assets/clients/shell.svg',
        'display_order' => 1,
        'status' => 'published'
    ],
    [
        'id' => 'client-nnpc',
        'name' => 'NNPC Limited',
        'category' => 'Industry Stakeholder',
        'role' => 'National Energy Infrastructure',
        'logo_url' => '/assets/clients/nnpc.svg',
        'display_order' => 2,
        'status' => 'published'
    ],
    [
        'id' => 'client-totalenergies',
        'name' => 'TotalEnergies',
        'category' => 'Direct Client',
        'role' => 'Offshore & Energy Operations',
        'logo_url' => '/assets/clients/totalenergies.svg',
        'display_order' => 3,
        'status' => 'published'
    ],
    [
        'id' => 'client-renaissance',
        'name' => 'Renaissance Africa Energy Company Limited',
        'category' => 'Industry Stakeholder',
        'role' => 'Upstream Asset Operations',
        'logo_url' => '/assets/clients/renaissance.svg',
        'display_order' => 4,
        'status' => 'published'
    ],
    [
        'id' => 'client-newcross',
        'name' => 'Newcross Exploration & Production',
        'category' => 'Project & Delivery Partner',
        'role' => 'Field Development Support',
        'logo_url' => '/assets/clients/newcross.svg',
        'display_order' => 5,
        'status' => 'published'
    ],
    [
        'id' => 'client-panocean',
        'name' => 'Pan Ocean Oil Corporation',
        'category' => 'Project & Delivery Partner',
        'role' => 'Exploration & Infrastructure',
        'logo_url' => '/assets/clients/panocean.svg',
        'display_order' => 6,
        'status' => 'published'
    ],
    [
        'id' => 'client-matrix',
        'name' => 'Matrix Energy Group',
        'category' => 'Direct Client',
        'role' => 'Downstream & Terminal Operations',
        'logo_url' => '/assets/clients/matrix.svg',
        'display_order' => 7,
        'status' => 'published'
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
        if ($json && is_array($json) && count($json) > 0) {
            echo json_encode(['success' => true, 'clients' => $json]);
            exit();
        }
    }

    echo json_encode(['success' => true, 'clients' => $default_clients]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $body = json_decode($input, true) ?: [];
    $clients = isset($body['clients']) ? $body['clients'] : $body;

    $url = rtrim($supabase_url, '/') . '/storage/v1/object/media/' . $storage_file;
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($clients));
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

    echo json_encode(['success' => true, 'clients' => $clients]);
    exit();
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed']);
