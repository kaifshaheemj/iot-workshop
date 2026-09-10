#ifndef PAGE_H
#define PAGE_H

const char PAGE_HTML[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>IntruderLab</title>
<style>
body{margin:0;min-height:100vh;font-family:Calibri,Arial,sans-serif;background:#f4f7fb;color:#1c2433;display:flex;align-items:center;justify-content:center;text-align:center}
body.alert{background:#fde8e8}
main{width:92%;max-width:520px;background:#fff;border:1px solid #d5deea;border-radius:16px;padding:24px;box-shadow:0 16px 40px rgba(28,55,90,.08)}
.kicker{letter-spacing:2px;text-transform:uppercase;color:#0d7a6c;font-size:12px}
h1{font-family:"Times New Roman",Times,serif;font-size:36px;margin:12px 0 8px}
h1.ok{color:#157a45}
h1.bad{color:#c81e3a}
.panel{overflow:hidden;margin-top:16px;text-align:left}
.col{width:48%;float:left}
.label{color:#5d6b80;font-size:12px;text-transform:uppercase}
.value{font-size:24px;margin:4px 0 12px}
.row{clear:both;margin-top:18px}
button{font:inherit;padding:12px 18px;margin:0 8px 8px 0;border:0;border-radius:12px;background:#0d7a6c;color:#fff;cursor:pointer}
.hint{color:#5d6b80;clear:both}
.err{color:#b45309;min-height:1.2em}
</style>
</head>
<body>
<main>
<p class="kicker">ESP32 IntruderLab</p>
<h1 id="status" class="ok">NORMAL</h1>
<p id="door">Door: —</p>
<p class="err" id="err"></p>
<div class="panel">
<div class="col"><p class="label">Light</p><p class="value" id="light">-</p></div>
<div class="col"><p class="label">Threshold</p><p class="value" id="th">-</p></div>
</div>
<div class="row">
<button type="button" id="btn-open">Open door</button>
<button type="button" id="btn-close">Close door</button>
</div>
<p class="hint">Break the beam to close. Buttons move the servo even without a break.</p>
</main>
<script>
function paint(d) {
  var statusEl = document.getElementById('status');
  document.getElementById('light').textContent = d.light;
  document.getElementById('th').textContent = d.threshold;
  document.getElementById('door').textContent = 'Door: ' + d.door;
  if (d.intruder) {
    statusEl.textContent = 'INTRUDER DETECTED';
    statusEl.className = 'bad';
    document.body.className = 'alert';
  } else {
    statusEl.textContent = 'NORMAL';
    statusEl.className = 'ok';
    document.body.className = '';
  }
  document.getElementById('err').textContent = '';
}
function tick() {
  fetch('/status').then(function(r) { return r.json(); }).then(paint).catch(function() {
    document.getElementById('err').textContent = 'No response from board. Stay on IntruderLab Wi-Fi.';
  });
}
function post(path) {
  fetch(path).then(function(r) { return r.json(); }).then(paint).catch(function() {
    document.getElementById('err').textContent = 'No response from board.';
  });
}
document.getElementById('btn-open').onclick = function() { post('/open'); };
document.getElementById('btn-close').onclick = function() { post('/close'); };
tick();
setInterval(tick, 250);
</script>
</body>
</html>
)rawliteral";

#endif
