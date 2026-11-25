<?php
/**
 * Polaris Integrated & GeoSolutions (PIGL)
 * Gated Interview Venue Check-In API Handler for Hostinger
 * - Stores live venue arrivals in ../data/interview_checkins.json
 * - Stores admin-generated receptionist access code in ../data/checkin_config.json
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data_dir = dirname(__DIR__) . '/data';
if (!is_dir($data_dir)) {
    @mkdir($data_dir, 0755, true);
}

$store_file  = $data_dir . '/interview_checkins.json';
$config_file = $data_dir . '/checkin_config.json';

function read_json_file($file) {
    if (!file_exists($file)) {
        return [];
    }
    $raw = @file_get_contents($file);
    if (!$raw) {
        return [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function write_json_file($file, $data) {
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    return @file_put_contents($file, $json, LOCK_EX) !== false;
}

function generate_access_code() {
    // Unambiguous uppercase characters & digits (no 0/O, 1/I)
    $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    $suffix = '';
    for ($i = 0; $i < 6; $i++) {
        $suffix .= $chars[random_int(0, strlen($chars) - 1)];
    }
    return 'PIGL-' . $suffix;
}

function get_or_init_code_config($config_file) {
    $cfg = read_json_file($config_file);
    if (!empty($cfg['accessCode'])) {
        return $cfg;
    }
    $tz = new DateTimeZone('Africa/Lagos');
    $now = new DateTime('now', $tz);
    $cfg = [
        'accessCode' => generate_access_code(),
        'generatedAt' => $now->format(DateTime::ATOM),
        'generatedDisplay' => $now->format('D, j M Y • g:i A') . ' WAT',
    ];
    write_json_file($config_file, $cfg);
    return $cfg;
}

function is_valid_code($submitted, $config_file) {
    $cfg = get_or_init_code_config($config_file);
    $expected = strtoupper(trim((string)($cfg['accessCode'] ?? '')));
    $actual   = strtoupper(trim((string)$submitted));
    if ($expected === '' || $actual === '') {
        return false;
    }
    return hash_equals($expected, $actual);
}

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? trim((string)$_GET['action']) : '';

// =============================================================================
// ACTION: GET ACTIVE RECEPTIONIST CODE (Admin Dashboard)
// =============================================================================
if ($method === 'GET' && $action === 'get-code') {
    $cfg = get_or_init_code_config($config_file);
    echo json_encode([
        'success' => true,
        'accessCode' => $cfg['accessCode'],
        'generatedAt' => $cfg['generatedAt'] ?? null,
        'generatedDisplay' => $cfg['generatedDisplay'] ?? null,
    ]);
    exit();
}

// =============================================================================
// ACTION: GENERATE / ROTATE RECEPTIONIST CODE (Admin Dashboard)
// =============================================================================
if ($method === 'POST' && $action === 'generate-code') {
    $tz = new DateTimeZone('Africa/Lagos');
    $now = new DateTime('now', $tz);
    $cfg = [
        'accessCode' => generate_access_code(),
        'generatedAt' => $now->format(DateTime::ATOM),
        'generatedDisplay' => $now->format('D, j M Y • g:i A') . ' WAT',
    ];
    if (!write_json_file($config_file, $cfg)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to save new receptionist code.']);
        exit();
    }
    echo json_encode([
        'success' => true,
        'accessCode' => $cfg['accessCode'],
        'generatedAt' => $cfg['generatedAt'],
        'generatedDisplay' => $cfg['generatedDisplay'],
    ]);
    exit();
}

// =============================================================================
// ACTION: VERIFY RECEPTIONIST CODE & RETURN CANDIDATE CHECK-IN STATE
// =============================================================================
if ($method === 'POST' && $action === 'verify-code') {
    $raw_input = file_get_contents('php://input');
    $payload = json_decode($raw_input, true);
    if (!is_array($payload)) {
        $payload = $_POST;
    }

    $submitted_code = isset($payload['accessCode']) ? (string)$payload['accessCode'] : '';
    $app_id = isset($payload['applicationId']) ? trim((string)$payload['applicationId']) : '';

    if (!is_valid_code($submitted_code, $config_file)) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'verified' => false,
            'error' => 'Invalid administrative access code. Please check with the office administrator.',
        ]);
        exit();
    }

    $checkin = null;
    if ($app_id !== '') {
        $checkins = read_json_file($store_file);
        if (isset($checkins[$app_id])) {
            $checkin = $checkins[$app_id];
        }
    }

    echo json_encode([
        'success' => true,
        'verified' => true,
        'checkedIn' => $checkin !== null,
        'checkin' => $checkin,
    ]);
    exit();
}

// =============================================================================
// GET: Fetch all check-ins (Admin Dashboard) or single record by ?id=...
// =============================================================================
if ($method === 'GET') {
    $checkins = read_json_file($store_file);
    $id = isset($_GET['id']) ? trim((string)$_GET['id']) : '';

    if ($id !== '') {
        $record = isset($checkins[$id]) ? $checkins[$id] : null;
        echo json_encode([
            'success' => true,
            'checkedIn' => $record !== null,
            'checkin' => $record,
        ]);
        exit();
    }

    echo json_encode([
        'success' => true,
        'count' => count($checkins),
        'checkins' => $checkins,
    ]);
    exit();
}

// =============================================================================
// POST: Gated Candidate Check-In (REQUIRES valid admin-generated accessCode)
// =============================================================================
if ($method === 'POST') {
    $raw_input = file_get_contents('php://input');
    $payload = json_decode($raw_input, true);
    if (!is_array($payload)) {
        $payload = $_POST;
    }

    $submitted_code = isset($payload['accessCode']) ? (string)$payload['accessCode'] : '';
    if (!is_valid_code($submitted_code, $config_file)) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'error' => 'Unauthorized: A valid administrative access code is required to admit candidates.',
        ]);
        exit();
    }

    $app_id = isset($payload['applicationId']) ? trim((string)$payload['applicationId']) : '';
    $candidate_name = isset($payload['candidateName']) ? trim((string)$payload['candidateName']) : 'Candidate';
    $job_title = isset($payload['jobTitle']) ? trim((string)$payload['jobTitle']) : '';
    $interview_date = isset($payload['interviewDate']) ? trim((string)$payload['interviewDate']) : '';
    $interview_time = isset($payload['interviewTime']) ? trim((string)$payload['interviewTime']) : '';
    $attendant_note = isset($payload['attendantNote']) ? trim((string)$payload['attendantNote']) : '';

    if ($app_id === '') {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Missing applicationId for check-in.',
        ]);
        exit();
    }

    $checkins = read_json_file($store_file);

    if (isset($checkins[$app_id]) && empty($payload['force'])) {
        echo json_encode([
            'success' => true,
            'alreadyCheckedIn' => true,
            'checkin' => $checkins[$app_id],
        ]);
        exit();
    }

    $tz = new DateTimeZone('Africa/Lagos');
    $now = new DateTime('now', $tz);

    $record = [
        'applicationId' => $app_id,
        'candidateName' => $candidate_name,
        'jobTitle' => $job_title,
        'interviewDate' => $interview_date,
        'interviewTime' => $interview_time,
        'checkedInAt' => $now->format(DateTime::ATOM),
        'checkedInTimeDisplay' => $now->format('g:i A') . ' WAT',
        'checkedInDateDisplay' => $now->format('D, j M Y'),
        'attendantNote' => $attendant_note,
    ];

    $checkins[$app_id] = $record;

    if (!write_json_file($store_file, $checkins)) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Unable to persist check-in record on server.',
        ]);
        exit();
    }

    echo json_encode([
        'success' => true,
        'alreadyCheckedIn' => false,
        'checkin' => $record,
    ]);
    exit();
}

// =============================================================================
// DELETE: Reset / remove a candidate's venue check-in status (Admin Dashboard)
// =============================================================================
if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? trim((string)$_GET['id']) : '';
    if ($id === '') {
        $raw_input = file_get_contents('php://input');
        $payload = json_decode($raw_input, true);
        if (is_array($payload) && isset($payload['applicationId'])) {
            $id = trim((string)$payload['applicationId']);
        }
    }

    if ($id === '') {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing id to remove.']);
        exit();
    }

    $checkins = read_json_file($store_file);
    if (isset($checkins[$id])) {
        unset($checkins[$id]);
        write_json_file($store_file, $checkins);
    }

    echo json_encode(['success' => true, 'removedId' => $id]);
    exit();
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed']);
