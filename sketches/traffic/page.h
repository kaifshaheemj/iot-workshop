// LEGACY FILE: the current traffic.ino embeds its TrafficSignal page and does not include this header.
// Keep this file only for archive compatibility; students should not add it as an Arduino tab.
#ifndef TRAFFIC_PAGE_H
#define TRAFFIC_PAGE_H

const char PAGE_HTML[] PROGMEM = R"rawliteral(
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>TrafficLab</title>
<style>
*{box-sizing:border-box}body{margin:0;min-height:100vh;font-family:Arial,sans-serif;background:#f3f7f6;color:#17221f;display:grid;place-items:center}main{width:min(92%,520px);background:#fff;border:1px solid #dce7e3;border-radius:22px;padding:28px;box-shadow:0 24px 60px #173c3020}.kicker{color:#137968;text-transform:uppercase;letter-spacing:.15em;font-size:12px}h1{font-family:Georgia,serif;font-size:36px;margin:8px 0 20px}.signal{display:flex;gap:14px;background:#17221f;border-radius:18px;padding:18px;width:max-content}.light{width:58px;height:58px;border-radius:50%;background:#45504d;opacity:.22}.light.on{opacity:1;box-shadow:0 0 24px currentColor}.red{color:#ef4655;background:currentColor}.yellow{color:#f4bd3c;background:currentColor}.green{color:#36bd76;background:currentColor}.mode{font-weight:700;margin-top:20px}.priority{color:#137968}.meter{height:10px;background:#e8eeec;border-radius:99px;overflow:hidden}.meter span{display:block;height:100%;width:0;background:#18a68e;transition:width .15s}.numbers{display:flex;justify-content:space-between;color:#64736f;font-size:14px}.err{color:#b55418;min-height:1.2em}
</style>
</head>
<body>
<main>
<p class="kicker">ESP32 TrafficLab</p>
<h1 id="title">Signal status</h1>
<div class="signal"><span id="red" class="light red"></span><span id="yellow" class="light yellow"></span><span id="green" class="light green"></span></div>
<p id="mode" class="mode">Connecting...</p>
<div class="meter"><span id="level"></span></div>
<p class="numbers"><span>Sound <b id="sound">-</b></span><span>Threshold <b id="threshold">-</b></span></p>
<p id="err" class="err"></p>
</main>
<script>
function paint(d){
  document.getElementById('red').className='light red'+(d.state==='RED'?' on':'');
  document.getElementById('yellow').className='light yellow'+(d.state==='YELLOW'?' on':'');
  document.getElementById('green').className='light green'+(d.state==='GREEN'?' on':'');
  document.getElementById('title').textContent=d.state+' signal';
  document.getElementById('mode').textContent=d.priority?'Ambulance priority active':'Normal cycle';
  document.getElementById('mode').className=d.priority?'mode priority':'mode';
  document.getElementById('sound').textContent=d.sound;
  document.getElementById('threshold').textContent=d.threshold;
  document.getElementById('level').style.width=Math.min(100,d.sound/Math.max(1,d.threshold)*70)+'%';
  document.getElementById('err').textContent='';
}
function tick(){fetch('/status').then(function(r){return r.json()}).then(paint).catch(function(){document.getElementById('err').textContent='No response. Stay connected to TrafficLab.'})}
tick();setInterval(tick,250);
</script>
</body>
</html>
)rawliteral";

#endif
