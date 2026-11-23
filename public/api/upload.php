<?php
/**
 * Polaris Integrated & GeoSolutions (PIGL)
 * Production Media Upload & Image Optimization Handler for Hostinger
 * Supports both Multipart Form Upload and JSON Base64 Upload
 * Automatically optimizes images, strips metadata, and converts to WebP
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

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode([
        'status' => 'ready',
        'service' => 'Polaris Integrated & GeoSolutions Media Upload API',
        'webp_support' => function_exists('imagewebp'),
        'timestamp' => date('c')
    ]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed. Use POST.']);
    exit();
}

// Ensure target uploads directory exists
$upload_dir = dirname(__DIR__) . '/assets/uploads';
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

$temp_file = null;
$original_name = 'upload';
$content_type = 'application/octet-stream';

// Check if multipart form upload ($_FILES['file'])
if (!empty($_FILES['file']['tmp_name']) && is_uploaded_file($_FILES['file']['tmp_name'])) {
    $temp_file = $_FILES['file']['tmp_name'];
    $original_name = $_FILES['file']['name'];
    $content_type = $_FILES['file']['type'] ?: mime_content_type($temp_file);
} else {
    // Check if JSON body with base64 data
    $raw_input = file_get_contents('php://input');
    $body = json_decode($raw_input, true) ?: [];
    
    if (!empty($body['fileBase64'])) {
        $base64_data = $body['fileBase64'];
        if (preg_match('/^data:([^;]+);base64,(.+)$/', $base64_data, $matches)) {
            $content_type = $matches[1];
            $binary_data = base64_decode($matches[2]);
        } else {
            $binary_data = base64_decode($base64_data);
        }

        if (!$binary_data) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Failed to decode base64 file data.']);
            exit();
        }

        $original_name = !empty($body['filename']) ? $body['filename'] : 'upload_' . time();
        if (!empty($body['contentType'])) {
            $content_type = $body['contentType'];
        }

        $temp_file = tempnam(sys_get_temp_dir(), 'pigl_up_');
        file_put_contents($temp_file, $binary_data);
    }
}

if (!$temp_file || !file_exists($temp_file)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'No file provided in request. Send multipart "file" or JSON "fileBase64".']);
    exit();
}

// Clean filename base
$path_info = pathinfo($original_name);
$clean_basename = preg_replace('/[^a-zA-Z0-9_-]/', '_', $path_info['filename']);
$ext = strtolower($path_info['extension'] ?? '');
$timestamp = time();

$is_image = str_starts_with($content_type, 'image/') || in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'gif']);

// Determine target filename and process image optimization
$final_filename = '';
$final_path = '';

if ($is_image && function_exists('imagecreatefromstring')) {
    $img_data = file_get_contents($temp_file);
    $src_image = @imagecreatefromstring($img_data);

    if ($src_image !== false) {
        // Auto-orient JPEG if EXIF orientation is present
        if (function_exists('exif_read_data') && ($ext === 'jpg' || $ext === 'jpeg')) {
            $exif = @exif_read_data($temp_file);
            if (!empty($exif['Orientation'])) {
                switch ($exif['Orientation']) {
                    case 3:
                        $src_image = imagerotate($src_image, 180, 0);
                        break;
                    case 6:
                        $src_image = imagerotate($src_image, -90, 0);
                        break;
                    case 8:
                        $src_image = imagerotate($src_image, 90, 0);
                        break;
                }
            }
        }

        $orig_w = imagesx($src_image);
        $orig_h = imagesy($src_image);

        // Maximum dimension 1600px for sharp high-DPI displays without excessive file size
        $max_dim = 1600;
        $target_w = $orig_w;
        $target_h = $orig_h;

        if ($orig_w > $max_dim || $orig_h > $max_dim) {
            if ($orig_w >= $orig_h) {
                $target_w = $max_dim;
                $target_h = (int) round(($orig_h / $orig_w) * $max_dim);
            } else {
                $target_h = $max_dim;
                $target_w = (int) round(($orig_w / $orig_h) * $max_dim);
            }
        }

        $dst_image = imagecreatetruecolor($target_w, $target_h);

        // Preserve alpha transparency for PNG/WebP
        imagealphablending($dst_image, false);
        imagesavealpha($dst_image, true);
        $transparent = imagecolorallocatealpha($dst_image, 255, 255, 255, 127);
        imagefilledrectangle($dst_image, 0, 0, $target_w, $target_h, $transparent);

        imagecopyresampled($dst_image, $src_image, 0, 0, 0, 0, $target_w, $target_h, $orig_w, $orig_h);

        // Save as modern high-efficiency WebP (quality 82)
        $final_filename = $timestamp . '_' . $clean_basename . '.webp';
        $final_path = $upload_dir . '/' . $final_filename;

        if (function_exists('imagewebp')) {
            imagewebp($dst_image, $final_path, 82);
        } else {
            // Fallback to high quality JPEG
            $final_filename = $timestamp . '_' . $clean_basename . '.jpg';
            $final_path = $upload_dir . '/' . $final_filename;
            imagejpeg($dst_image, $final_path, 85);
        }

        imagedestroy($src_image);
        imagedestroy($dst_image);
    } else {
        // Could not parse with GD, save file as-is
        $safe_ext = $ext ? $ext : 'jpg';
        $final_filename = $timestamp . '_' . $clean_basename . '.' . $safe_ext;
        $final_path = $upload_dir . '/' . $final_filename;
        copy($temp_file, $final_path);
    }
} else {
    // Non-image (e.g. PDF, video)
    $safe_ext = $ext ? $ext : 'bin';
    $final_filename = $timestamp . '_' . $clean_basename . '.' . $safe_ext;
    $final_path = $upload_dir . '/' . $final_filename;
    copy($temp_file, $final_path);
}

// Clean temporary file if generated from base64
if (str_starts_with($temp_file, sys_get_temp_dir())) {
    @unlink($temp_file);
}

@chmod($final_path, 0644);

// Construct public URL
$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'https://';
$host = $_SERVER['HTTP_HOST'] ?: 'polarisigl.com';
$public_url = $scheme . $host . '/assets/uploads/' . $final_filename;

echo json_encode([
    'success' => true,
    'url' => $public_url,
    'relative_url' => '/assets/uploads/' . $final_filename,
    'filename' => $final_filename,
    'size' => file_exists($final_path) ? filesize($final_path) : 0
]);
