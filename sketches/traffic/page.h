#ifndef PAGE_H
#define PAGE_H

const char PAGE_HTML[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>TrafficLab</title>
<style>
body{margin:0;min-height:100vh;font-family:Calibri,Arial,sans-serif;background:#f4f7fb;color:#1c2433;display:flex;align-items:center;justify-content:center;text-align:center}
body.red{background:#fde8e8}
body.yellow{background:#fff4e5}
body.green{background:#e3f8ec}
main{width:92%;max-width:520px;background:#fff;border:1px solid #d5deea;border-radius:16px;padding:24px;box-shadow:0 16px 40px rgba(28,55,90,.08)}
.kicker{letter-spacing:2px;text-transform:uppercase;color:#0d7a6c;font-size:12px}
h1{font-family:"Times New Roman",Times,serif;font-size:42px;margin:12px 0}
.panel{overflow:hidden;margin-top:16px;text-align:left}
.col{width:48%;float:left}
.label{color:#5d6b80;font-size:12px;text-transform:uppercase}
.value{font-size:28px;margin:4px 0 12px}
.hint{clear:both;color:#5d6b80}
.err{color:#b45309;min-height:1.2em}
</style>
</head>
<body>
<main>
<p class="kicker">ESP32 TrafficLab</p>
<h1 id="status">—</h1>
<p id="amb"></p>
<p class="err" id="err"></p>
<div class="panel">
<div class="col"><p class="label">Sound</p><p class="value" id="sound">-</p></div>
<div class="col"><p class="label">Threshold</p><p class="value" id="th">-</p></div>
</div>
<p class="hint">Stay on TrafficLab Wi-Fi. A siren or clap should jump this page to GREEN.</p>
</main>
<script>
function tick() {
  fetch('/status').then(function(r) { return r.json(); }).then(function(d) {
    document.getElementById('status').textContent = d.state;
    document.getElementById('sound').textContent = d.sound;
    document.getElementById('th').textContent = d.threshold;
    document.getElementById('amb').textContent = d.ambulance ? 'Ambulance interrupt' : 'Normal cycle';
    document.body.className = String(d.state).toLowerCase();
    document.getElementById('err').textContent = '';
  }).catch(function() {
    document.getElementById('err').textContent = 'No response. Stay on TrafficLab Wi-Fi.';
  });
}
tick();
setInterval(tick, 250);
</script>
</body>
</html>
)rawliteral";

#endif
