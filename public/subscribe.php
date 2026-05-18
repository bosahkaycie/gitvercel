<?php
// subscribe.php - Secure Newsletter Subscription Email Handler
session_start();

// 1. Security Headers
header("Access-Control-Allow-Origin: https://polarisigl.com"); 
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// 2. Handle Preflight Request (OPTIONS method for CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 3. Only Allow POST Requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method Not Allowed"]);
    exit();
}

// 4. Rate Limiting (30-second cooldown per subscription request to prevent spam)
$last_submit = $_SESSION['last_subscribe_time'] ?? 0;
if (time() - $last_submit < 30) {
    http_response_code(429);
    echo json_encode(["status" => "error", "message" => "Please wait a moment before subscribing again."]);
    exit();
}
$_SESSION['last_subscribe_time'] = time();

// 5. Get Data from React (JSON)
$data = json_decode(file_get_contents("php://input"), true);
$email = filter_var(trim($data['email'] ?? ''), FILTER_SANITIZE_EMAIL);

// Check if empty
if (empty($email)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Email address is required."]);
    exit();
}

// Check valid email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid email address."]);
    exit();
}

// 6. Email Configuration
$to_email = "website@polarisigl.com"; // SUBSCRIBER TARGET EMAIL
$subject = "New Website Newsletter Subscription";

// 7. Email Content (Beautiful HTML Template matching PIGL identity)
$email_content = "
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; }
    .header { background-color: #022c22; color: #ffffff; padding: 20px; text-align: center; }
    .content { padding: 30px; }
    .footer { font-size: 11px; color: #64748b; text-align: center; padding: 20px; border-top: 1px solid #e2e8f0; }
    .highlight { font-weight: bold; color: #047857; }
  </style>
</head>
<body>
  <div class='container'>
    <div class='header'>
      <h2 style='margin:0;'>Newsletter Subscription</h2>
      <p style='margin:5px 0 0 0;font-size:12px;color:#a7f3d0;'>Polaris Integrated & GeoSolutions Limited</p>
    </div>
    <div class='content'>
      <p>Hello Polaris Team,</p>
      <p>You have received a new newsletter subscription from your website.</p>
      <div style='background-color:#f1f5f9; padding:15px; border-left:4px solid #047857; margin:20px 0;'>
        <p style='margin:0;'><strong>Subscriber Email:</strong> <span class='highlight'>$email</span></p>
        <p style='margin:5px 0 0 0;'><strong>Date/Time:</strong> " . date("F j, Y, g:i a") . "</p>
      </div>
      <p>Please add this email address to your newsletter mailing list to ensure they receive your latest insights and project updates.</p>
    </div>
    <div class='footer'>
      This notification was generated automatically by the PIGL Corporate Website.
    </div>
  </div>
</body>
</html>
";

// 8. HTML Email Headers
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: PIGL Website <noreply@polarisigl.com>\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// 9. Send Email
if (mail($to_email, $subject, $email_content, $headers)) {
    http_response_code(200);
    echo json_encode(["status" => "success", "message" => "Subscribed successfully!"]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Server failed to process subscription notification."]);
}
?>
