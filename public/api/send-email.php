<?php
/**
 * Polaris Integrated & GeoSolutions (PIGL)
 * Production SMTP & Mail Dispatcher for Hostinger Web Hosting
 * Handles Contact Inquiries, Career Applications, Vendor Registration, and Diagnostic Verification
 */

// 1. CORS & Response Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle CORS Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 2. Load SMTP Credentials from Environment or Defaults
$smtp_host = getenv('SMTP_HOST') ?: 'glacier.mxrouting.net';
$smtp_port = (int)(getenv('SMTP_PORT') ?: 465);
$smtp_secure = (getenv('SMTP_SECURE') === 'true' || $smtp_port === 465);
$smtp_user = getenv('SMTP_USER') ?: 'hello@polarisigl.com';
$smtp_pass = getenv('SMTP_PASS') ?: '6JMJ2WPfHRv9ypt5jzVy';
$smtp_from = getenv('SMTP_FROM') ?: '"Polaris Integrated & GeoSolutions" <hello@polarisigl.com>';

// 3. Handle GET Diagnostic / Status Request
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode([
        'status' => 'ready',
        'smtp_server' => $smtp_host,
        'smtp_port' => $smtp_port,
        'smtp_secure' => $smtp_secure,
        'smtp_user_configured' => !empty($smtp_user),
        'smtp_user_display' => !empty($smtp_user) ? substr($smtp_user, 0, 3) . '***@' . explode('@', $smtp_user)[1] : null,
        'service' => 'Polaris Integrated & GeoSolutions Hostinger Mail Dispatcher',
        'timestamp' => date('c')
    ]);
    exit();
}

// 4. Validate Method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed. Use POST.']);
    exit();
}

// 5. Parse JSON Payload
$raw_input = file_get_contents('php://input');
$data = json_decode($raw_input, true) ?: [];

$action = $data['action'] ?? 'send';
$to = $data['to'] ?? null;
$bcc = $data['bcc'] ?? null;
$reply_to = $data['replyTo'] ?? $smtp_user;
$subject = $data['subject'] ?? '';
$html = $data['html'] ?? '';
$text = $data['text'] ?? strip_tags($html);

// Override SMTP settings if provided in payload
if (!empty($data['config_override'])) {
    if (!empty($data['config_override']['smtp_host'])) $smtp_host = $data['config_override']['smtp_host'];
    if (!empty($data['config_override']['smtp_port'])) $smtp_port = (int)$data['config_override']['smtp_port'];
    if (!empty($data['config_override']['smtp_user'])) $smtp_user = $data['config_override']['smtp_user'];
    if (!empty($data['config_override']['smtp_pass'])) $smtp_pass = $data['config_override']['smtp_pass'];
}

// 6. Handle Verification Request
if ($action === 'verify' || $action === 'test_connection') {
    $test_email = $data['test_email'] ?? $smtp_user;
    $verify_result = send_via_smtp(
        $smtp_host, $smtp_port, $smtp_user, $smtp_pass, $smtp_from,
        $test_email, null, $reply_to,
        '✅ PIGL Email Server Diagnostic - Hostinger Verified',
        '<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #10b981; border-radius: 8px;">' .
        '<h2 style="color: #022c22;">Polaris Integrated & GeoSolutions</h2>' .
        '<p style="color: #0f172a;"><strong>Hostinger SMTP Mail Dispatcher Verified Successfully!</strong></p>' .
        '<p style="color: #475569; font-size: 13px;">Host: ' . htmlspecialchars($smtp_host) . ':' . $smtp_port . '<br>Timestamp: ' . date('c') . '</p>' .
        '</div>',
        'PIGL Email Server Diagnostic Test - Verified successfully at ' . date('c')
    );

    if ($verify_result['success']) {
        echo json_encode([
            'success' => true,
            'message' => "SMTP connection to {$smtp_host}:{$smtp_port} verified successfully!",
            'test_sent_to' => $test_email,
            'messageId' => $verify_result['messageId'] ?? null
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'SMTP Verification Failed: ' . ($verify_result['error'] ?? 'Unknown error'),
            'code' => 'SMTP_VERIFY_ERROR'
        ]);
    }
    exit();
}

// 7. Validate Send Parameters
if (empty($to) && empty($bcc)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing recipient ("to" or "bcc" required)']);
    exit();
}

if (empty($subject)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing email subject']);
    exit();
}

if (empty($html) && empty($text)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing email body']);
    exit();
}

// 8. Send Email via Direct SMTP with Fallback
$send_result = send_via_smtp(
    $smtp_host, $smtp_port, $smtp_user, $smtp_pass, $smtp_from,
    $to, $bcc, $reply_to, $subject, $html, $text
);

