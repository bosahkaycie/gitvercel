<?php
/**
 * Polaris Integrated & GeoSolutions (PIGL)
 * Production Management Team API Handler for Hostinger
 * Manages team member directory with high-availability local storage and Supabase backup
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

// Server-side persistent storage file on Hostinger
$data_dir = dirname(__DIR__) . '/data';
if (!is_dir($data_dir)) {
    mkdir($data_dir, 0755, true);
}
$storage_file = $data_dir . '/team_members.json';

// Authoritative default management team members
$default_team = [
    [
        'id' => 'team-1',
        'name' => 'Dr. Chigozie Dimgba',
        'role' => 'MD / Chief Executive Officer',
        'image' => '/assets/management/chigozie.png',
        'bio' => 'Doctorate in Geodesy and Geomatics Engineering, Fellow of the Nigerian Institution of Surveyors (fnis). Dr. Dimgba brings over 20 years of technical expertise in offshore geodetic positioning, geotechnical investigations, high-density 3D reality capture, and corporate governance across Sub-Saharan Africa.',
        'linkedin' => 'https://www.linkedin.com/company/polarisigl/',
        'email' => 'chigozie@polarisigl.com',
        'department' => 'Executive Leadership',
        'display_order' => 1,
        'status' => 'active',
        'created_at' => '2026-01-01T00:00:00Z',
        'updated_at' => date('c')
    ],
    [
        'id' => 'team-2',
        'name' => 'Nnenna Ndubuisi',
        'role' => 'Chief Corporate Officer',
        'image' => '/assets/management/nnenna.png',
        'bio' => 'Senior corporate governance executive directing institutional administration, statutory compliance, human capital strategy, and organizational efficiency across PIGL\'s multidisciplinary engineering and marine operations.',
        'linkedin' => 'https://www.linkedin.com/company/polarisigl/',
        'email' => 'nnenna@polarisigl.com',
        'department' => 'Corporate Officers',
        'display_order' => 2,
        'status' => 'active',
        'created_at' => '2026-01-01T00:00:00Z',
        'updated_at' => date('c')
    ],
    [
        'id' => 'team-3',
        'name' => 'Adamu Alumum Isaac',
        'role' => 'Chief Financial Officer',
        'image' => '/assets/management/isaac.png',
        'bio' => 'Chartered financial strategist with extensive experience across upstream energy financial governance, treasury optimization, capital asset underwriting, and commercial risk mitigation for major infrastructure assignments.',
        'linkedin' => 'https://www.linkedin.com/company/polarisigl/',
        'email' => 'isaac@polarisigl.com',
        'department' => 'Corporate Officers',
        'display_order' => 3,
        'status' => 'active',
        'created_at' => '2026-01-01T00:00:00Z',
        'updated_at' => date('c')
    ],
    [
        'id' => 'team-4',
        'name' => 'Analiefo Nzegwu',
        'role' => 'Executive Director of Operations',
        'image' => '/assets/management/Anali.png',
        'bio' => 'Executive Director of Operations overseeing day-to-day engineering mobilization, marine vessel logistics, calibrated survey fleet operations, and offshore Niger Delta field campaigns.',
        'linkedin' => 'https://www.linkedin.com/company/polarisigl/',
        'email' => 'analiefo@polarisigl.com',
        'department' => 'Operations & Intelligence',
        'display_order' => 4,
        'status' => 'active',
        'created_at' => '2026-01-01T00:00:00Z',
        'updated_at' => date('c')
    ],
    [
        'id' => 'team-5',
        'name' => 'Layefa Chituru Igbe',
        'role' => 'Head, Business Development',
        'image' => '/assets/management/layefa.png',
        'bio' => 'Leads strategic commercial partnerships, upstream operator tendering, joint ventures with international technology partners, and technical market expansion throughout West Africa.',
        'linkedin' => 'https://www.linkedin.com/company/polarisigl/',
        'email' => 'layefa@polarisigl.com',
        'department' => 'Operations & Intelligence',
        'display_order' => 5,
        'status' => 'active',
        'created_at' => '2026-01-01T00:00:00Z',
        'updated_at' => date('c')
    ],
    [
        'id' => 'team-6',
        'name' => 'Uduma Ikpa Obianuju',
        'role' => 'Company Secretary / Legal Advisor',
        'image' => '/assets/management/uju.png',
        'bio' => 'Coordinates project delivery administration, milestone tracking, regulatory documentation, client reporting protocols, and ISO audit alignments for PIGL engineering contracts.',
        'linkedin' => 'https://www.linkedin.com/company/polarisigl/',
        'email' => 'uduma@polarisigl.com',
        'department' => 'Operations & Intelligence',
        'display_order' => 6,
        'status' => 'active',
        'created_at' => '2026-01-01T00:00:00Z',
        'updated_at' => date('c')
    ],
    [
        'id' => 'team-7',
        'name' => 'Brian Akpotowo',
        'role' => 'Head, Technical Services',
        'image' => '/assets/management/brian.png',
        'bio' => 'Pioneers high-density 3D reality capture, Leica RTC360 laser scanning campaigns, drone photogrammetry, as-built BIM model conversion, and brownfield digital twin delivery for oil and gas facilities.',
        'linkedin' => 'https://www.linkedin.com/company/polarisigl/',
        'email' => 'brian@polarisigl.com',
        'department' => 'Operations & Intelligence',
        'display_order' => 7,
        'status' => 'active',
        'created_at' => '2026-01-01T00:00:00Z',
        'updated_at' => date('c')
    ],
    [
        'id' => 'team-8',
        'name' => 'Steve Ubani',
        'role' => 'Head, QHSSE & Field Operations',
        'image' => '/assets/management/steve.png',
        'bio' => 'Directs field operational crews, geotechnical hydraulic CPTu pontoon mobilizations, precision geodetic GPS networks, and pipeline route surveys across coastal, swamp, and deepwater corridors.',
        'linkedin' => 'https://www.linkedin.com/company/polarisigl/',
        'email' => 'steve@polarisigl.com',
        'department' => 'Operations & Intelligence',
        'display_order' => 8,
        'status' => 'active',
        'created_at' => '2026-01-01T00:00:00Z',
        'updated_at' => date('c')
    ]
];

// Read current stored team
function getCurrentTeam($storage_file, $default_team) {
    if (file_exists($storage_file)) {
        $content = file_get_contents($storage_file);
        $json = json_decode($content, true);
        if ($json && is_array($json) && count($json) > 0) {
            return $json;
        }
    }
    return $default_team;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $team = getCurrentTeam($storage_file, $default_team);
    echo json_encode(['success' => true, 'team' => $team]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw_input = file_get_contents('php://input');
    $body = json_decode($raw_input, true) ?: [];

    $current_team = getCurrentTeam($storage_file, $default_team);
    $action = $body['action'] ?? 'save_all';

    if ($action === 'save' && !empty($body['member'])) {
        $member = $body['member'];
        $id = !empty($member['id']) ? $member['id'] : 'team-' . time();
        $member['id'] = $id;
        $member['updated_at'] = date('c');

        $found = false;
        foreach ($current_team as $idx => $existing) {
            if ($existing['id'] === $id) {
                $current_team[$idx] = array_merge($existing, $member);
                $found = true;
                break;
            }
        }
        if (!$found) {
            $member['created_at'] = $member['created_at'] ?? date('c');
            $current_team[] = $member;
        }
    } elseif ($action === 'delete' && !empty($body['id'])) {
        $id_to_delete = $body['id'];
        $current_team = array_values(array_filter($current_team, function($m) use ($id_to_delete) {
            return $m['id'] !== $id_to_delete;
        }));
    } elseif (isset($body['team']) && is_array($body['team'])) {
        $current_team = $body['team'];
    } elseif (is_array($body) && array_is_list($body)) {
        $current_team = $body;
    }

    // Sort by display_order
    usort($current_team, function($a, $b) {
        return ($a['display_order'] ?? 0) <=> ($b['display_order'] ?? 0);
    });

    // Save to server-side JSON file
    file_put_contents($storage_file, json_encode($current_team, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    @chmod($storage_file, 0666);

    // Also attempt background sync to Supabase storage / database if accessible
    $storage_sync_url = rtrim($supabase_url, '/') . '/storage/v1/object/media/config/team_members.json';
    $ch = curl_init($storage_sync_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($current_team));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'apikey: ' . $supabase_key,
        'Authorization: Bearer ' . $supabase_key,
        'Content-Type: application/json',
        'x-upsert: true'
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 2);
    @curl_exec($ch);
    @curl_close($ch);

    echo json_encode(['success' => true, 'team' => $current_team]);
    exit();
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed']);
