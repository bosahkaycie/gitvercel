<?php
/**
 * Polaris Integrated & GeoSolutions (PIGL)
 * Gated Mobile Interview Check-In Pass Page (Admin Access Code Required)
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

$tz = new DateTimeZone('Africa/Lagos');
$nowWat = new DateTime('now', $tz);
$currentTimeDisplay = $nowWat->format('g:i A') . ' WAT';

$formattedDate = $candidate['dt'];
if ($formattedDate !== '' && preg_match('/^\d{4}-\d{2}-\d{2}$/', $formattedDate)) {
    $dtObj = DateTime::createFromFormat('Y-m-d', $formattedDate, $tz);
    if ($dtObj) {
        $formattedDate = $dtObj->format('l, j F Y');
    }
}

// Compute live arrival punctuality against scheduled date & time (WAT)
$arrivalState = 'neutral'; // early | on_time | late | upcoming | neutral
$arrivalHeadline = '';
$arrivalDetail = '';

if ($candidate['dt'] !== '' && preg_match('/^\d{4}-\d{2}-\d{2}$/', $candidate['dt']) && $candidate['tm'] !== '') {
    if (preg_match('/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?/i', $candidate['tm'], $m)) {
        $hour = (int)$m[1];
        $min  = isset($m[2]) && $m[2] !== '' ? (int)$m[2] : 0;
        $ampm = isset($m[3]) ? strtoupper($m[3]) : '';
        if ($ampm === 'PM' && $hour < 12) $hour += 12;
        if ($ampm === 'AM' && $hour === 12) $hour = 0;

        $sched = DateTime::createFromFormat('Y-m-d H:i', sprintf('%s %02d:%02d', $candidate['dt'], $hour, $min), $tz);
        if ($sched) {
            $diffMins = (int)round(($nowWat->getTimestamp() - $sched->getTimestamp()) / 60);
            if ($nowWat->format('Y-m-d') !== $sched->format('Y-m-d')) {
                if ($diffMins < 0) {
                    $days = (int)ceil(abs($diffMins) / 1440);
                    $arrivalState = 'upcoming';
                    $arrivalHeadline = 'Scheduled for Another Day';
                    $arrivalDetail = "Interview is in {$days} day" . ($days > 1 ? 's' : '') . " ({$formattedDate} at {$candidate['tm']})";
                } else {
                    $arrivalState = 'late';
                    $arrivalHeadline = 'Past Scheduled Date';
                    $arrivalDetail = "Was scheduled for {$formattedDate} at {$candidate['tm']}";
                }
            } elseif ($diffMins < -5) {
                $earlyMins = abs($diffMins);
                $earlyText = $earlyMins >= 60
                    ? floor($earlyMins / 60) . ' hr ' . ($earlyMins % 60) . ' min'
                    : "{$earlyMins} min" . ($earlyMins > 1 ? 's' : '');
                $arrivalState = 'early';
                $arrivalHeadline = 'Arrived Early';
                $arrivalDetail = "{$earlyText} before scheduled interview time";
            } elseif ($diffMins <= 5) {
                $arrivalState = 'on_time';
                $arrivalHeadline = 'On Time';
                $arrivalDetail = 'Arrived right on schedule';
            } else {
                $lateText = $diffMins >= 60
                    ? floor($diffMins / 60) . ' hr ' . ($diffMins % 60) . ' min'
                    : "{$diffMins} min" . ($diffMins > 1 ? 's' : '');
                $arrivalState = 'late';
                $arrivalHeadline = 'Arrived Late';
                $arrivalDetail = "{$lateText} after scheduled interview time";
            }
        }
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
  <title>Reception Check-In — Polaris Integrated &amp; GeoSolutions</title>
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
    .hidden { display: none !important; }
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
    .eyebrow-lock {
      color: #1e293b;
      background: #f1f5f9;
      border-color: #cbd5e1;
    }
    .gate-title {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 6px;
    }
    .gate-desc {
      font-size: 13.5px;
      color: #475569;
      line-height: 1.55;
      margin-bottom: 18px;
    }
    .code-input {
      width: 100%;
      padding: 13px 14px;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      text-align: center;
      border: 1.5px solid #cbd5e1;
      border-radius: 12px;
      outline: none;
      color: #0f172a;
      background: #f8fafc;
      margin-bottom: 12px;
      transition: border-color 0.15s ease, background 0.15s ease;
    }
    .code-input:focus {
      border-color: #065f46;
      background: #ffffff;
    }
    .candidate-name {
      font-size: 23px;
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
    .error-msg {
      margin-top: 10px;
      font-size: 12.5px;
      color: #b91c1c;
      text-align: center;
      font-weight: 600;
    }
    .lock-link {
      display: block;
      margin: 14px auto 0 auto;
      background: none;
      border: none;
      color: #64748b;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: underline;
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
    .punctuality {
      border-radius: 12px;
      padding: 12px 14px;
      margin-bottom: 16px;
      border: 1.5px solid #e2e8f0;
      background: #f8fafc;
    }
    .punctuality-early {
      background: #ecfdf5;
      border-color: #34d399;
      color: #065f46;
    }
    .punctuality-on_time {
      background: #ecfdf5;
      border-color: #10b981;
      color: #065f46;
    }
    .punctuality-late {
      background: #fef2f2;
      border-color: #f87171;
      color: #991b1b;
    }
    .punctuality-upcoming {
      background: #eff6ff;
      border-color: #60a5fa;
      color: #1e40af;
    }
    .punctuality-title {
      font-size: 13.5px;
      font-weight: 800;
      margin-bottom: 2px;
    }
    .punctuality-sub {
      font-size: 12px;
      opacity: 0.9;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="card">
    <img src="/assets/email-header.jpg" alt="Polaris Integrated &amp; GeoSolutions Ltd" class="banner" />
    <div class="body">
      <?php if (!$isValid): ?>
        <div class="invalid">
          <h2>Invalid Code</h2>
          <p>This QR code is not recognized. Please contact the office administrator for assistance.</p>
        </div>
      <?php else: ?>
        <!-- STEP 1: ADMINISTRATIVE ACCESS CODE GATE -->
        <div id="gateView">
          <div class="eyebrow eyebrow-lock">Restricted Reception Access</div>
          <h1 class="gate-title">Administrator Code Required</h1>
          <p class="gate-desc">
            Enter the unique receptionist access code provided by the office administrator to verify and admit this candidate.
          </p>
          <form id="codeForm">
            <input
              id="accessCodeInput"
              type="text"
              class="code-input"
              placeholder="PIGL-XXXXXX"
              autocomplete="off"
              autocapitalize="characters"
              required
            />
            <button id="verifyBtn" type="submit" class="btn">
              Verify Code &amp; Continue
            </button>
          </form>
          <p id="gateError" class="error-msg hidden"></p>
        </div>

        <!-- STEP 2: UNLOCKED CANDIDATE ADMISSION PANEL -->
        <div id="passView" class="hidden">
          <div class="eyebrow">Authorized Venue Check-In</div>
          <h1 class="candidate-name"><?php echo $esc($candidate['n']); ?></h1>
          <p class="position"><?php echo $esc($candidate['r'] ?: 'Interview Candidate'); ?></p>

          <?php if ($arrivalHeadline !== ''): ?>
          <div id="punctualityBanner" class="punctuality punctuality-<?php echo $esc($arrivalState); ?>">
            <div class="punctuality-title"><?php echo $esc($arrivalHeadline); ?></div>
            <div class="punctuality-sub"><?php echo $esc($arrivalDetail); ?></div>
          </div>
          <?php endif; ?>

          <div class="details">
            <div class="detail-row">
              <span class="detail-label">Position</span>
              <span class="detail-value"><?php echo $esc($candidate['r'] ?: 'Specified Role'); ?></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Scheduled Date</span>
              <span class="detail-value"><?php echo $esc($formattedDate ?: 'Scheduled'); ?></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Scheduled Time</span>
              <span class="detail-value"><?php echo $esc($candidate['tm'] ?: 'As Scheduled'); ?></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Current Time</span>
              <span class="detail-value"><?php echo $esc($currentTimeDisplay); ?></span>
            </div>
          </div>

          <div id="checkedInBox" class="status-box hidden">
            <div class="status-title">&#10003; Checked In at Venue</div>
            <div id="checkedInMeta" class="status-sub"></div>
          </div>

          <button id="checkInBtn" type="button" class="btn">
            Admit Candidate (Check In)
          </button>

          <p id="passError" class="error-msg hidden"></p>

          <button id="lockBtn" type="button" class="lock-link">
            Lock Receptionist Session
          </button>
        </div>
      <?php endif; ?>
    </div>
    <div class="footer">
      Polaris Integrated &amp; GeoSolutions Limited &bull; Authorized Reception Portal
    </div>
  </div>

  <?php if ($isValid): ?>
  <script>
    (function () {
      var STORAGE_KEY = 'pigl_reception_gate_code';
      var candidatePayload = <?php echo json_encode([
        'applicationId' => $candidate['id'],
        'candidateName' => $candidate['n'],
        'jobTitle' => $candidate['r'],
        'interviewDate' => $candidate['dt'],
        'interviewTime' => $candidate['tm'],
      ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE); ?>;

      var activeAccessCode = '';

      var gateView = document.getElementById('gateView');
      var passView = document.getElementById('passView');
      var codeForm = document.getElementById('codeForm');
      var codeInput = document.getElementById('accessCodeInput');
      var verifyBtn = document.getElementById('verifyBtn');
      var gateError = document.getElementById('gateError');

      var checkInBtn = document.getElementById('checkInBtn');
      var checkedInBox = document.getElementById('checkedInBox');
      var checkedInMeta = document.getElementById('checkedInMeta');
      var passError = document.getElementById('passError');
      var lockBtn = document.getElementById('lockBtn');

      function showGate(msg) {
        activeAccessCode = '';
        try { sessionStorage.removeItem(STORAGE_KEY); } catch (e) {}
        passView.classList.add('hidden');
        gateView.classList.remove('hidden');
        if (msg) {
          gateError.textContent = msg;
          gateError.classList.remove('hidden');
        } else {
          gateError.classList.add('hidden');
        }
      }

      function showCheckedIn(checkin) {
        checkInBtn.classList.add('hidden');
        checkedInBox.classList.remove('hidden');
        if (checkin) {
          var t = checkin.checkedInTimeDisplay || '';
          var d = checkin.checkedInDateDisplay || '';
          var p = checkin.punctualityLabel ? (' • ' + checkin.punctualityLabel) : '';
          checkedInMeta.textContent = t ? ('Admitted at ' + t + p + (d ? ' (' + d + ')' : '')) : 'Recorded on Admin Dashboard';
        }
      }

      function showUnlocked(code, checkin) {
        activeAccessCode = code;
        try { sessionStorage.setItem(STORAGE_KEY, code); } catch (e) {}
        gateView.classList.add('hidden');
        passView.classList.remove('hidden');
        passError.classList.add('hidden');
        if (checkin) {
          showCheckedIn(checkin);
        } else {
          checkedInBox.classList.add('hidden');
          checkInBtn.classList.remove('hidden');
          checkInBtn.disabled = false;
          checkInBtn.textContent = 'Admit Candidate (Check In)';
        }
      }

      function verifyCode(code, silent) {
        var clean = (code || '').trim().toUpperCase();
        if (!clean) return;

        if (!silent) {
          verifyBtn.disabled = true;
          verifyBtn.textContent = 'Verifying...';
          gateError.classList.add('hidden');
        }

        fetch('/api/interview-checkin.php?action=verify-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accessCode: clean,
            applicationId: candidatePayload.applicationId
          })
        })
          .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
          .then(function (res) {
            if (res.ok && res.data && res.data.verified) {
              showUnlocked(clean, res.data.checkin || null);
            } else {
              if (silent) {
                showGate('');
              } else {
                showGate((res.data && res.data.error) || 'Invalid administrative access code.');
              }
            }
          })
          .catch(function () {
            if (!silent) {
              showGate('Network error. Please try again.');
            }
          })
          .finally(function () {
            verifyBtn.disabled = false;
            verifyBtn.textContent = 'Verify Code & Continue';
          });
      }

      // Auto-verify if receptionist already unlocked this session on their device
      try {
        var saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
          verifyCode(saved, true);
        }
      } catch (e) {}

      codeForm.addEventListener('submit', function (e) {
        e.preventDefault();
        verifyCode(codeInput.value, false);
      });

      checkInBtn.addEventListener('click', function () {
        checkInBtn.disabled = true;
        checkInBtn.textContent = 'Recording Admission...';
        passError.classList.add('hidden');

        var body = Object.assign({}, candidatePayload, { accessCode: activeAccessCode });
        fetch('/api/interview-checkin.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
          .then(function (r) { return r.json().then(function (d) { return { status: r.status, ok: r.ok, data: d }; }); })
          .then(function (res) {
            if (res.status === 403) {
              showGate('Access code has changed or expired. Please enter the new code from the administrator.');
              return;
            }
            if (res.ok && res.data && res.data.success) {
              showCheckedIn(res.data.checkin);
            } else {
              throw new Error((res.data && res.data.error) || 'Failed to record admission.');
            }
          })
          .catch(function (err) {
            checkInBtn.disabled = false;
            checkInBtn.textContent = 'Admit Candidate (Check In)';
            passError.textContent = err.message || 'Network error. Please try again.';
            passError.classList.remove('hidden');
          });
      });

      lockBtn.addEventListener('click', function () {
        codeInput.value = '';
        showGate('');
      });
    })();
  </script>
  <?php endif; ?>
</body>
</html>
