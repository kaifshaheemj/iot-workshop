#ifndef DASHBOARD_H
#define DASHBOARD_H

// Second tab in Arduino IDE. Served at http://192.168.4.1
const char DASHBOARD_HTML[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>IntruderLab</title>
<style>
body{margin:0;min-height:100vh;font-family:Arial,Helvetica,sans-serif;background:#07090f;color:#e8edf7;display:flex;align-items:center;justify-content:center;text-align:center}
body.alert{background:#2a0a12}
main{width:92%;max-width:520px}
.kicker{letter-spacing:2px;text-transform:uppercase;color:#93a0b8;font-size:12px}
h1{font-size:42px;margin:12px 0 8px}
h1.ok{color:#5ee09a}
h1.bad{color:#ff4d62}
.panel{margin-top:28px;overflow:hidden;background:#10151f;border:1px solid #2a3346;border-radius:16px;padding:16px}
.col{width:48%;float:left;text-align:left}
.label{color:#93a0b8;font-size:12px;text-transform:uppercase}
.value{font-size:28px}
.hint{margin-top:22px;color:#93a0b8;font-size:14px;clear:both}
.err{color:#f0b429;min-height:1.2em}
</style>
</head>
<body>
<main>
<p class="kicker">ESP32 IntruderLab</p>
<h1 id="status" class="ok">NORMAL</h1>
<p class="err" id="err"></p>
<div class="panel">
<div class="col"><p class="label">Light</p><p class="value" id="light">-</p></div>
<div class="col"><p class="label">Threshold</p><p class="value" id="th">-</p></div>
</div>
<p class="hint">Wave a hand through the laser beam. This page reads /status from the board.</p>
</main>
<script>
var statusEl = document.getElementById('status');
var lightEl = document.getElementById('light');
var thEl = document.getElementById('th');
var errEl = document.getElementById('err');
function tick() {
  fetch('/status').then(function(r) { return r.json(); }).then(function(d) {
    lightEl.textContent = d.light;
    thEl.textContent = d.threshold;
    if (d.intruder) {
      statusEl.textContent = 'INTRUDER DETECTED';
      statusEl.className = 'bad';
      document.body.className = 'alert';
    } else {
      statusEl.textContent = 'NORMAL';
      statusEl.className = 'ok';
      document.body.className = '';
    }
    errEl.textContent = '';
  }).catch(function() {
    errEl.textContent = 'No response from board. Stay on IntruderLab Wi-Fi.';
  });
}
tick();
setInterval(tick, 250);
</script>
</body>
</html>
)rawliteral";

#endif
