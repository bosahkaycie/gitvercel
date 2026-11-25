<?php
/**
 * Polaris Integrated & GeoSolutions (PIGL)
 * Interview Venue Check-In API Handler for Hostinger
 * Stores live candidate venue arrivals in ../data/interview_checkins.json
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

$store_file = $data_dir . '/interview_checkins.json';

function read_checkins($file) {
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

function write_checkins($file, $data) {
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    return @file_put_contents($file, $json, LOCK_EX) !== false;
}

$method = $_SERVER['REQUEST_METHOD'];

// GET: Fetch all check-ins or a specific candidate's check-in by ?id=...
if ($method === 'GET') {
    $checkins = read_checkins($store_file);
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

// POST: Record a candidate arrival / check-in at the interview venue
if ($method === 'POST') {
    $raw_input = file_get_contents('php://input');
    $payload = json_decode($raw_input, true);
    if (!is_array($payload)) {
        $payload = $_POST;
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

    $checkins = read_checkins($store_file);

    // If already checked in, preserve original arrival time unless forced
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

    if (!write_checkins($store_file, $checkins)) {
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

// DELETE: Reset / remove a candidate's venue check-in status (admin action)
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

    $checkins = read_checkins($store_file);
    if (isset($checkins[$id])) {
        unset($checkins[$id]);
        write_checkins($store_file, $checkins);
    }

    echo json_encode(['success' => true, 'removedId' => $id]);
    exit();
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed']);
