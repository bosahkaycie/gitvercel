<?php
/**
 * Polaris Integrated & GeoSolutions (PIGL)
 * Production Company Profile Document Management Handler for Hostinger
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

$storage_file = 'config/company_profile.json';

$default_document = [
    'id' => 'official-company-profile',
    'title' => 'Polaris Integrated & GeoSolutions Limited - Official Corporate Profile',
    'filename' => 'PIGL_Company_Profile.pdf',
    'file_url' => 'https://jbldpfvceacfonkzzhig.supabase.co/storage/v1/object/public/documents/company-profile/PIGL_Company_Profile.pdf',
    'storage_path' => 'company-profile/PIGL_Company_Profile.pdf',
    'storage_bucket' => 'documents',
    'file_type' => 'application/pdf',
    'file_size' => 11488310,
    'formatted_size' => '10.95 MB',
    'is_published' => true,
    'version' => '2026.1',
    'description' => 'Comprehensive corporate overview of PIGL engineering divisions, offshore assets, QA/QC certifications, and track record across Nigeria & West Africa.',
    'cover_image_url' => '/assets/PIGL COMPANY PROFILE.jpg',
    'upload_date' => date('c'),
    'updated_at' => date('c'),
    'updated_by' => 'admin@polarisigl.com'
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
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($status === 200 && $res) {
        $json = json_decode($res, true);
        if ($json) return $json;
    }
    return null;
}

function save_supabase_storage($url, $key, $path, $data) {
    $endpoint = rtrim($url, '/') . '/storage/v1/object/media/' . $path;
    $ch = curl_init($endpoint);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'apikey: ' . $key,
        'Authorization: Bearer ' . $key,
        'Content-Type: application/json',
        'x-upsert: true'
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    $res = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ($status >= 200 && $status < 300);
}

// 1. GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $doc = fetch_supabase_storage($supabase_url, $supabase_key, $storage_file);
    header("Cache-Control: no-cache, no-store, must-revalidate");
    echo json_encode([
        'success' => true,
        'document' => $doc ?: $default_document
    ]);
    exit();
}

// 2. POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $payload = json_decode($raw, true) ?: [];
    $action = $payload['action'] ?? 'save';
    $admin_email = $payload['adminEmail'] ?? 'admin@polarisigl.com';

    $current_doc = fetch_supabase_storage($supabase_url, $supabase_key, $storage_file) ?: $default_document;

    if ($action === 'publish') {
        $current_doc['is_published'] = true;
        $current_doc['updated_at'] = date('c');
        $current_doc['updated_by'] = $admin_email;
        save_supabase_storage($supabase_url, $supabase_key, $storage_file, $current_doc);
        echo json_encode(['success' => true, 'document' => $current_doc]);
        exit();
    }

    if ($action === 'unpublish') {
        $current_doc['is_published'] = false;
        $current_doc['updated_at'] = date('c');
        $current_doc['updated_by'] = $admin_email;
        save_supabase_storage($supabase_url, $supabase_key, $storage_file, $current_doc);
        echo json_encode(['success' => true, 'document' => $current_doc]);
        exit();
    }

    if ($action === 'remove') {
        $current_doc['is_published'] = false;
        $current_doc['file_url'] = '';
        $current_doc['filename'] = '';
        $current_doc['file_size'] = 0;
        $current_doc['formatted_size'] = '0 MB';
        $current_doc['updated_at'] = date('c');
        $current_doc['updated_by'] = $admin_email;
        save_supabase_storage($supabase_url, $supabase_key, $storage_file, $current_doc);
        echo json_encode(['success' => true, 'document' => $current_doc]);
        exit();
    }

    if ($action === 'save') {
        $updated = array_merge($current_doc, $payload['document'] ?? []);
        $updated['updated_at'] = date('c');
        $updated['updated_by'] = $admin_email;
        save_supabase_storage($supabase_url, $supabase_key, $storage_file, $updated);
        echo json_encode(['success' => true, 'document' => $updated]);
        exit();
    }

    echo json_encode(['success' => true, 'document' => $current_doc]);
    exit();
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