if ($send_result['success']) {
    echo json_encode([
        'success' => true,
        'messageId' => $send_result['messageId'],
        'sent_at' => date('c')
    ]);
} else {
    // If SMTP fails, try Hostinger local PHP mail() as last-resort fallback
    $fallback_headers = "From: " . $smtp_from . "\r\n";
    $fallback_headers .= "Reply-To: " . $reply_to . "\r\n";
    $fallback_headers .= "MIME-Version: 1.0\r\n";
    $fallback_headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    if (!empty($bcc)) {
        $fallback_headers .= "Bcc: " . (is_array($bcc) ? implode(',', $bcc) : $bcc) . "\r\n";
    }

    $recipient = !empty($to) ? (is_array($to) ? implode(',', $to) : $to) : $smtp_user;
    if (@mail($recipient, $subject, $html ?: nl2br($text), $fallback_headers)) {
        echo json_encode([
            'success' => true,
            'messageId' => 'php-mail-' . uniqid(),
            'fallback' => 'mail()',
            'sent_at' => date('c')
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => $send_result['error'] ?? 'Failed to dispatch email via SMTP or mail().',
            'code' => 'MAIL_DISPATCH_FAILED'
        ]);
    }
}

/**
 * Direct Lightweight Socket SMTP Mailer
 * Connects securely via SSL/TLS socket to glacier.mxrouting.net or any SMTP host
 */
function send_via_smtp($host, $port, $user, $pass, $from, $to, $bcc, $reply_to, $subject, $html, $text) {
    $timeout = 15;
    $protocol = ($port == 465) ? 'ssl://' : '';
    
    $socket = @fsockopen($protocol . $host, $port, $errno, $errstr, $timeout);
    if (!$socket) {
        return ['success' => false, 'error' => "Cannot connect to SMTP host {$host}:{$port} ({$errstr})"];
    }

    stream_set_timeout($socket, $timeout);

    $read = function() use ($socket) {
        $response = '';
        while ($line = fgets($socket, 515)) {
            $response .= $line;
            if (substr($line, 3, 1) === ' ') break;
        }
        return $response;
    };

    $send = function($cmd) use ($socket, $read) {
        fputs($socket, $cmd . "\r\n");
        return $read();
    };

    $initial = $read();
    if (substr($initial, 0, 3) !== '220') {
        fclose($socket);
        return ['success' => false, 'error' => "SMTP greeting error: {$initial}"];
    }

    $helo = $send("EHLO " . ($_SERVER['SERVER_NAME'] ?? 'polarisigl.com'));

    // Authenticate if user and pass exist
    if (!empty($user) && !empty($pass)) {
        $auth_resp = $send("AUTH LOGIN");
        if (substr($auth_resp, 0, 3) !== '334') {
            fclose($socket);
            return ['success' => false, 'error' => "AUTH LOGIN rejected: {$auth_resp}"];
        }
        $user_resp = $send(base64_encode($user));
        $pass_resp = $send(base64_encode($pass));
        if (substr($pass_resp, 0, 3) !== '235') {
            fclose($socket);
            return ['success' => false, 'error' => "SMTP Auth failed for user {$user}"];
        }
    }

    // Envelope From
    $from_email = $user;
    if (preg_match('/<([^>]+)>/', $from, $matches)) {
        $from_email = $matches[1];
    }
    $send("MAIL FROM:<{$from_email}>");

    // Envelope Recipients
    $recipients = [];
    if (!empty($to)) {
        $recipients = array_merge($recipients, is_array($to) ? $to : explode(',', $to));
    }
    if (!empty($bcc)) {
        $recipients = array_merge($recipients, is_array($bcc) ? $bcc : explode(',', $bcc));
    }

    foreach ($recipients as $r) {
        $r = trim($r);
        if (!empty($r)) {
            $send("RCPT TO:<{$r}>");
        }
    }

    // Data command
    $data_resp = $send("DATA");
    if (substr($data_resp, 0, 3) !== '354') {
        fclose($socket);
        return ['success' => false, 'error' => "SMTP DATA rejected: {$data_resp}"];
    }

    // Build MIME message
    $boundary = "==_Multipart_Boundary_x" . md5(time()) . "x";
    $messageId = "<pigl-" . time() . "." . uniqid() . "@polarisigl.com>";

    $headers = "Message-ID: {$messageId}\r\n";
    $headers .= "Date: " . date('r') . "\r\n";
    $headers .= "From: {$from}\r\n";
    if (!empty($to)) {
        $headers .= "To: " . (is_array($to) ? implode(', ', $to) : $to) . "\r\n";
    }
    $headers .= "Reply-To: {$reply_to}\r\n";
    $headers .= "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: multipart/alternative; boundary=\"{$boundary}\"\r\n";
    $headers .= "X-Mailer: Polaris Integrated & GeoSolutions Hostinger Mailer 1.0\r\n";

    $body = "--{$boundary}\r\n";
    $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $body .= chunk_split(base64_encode($text ?: strip_tags($html))) . "\r\n";

    if (!empty($html)) {
        $body .= "--{$boundary}\r\n";
        $body .= "Content-Type: text/html; charset=UTF-8\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $body .= chunk_split(base64_encode($html)) . "\r\n";
    }

    $body .= "--{$boundary}--\r\n";

    // Send payload + termination period
    fputs($socket, $headers . "\r\n" . $body . "\r\n.\r\n");
    $finish = $read();

    $send("QUIT");
    fclose($socket);

    if (substr($finish, 0, 3) === '250') {
        return ['success' => true, 'messageId' => $messageId];
    } else {
        return ['success' => false, 'error' => "SMTP transmission error: {$finish}"];
    }
}
