<?php
/**
 * Polaris Integrated & GeoSolutions (PIGL)
 * Mobile Interview Check-In Pass Page (Scanned by Venue Attendant)
 */

header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");

function base64url_decode_utf8($data) {
    $remainder = strlen($data) % 4;
    if ($remainder) {
        $data .= str_repeat('=', 4 - $remainder);
    }
    return base64_decode(strtr($data, '-_', '+/'));
}

$candidate = [
    'id' => '',
    'n' => '',
    'r' => '',
    'dt' => '',
    'tm' => '',
];

if (!empty($_GET['d'])) {
    $decoded = base64url_decode_utf8((string)$_GET['d']);
    $json = json_decode($decoded, true);
    if (is_array($json)) {
        $candidate['id'] = isset($json['id']) ? trim((string)$json['id']) : '';
        $candidate['n']  = isset($json['n'])  ? trim((string)$json['n'])  : '';
        $candidate['r']  = isset($json['r'])  ? trim((string)$json['r'])  : '';
        $candidate['dt'] = isset($json['dt']) ? trim((string)$json['dt']) : '';
        $candidate['tm'] = isset($json['tm']) ? trim((string)$json['tm']) : '';
    }
} else {
    $candidate['id'] = isset($_GET['id']) ? trim((string)$_GET['id']) : '';
    $candidate['n']  = isset($_GET['n'])  ? trim((string)$_GET['n'])  : '';
    $candidate['r']  = isset($_GET['r'])  ? trim((string)$_GET['r'])  : '';
    $candidate['dt'] = isset($_GET['dt']) ? trim((string)$_GET['dt']) : '';
    $candidate['tm'] = isset($_GET['tm']) ? trim((string)$_GET['tm']) : '';
}

$isValid = $candidate['n'] !== '' && $candidate['id'] !== '';

// Format date cleanly if ISO YYYY-MM-DD
$formattedDate = $candidate['dt'];
if ($formattedDate !== '' && preg_match('/^\d{4}-\d{2}-\d{2}$/', $formattedDate)) {
    $dtObj = DateTime::createFromFormat('Y-m-d', $formattedDate);
    if ($dtObj) {
        $formattedDate = $dtObj->format('l, j F Y');
    }
}

// Check current server check-in state directly so page renders instantly with real state
$existingCheckin = null;
$storeFile = __DIR__ . '/data/interview_checkins.json';
if ($isValid && file_exists($storeFile)) {
    $raw = @file_get_contents($storeFile);
    $all = $raw ? json_decode($raw, true) : null;
    if (is_array($all) && isset($all[$candidate['id']])) {
        $existingCheckin = $all[$candidate['id']];
    }
}

