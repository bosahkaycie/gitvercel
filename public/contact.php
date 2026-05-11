// contact.php - Secure Contact Form Handler
session_start();

// 1. Security Headers
header("Access-Control-Allow-Origin: https://polarisigl.com"); // Restricted to production domain
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// 2. Handle Preflight Request (Option method for CORS)
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

// 3.1 Basic Rate Limiting (60-second cooldown)
$last_submit = $_SESSION['last_submit_time'] ?? 0;
if (time() - $last_submit < 60) { http_response_code(429); echo json_encode(["status"=> "error", "message" => "Too many
    requests. Please wait a minute before sending another message."]);
    exit();
    }
    $_SESSION['last_submit_time'] = time();

    // 4. Get Data from React (JSON)
    $data = json_decode(file_get_contents("php://input"), true);

    // 5. Sanitize & Validate Inputs
    // Note: FILTER_SANITIZE_STRING is deprecated in PHP 8.1. Use htmlspecialchars or similar.
    $name = htmlspecialchars(strip_tags(trim($data['name'] ?? '')), ENT_QUOTES, 'UTF-8');
    $email = filter_var(trim($data['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $service = htmlspecialchars(strip_tags(trim($data['service'] ?? '')), ENT_QUOTES, 'UTF-8');
    $message = htmlspecialchars(strip_tags(trim($data['message'] ?? '')), ENT_QUOTES, 'UTF-8');
    $honeypot = $data['website'] ?? '';

    // Check Honeypot - If filled, it's a bot
    if (!empty($honeypot)) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Bot detected."]);
    exit();
    }

    // Check if empty
    if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Please fill in all required fields."]);
    exit();
    }

    // Check valid email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid email address."]);
    exit();
    }

    // 6. Email Configuration
    $to_email = "info@polarisigl.com"; // COMPANY EMAIL
    $subject = "New Website Enquiry from $name";

    // 7. Email Content
    $email_content = "You have received a new message from your website contact form.\n\n";
    $email_content .= "Name: $name\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Service Interest: $service\n\n";
    $email_content .= "Message:\n$message\n";

    // 8. Email Headers
    $headers = "From: Website Contact Form <noreply@polarisigl.com>\r\n";
        $headers .= "Reply-To: $email\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();

        // 9. Send Email
        if (mail($to_email, $subject, $email_content, $headers)) {
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Message sent successfully!"]);
        } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to send message. Server error."]);
        }
        ?>