<?php
/**
 * Polaris Integrated & GeoSolutions (PIGL)
 * Bulk CV ZIP Generator API
 *
 * Streams a packaged ZIP archive of candidate CVs for a category or all applications.
 */

declare(strict_types=1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if (!class_exists('ZipArchive')) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'ZipArchive PHP extension is not available on this server.']);
    exit;
}

// Receive payload
$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input) && isset($_GET['category'])) {
    $input = ['category' => $_GET['category']];
}

$category = isset($input['category']) ? trim((string)$input['category']) : 'all';
$applications = isset($input['applications']) && is_array($input['applications']) ? $input['applications'] : [];

if (empty($applications)) {
    http_response_code(400);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'No applications provided to download.']);
    exit;
}

$safeCategory = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $category);
$zipFileName = 'PIGL_CVs_' . $safeCategory . '_' . date('Y-m-d') . '.zip';
$tempZipPath = tempnam(sys_get_temp_dir(), 'pigl_zip_');

$zip = new ZipArchive();
if ($zip->open($tempZipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'Failed to initialize temporary zip file.']);
    exit;
}

$manifest = "POLARIS INTEGRATED & GEOSOLUTIONS LIMITED (PIGL)\n";
$manifest .= "BULK CANDIDATE CV ARCHIVE: " . $category . "\n";
$manifest .= "Generated on: " . date('Y-m-d H:i:s T') . "\n";
$manifest .= str_repeat('=', 80) . "\n\n";

$downloadedCount = 0;
$usedNames = [];

foreach ($applications as $idx => $app) {
    $resumeUrl = isset($app['resume_url']) ? trim((string)$app['resume_url']) : '';
    if (empty($resumeUrl)) continue;

    $candName = isset($app['applicant_name']) ? preg_replace('/[^a-zA-Z0-9_\-]/', '_', trim((string)$app['applicant_name'])) : "Candidate_" . ($idx + 1);
    $roleName = isset($app['job_title']) ? preg_replace('/[^a-zA-Z0-9_\-]/', '_', trim((string)$app['job_title'])) : "General";

    $ext = 'pdf';
    $pathParts = pathinfo(parse_url($resumeUrl, PHP_URL_PATH));
    if (!empty($pathParts['extension'])) {
        $ext = strtolower($pathParts['extension']);
    }

    $entryName = "{$roleName} - {$candName}_CV.{$ext}";
    $c = 1;
    while (isset($usedNames[$entryName])) {
        $c++;
        $entryName = "{$roleName} - {$candName}_CV_{$c}.{$ext}";
    }
    $usedNames[$entryName] = true;

    // Fetch file content
    $content = null;
    if (strpos($resumeUrl, '/uploads/') === 0 && file_exists(__DIR__ . '/..' . $resumeUrl)) {
        $content = file_get_contents(__DIR__ . '/..' . $resumeUrl);
    } else {
        $ctx = stream_context_create([
            'http' => [
                'timeout' => 15,
                'user_agent' => 'PIGL-Archiver/1.0',
                'ignore_errors' => true
            ],
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false
            ]
        ]);
        $content = @file_get_contents($resumeUrl, false, $ctx);
    }

    if ($content !== false && strlen($content) > 100) {
        $zip->addFromString($entryName, $content);
        $downloadedCount++;
        $manifest .= "✓ " . ($app['applicant_name'] ?? 'Candidate') . " ({$roleName}) -> {$entryName}\n";
    } else {
        $manifest .= "✗ [DOWNLOAD FAILED] " . ($app['applicant_name'] ?? 'Candidate') . " -> {$resumeUrl}\n";
    }
}

$manifest .= "\n" . str_repeat('=', 80) . "\n";
$manifest .= "Total CVs archived: {$downloadedCount}\n";
$zip->addFromString('INDEX_MANIFEST.txt', $manifest);
$zip->close();

if (!file_exists($tempZipPath) || filesize($tempZipPath) === 0) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'ZIP file could not be generated.']);
    exit;
}

// Stream zip to browser
header('Content-Type: application/zip');
header('Content-Disposition: attachment; filename="' . $zipFileName . '"');
header('Content-Length: ' . (string)filesize($tempZipPath));
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

readfile($tempZipPath);
@unlink($tempZipPath);
exit;