$esc = function($str) {
    return htmlspecialchars((string)$str, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
};
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Interview Check-In Pass — Polaris Integrated &amp; GeoSolutions</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #f1f5f9;
      color: #0f172a;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px 14px;
    }
    .card {
      width: 100%;
      max-width: 440px;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
    }
    .banner {
      width: 100%;
      display: block;
      border-bottom: 1px solid #e2e8f0;
    }
    .body {
      padding: 24px 22px 22px 22px;
    }
    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #065f46;
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      padding: 4px 10px;
      border-radius: 999px;
      margin-bottom: 14px;
    }
    .candidate-name {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.2;
      margin-bottom: 4px;
    }
    .position {
      font-size: 14px;
      font-weight: 600;
      color: #475569;
      margin-bottom: 18px;
    }
    .details {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px 16px;
      margin-bottom: 20px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 12px;
      padding: 6px 0;
      font-size: 13.5px;
    }
    .detail-row + .detail-row {
      border-top: 1px solid #e2e8f0;
    }
    .detail-label {
      color: #64748b;
      font-weight: 600;
      flex-shrink: 0;
    }
    .detail-value {
      color: #0f172a;
      font-weight: 700;
      text-align: right;
    }
    .status-box {
      border-radius: 12px;
      padding: 16px;
      text-align: center;
      margin-bottom: 14px;
      background: #ecfdf5;
      border: 1.5px solid #10b981;
      color: #065f46;
    }
    .status-box.hidden { display: none; }
    .status-title {
      font-size: 15px;
      font-weight: 800;
      margin-bottom: 4px;
    }
    .status-sub {
      font-size: 12.5px;
      color: #047857;
      font-weight: 600;
    }
    .btn {
      width: 100%;
      padding: 14px 18px;
      border: none;
      border-radius: 12px;
      background: #065f46;
      color: #ffffff;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.15s ease, transform 0.1s ease;
      box-shadow: 0 4px 14px rgba(6, 95, 70, 0.25);
    }
    .btn:hover { background: #047857; }
    .btn:active { transform: scale(0.99); }
    .btn:disabled { opacity: 0.65; cursor: not-allowed; }
    .btn.hidden { display: none; }
    .error-msg {
      margin-top: 10px;
      font-size: 12.5px;
      color: #b91c1c;
      text-align: center;
      font-weight: 600;
      display: none;
    }
    .footer {
      padding: 14px 22px;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      font-size: 11.5px;
      color: #64748b;
      text-align: center;
      line-height: 1.5;
    }
    .invalid {
      text-align: center;
      padding: 28px 16px;
    }
    .invalid h2 {
      font-size: 18px;
      color: #0f172a;
      margin-bottom: 8px;
    }
    .invalid p {
      font-size: 13.5px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="card">
    <img src="/assets/email-header.jpg" alt="Polaris Integrated &amp; GeoSolutions Ltd" class="banner" />
    <div class="body">
      <?php if (!$isValid): ?>
        <div class="invalid">
          <h2>Invalid Interview Pass</h2>
          <p>This QR code does not contain a valid candidate pass. Please ask the candidate to show the QR code from their official PIGL interview invitation email.</p>
        </div>
      <?php else: ?>
        <div class="eyebrow">Venue Check-In Pass</div>
        <h1 class="candidate-name"><?php echo $esc($candidate['n']); ?></h1>
        <p class="position"><?php echo $esc($candidate['r'] ?: 'Interview Candidate'); ?></p>

        <div class="details">
          <div class="detail-row">
            <span class="detail-label">Position</span>
            <span class="detail-value"><?php echo $esc($candidate['r'] ?: 'Specified Role'); ?></span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Interview Date</span>
            <span class="detail-value"><?php echo $esc($formattedDate ?: 'Scheduled'); ?></span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Interview Time</span>
            <span class="detail-value"><?php echo $esc($candidate['tm'] ?: 'As Scheduled'); ?></span>
          </div>
        </div>

        <div id="checkedInBox" class="status-box <?php echo $existingCheckin ? '' : 'hidden'; ?>">
          <div class="status-title">&#10003; Checked In at Venue</div>
          <div id="checkedInMeta" class="status-sub">
            <?php
              if ($existingCheckin) {
                $t = isset($existingCheckin['checkedInTimeDisplay']) ? $existingCheckin['checkedInTimeDisplay'] : '';
                $d = isset($existingCheckin['checkedInDateDisplay']) ? $existingCheckin['checkedInDateDisplay'] : '';
                echo $esc("Arrived at {$t}" . ($d ? " ({$d})" : ""));
              }
            ?>
          </div>
        </div>

        <button id="checkInBtn" type="button" class="btn <?php echo $existingCheckin ? 'hidden' : ''; ?>">
          Confirm Candidate Arrival (Check In)
        </button>

        <p id="errorMsg" class="error-msg"></p>
      <?php endif; ?>
    </div>
    <div class="footer">
      Polaris Integrated &amp; GeoSolutions Limited &bull; Reception Verification<br />
      Check-ins sync immediately with the PIGL Admin Careers Dashboard.
    </div>
  </div>

  <?php if ($isValid): ?>
  <script>
    (function () {
      var candidatePayload = <?php echo json_encode([
        'applicationId' => $candidate['id'],
        'candidateName' => $candidate['n'],
        'jobTitle' => $candidate['r'],
        'interviewDate' => $candidate['dt'],
        'interviewTime' => $candidate['tm'],
      ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE); ?>;

      var btn = document.getElementById('checkInBtn');
      var box = document.getElementById('checkedInBox');
      var meta = document.getElementById('checkedInMeta');
      var errEl = document.getElementById('errorMsg');

      function showCheckedIn(checkin) {
        if (btn) btn.classList.add('hidden');
        if (box) box.classList.remove('hidden');
        if (meta && checkin) {
          var t = checkin.checkedInTimeDisplay || '';
          var d = checkin.checkedInDateDisplay || '';
          meta.textContent = t ? ('Arrived at ' + t + (d ? ' (' + d + ')' : '')) : 'Recorded on Admin Dashboard';
        }
      }

      if (btn) {
        btn.addEventListener('click', function () {
          btn.disabled = true;
          btn.textContent = 'Checking In...';
          errEl.style.display = 'none';

          fetch('/api/interview-checkin.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(candidatePayload)
          })
            .then(function (r) { return r.json(); })
            .then(function (res) {
              if (res && res.success) {
                showCheckedIn(res.checkin);
              } else {
                throw new Error((res && res.error) || 'Failed to record check-in.');
              }
            })
            .catch(function (err) {
              btn.disabled = false;
              btn.textContent = 'Confirm Candidate Arrival (Check In)';
              errEl.textContent = err.message || 'Network error. Please try again.';
              errEl.style.display = 'block';
            });
        });
      }
    })();
  </script>
  <?php endif; ?>
</body>
</html>
