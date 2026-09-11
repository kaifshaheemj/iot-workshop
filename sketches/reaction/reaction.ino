#include <WiFi.h>
#include <WebServer.h>
#include <esp_system.h>

const uint8_t LED_PINS[4] = {16, 17, 18, 19};
const uint8_t BUTTON_PINS[4] = {25, 26, 27, 32};
const char *AP_SSID = "Reaction Arena";
const uint8_t MAX_PLAYERS = 4;
const uint8_t ROUND_COUNT = 3;
const uint32_t BUTTON_DEBOUNCE_MS = 25;
const uint32_t TARGET_TIMEOUT_MS = 3000;

WebServer server(80);

enum GameState {
  BOOT,
  SELECT_PLAYERS,
  JOIN_PLAYERS,
  WAIT_READY,
  WAIT_START,
  TURN_INTRO,
  LED_SEQUENCE,
  RANDOM_WAIT,
  TARGET_ACTIVE,
  SHOW_RESULT,
  ROUND_COMPLETE,
  GAME_OVER
};

struct Player {
  String name;
  String token;
  bool joined;
  bool ready;
  uint16_t score[ROUND_COUNT];
  uint32_t reactionTime[ROUND_COUNT];
  bool foul[ROUND_COUNT];
  String reason[ROUND_COUNT];
  uint16_t totalScore;
};

struct DebouncedButton {
  bool raw;
  bool stable;
  uint32_t changedAt;
  bool pressedEvent;
};

Player players[MAX_PLAYERS];
DebouncedButton buttons[4];
GameState gameState = BOOT;
uint8_t playerCount = 0;
uint8_t currentPlayer = 0;
uint8_t currentRound = 0;
uint8_t targetLed = 0;
uint8_t sequenceStep = 0;
uint32_t stateStartedAt = 0;
uint32_t randomWaitDuration = 0;
uint32_t targetStartedAtMs = 0;
uint32_t targetStartedAtUs = 0;
int8_t lastResultPlayer = -1;
uint32_t lastResultReaction = 0;
uint16_t lastResultScore = 0;
bool lastResultWasFoul = false;
String lastResultReason;

void setAllLeds(bool on) {
  for (uint8_t i = 0; i < 4; i++) digitalWrite(LED_PINS[i], on ? HIGH : LOW);
}

void setOnlyLed(int8_t selected) {
  for (uint8_t i = 0; i < 4; i++) digitalWrite(LED_PINS[i], i == selected ? HIGH : LOW);
}

void clearPlayer(Player &player) {
  player.name = "";
  player.token = "";
  player.joined = false;
  player.ready = false;
  player.totalScore = 0;
  for (uint8_t round = 0; round < ROUND_COUNT; round++) {
    player.score[round] = 0;
    player.reactionTime[round] = 0;
    player.foul[round] = false;
    player.reason[round] = "";
  }
}

void resetScores() {
  for (uint8_t i = 0; i < playerCount; i++) {
    players[i].ready = false;
    players[i].totalScore = 0;
    for (uint8_t round = 0; round < ROUND_COUNT; round++) {
      players[i].score[round] = 0;
      players[i].reactionTime[round] = 0;
      players[i].foul[round] = false;
      players[i].reason[round] = "";
    }
  }
  lastResultPlayer = -1;
}

int8_t playerForToken(const String &token) {
  if (!token.length()) return -1;
  for (uint8_t i = 0; i < playerCount; i++) {
    if (players[i].joined && players[i].token == token) return i;
  }
  return -1;
}

bool allPlayersJoined() {
  if (playerCount == 0) return false;
  for (uint8_t i = 0; i < playerCount; i++) if (!players[i].joined) return false;
  return true;
}

bool allPlayersReady() {
  if (!allPlayersJoined()) return false;
  for (uint8_t i = 0; i < playerCount; i++) if (!players[i].ready) return false;
  return true;
}

uint16_t pointsForReaction(uint32_t ms) {
  if (ms <= 400) return 100;
  if (ms <= 500) return 90;
  if (ms <= 600) return 80;
  if (ms <= 700) return 70;
  if (ms <= 900) return 60;
  if (ms <= 1000) return 50;
  if (ms <= 1200) return 40;
  if (ms <= 1600) return 30;
  if (ms <= 1800) return 20;
  return 10;
}

uint32_t averageValidReaction(uint8_t index) {
  uint32_t total = 0;
  uint8_t count = 0;
  for (uint8_t round = 0; round < ROUND_COUNT; round++) {
    if (!players[index].foul[round] && players[index].reactionTime[round] > 0) {
      total += players[index].reactionTime[round];
      count++;
    }
  }
  return count ? total / count : 0xFFFFFFFFUL;
}

void buildRanking(uint8_t order[MAX_PLAYERS]) {
  for (uint8_t i = 0; i < playerCount; i++) order[i] = i;
  for (uint8_t i = 0; i < playerCount; i++) {
    for (uint8_t j = i + 1; j < playerCount; j++) {
      uint8_t first = order[i];
      uint8_t second = order[j];
      bool swapNeeded = players[second].totalScore > players[first].totalScore;
      if (players[second].totalScore == players[first].totalScore) {
        swapNeeded = averageValidReaction(second) < averageValidReaction(first);
      }
      if (swapNeeded) {
        uint8_t saved = order[i];
        order[i] = order[j];
        order[j] = saved;
      }
    }
  }
}

uint8_t topScoreTieCount() {
  if (playerCount == 0) return 0;
  uint16_t topScore = players[0].totalScore;
  for (uint8_t i = 1; i < playerCount; i++) {
    if (players[i].totalScore > topScore) topScore = players[i].totalScore;
  }
  uint8_t tied = 0;
  for (uint8_t i = 0; i < playerCount; i++) {
    if (players[i].totalScore == topScore) tied++;
  }
  return tied;
}

void updateButtons() {
  uint32_t now = millis();
  for (uint8_t i = 0; i < 4; i++) {
    buttons[i].pressedEvent = false;
    bool reading = digitalRead(BUTTON_PINS[i]);
    if (reading != buttons[i].raw) {
      buttons[i].raw = reading;
      buttons[i].changedAt = now;
    }
    if (reading != buttons[i].stable && now - buttons[i].changedAt >= BUTTON_DEBOUNCE_MS) {
      buttons[i].stable = reading;
      if (reading == LOW) {
        buttons[i].pressedEvent = true;
        Serial.print("[BUTTON] B");
        Serial.print(i + 1);
        Serial.print(" PRESSED | GPIO ");
        Serial.println(BUTTON_PINS[i]);
      }
    }
  }
}

bool anyButtonPressed() {
  for (uint8_t i = 0; i < 4; i++) if (buttons[i].pressedEvent) return true;
  return false;
}

void enterTurnIntro() {
  setAllLeds(false);
  gameState = TURN_INTRO;
  stateStartedAt = millis();
}

void finishTurn(bool foul, const String &reason, uint32_t reaction) {
  setAllLeds(false);
  uint16_t score = foul ? 0 : pointsForReaction(reaction);
  Player &player = players[currentPlayer];
  player.score[currentRound] = score;
  player.reactionTime[currentRound] = foul ? 0 : reaction;
  player.foul[currentRound] = foul;
  player.reason[currentRound] = foul ? reason : "";
  player.totalScore += score;
  lastResultPlayer = currentPlayer;
  lastResultReaction = foul ? 0 : reaction;
  lastResultScore = score;
  lastResultWasFoul = foul;
  lastResultReason = reason;
  gameState = SHOW_RESULT;
  stateStartedAt = millis();
  Serial.print("[RESULT] Player ");
  Serial.print(currentPlayer + 1);
  if (foul) {
    Serial.print(" foul=");
    Serial.println(reason);
  } else {
    Serial.print(" reaction=");
    Serial.print(reaction);
    Serial.print("ms score=");
    Serial.println(score);
  }
}

void beginLedSequence() {
  gameState = LED_SEQUENCE;
  stateStartedAt = millis();
  sequenceStep = 0;
  setOnlyLed(0);
}

void beginRandomWait() {
  setAllLeds(false);
  gameState = RANDOM_WAIT;
  stateStartedAt = millis();
  randomWaitDuration = random(1000, 3001);
}

void beginTarget() {
  targetLed = random(0, 4);
  setOnlyLed(targetLed);
  targetStartedAtMs = millis();
  targetStartedAtUs = micros();
  gameState = TARGET_ACTIVE;
  Serial.print("[GAME] Target ");
  Serial.println(targetLed + 1);
}

void runGameStateMachine() {
  uint32_t now = millis();
  bool pressed = anyButtonPressed();

  switch (gameState) {
    case BOOT:
      if (now - stateStartedAt >= 2600) {
        gameState = SELECT_PLAYERS;
        stateStartedAt = now;
      }
      break;

    case TURN_INTRO:
      if (pressed) finishTurn(true, "TOO_EARLY", 0);
      else if (now - stateStartedAt >= 2800) beginLedSequence();
      break;

    case LED_SEQUENCE: {
      if (pressed) {
        finishTurn(true, "TOO_EARLY", 0);
        break;
      }
      const int8_t pattern[] = {0, 1, 2, 3, 3, 2, 1, 0, 4, -1};
      uint8_t wantedStep = min((uint32_t)9, (now - stateStartedAt) / 100);
      if (wantedStep != sequenceStep) {
        sequenceStep = wantedStep;
        if (pattern[sequenceStep] == 4) setAllLeds(true);
        else setOnlyLed(pattern[sequenceStep]);
      }
      if (now - stateStartedAt >= 1000) beginRandomWait();
      break;
    }

    case RANDOM_WAIT:
      if (pressed) finishTurn(true, "TOO_EARLY", 0);
      else if (now - stateStartedAt >= randomWaitDuration) beginTarget();
      break;

    case TARGET_ACTIVE: {
      bool correctPressed = false;
      bool wrongPressed = false;
      for (uint8_t i = 0; i < 4; i++) {
        if (buttons[i].pressedEvent) {
          if (i == targetLed) correctPressed = true;
          else wrongPressed = true;
        }
      }
      if (wrongPressed) finishTurn(true, "WRONG_BUTTON", 0);
      else if (correctPressed) finishTurn(false, "", (micros() - targetStartedAtUs) / 1000UL);
      else if (now - targetStartedAtMs >= TARGET_TIMEOUT_MS) finishTurn(true, "TIME_OUT", 0);
      break;
    }

    case SHOW_RESULT:
      if (now - stateStartedAt >= 1800) {
        if (currentPlayer + 1 < playerCount) {
          currentPlayer++;
          enterTurnIntro();
        } else {
          currentPlayer = 0;
          gameState = ROUND_COMPLETE;
          stateStartedAt = now;
        }
      }
      break;

    case ROUND_COMPLETE:
      if (now - stateStartedAt >= 2500) {
        if (currentRound + 1 >= ROUND_COUNT) {
          gameState = GAME_OVER;
          stateStartedAt = now;
        } else {
          currentRound++;
          currentPlayer = 0;
          enterTurnIntro();
        }
      }
      break;

    default:
      break;
  }
}

String htmlEscape(String value) {
  value.replace("&", "&amp;");
  value.replace("<", "&lt;");
  value.replace(">", "&gt;");
  value.replace("\"", "&quot;");
  value.replace("'", "&#39;");
  return value;
}

String cleanValue(String value, uint8_t maxLength) {
  value.trim();
  String clean;
  for (uint16_t i = 0; i < value.length() && clean.length() < maxLength; i++) {
    char character = value[i];
    if ((character >= 'a' && character <= 'z') || (character >= 'A' && character <= 'Z') ||
        (character >= '0' && character <= '9') || character == ' ' || character == '-') clean += character;
  }
  clean.trim();
  return clean;
}

String hiddenToken(const String &token) {
  return "<input type='hidden' name='token' value='" + htmlEscape(token) + "'>";
}

void redirectToGame(String token) {
  token = cleanValue(token, 48);
  if (!token.length()) token = String((uint32_t)esp_random(), HEX) + "-" + String((uint32_t)esp_random(), HEX);
  server.sendHeader("Location", "/?token=" + token, true);
  server.send(303, "text/plain", "");
}

String playerCards() {
  String html = "<div class='players'>";
  for (uint8_t i = 0; i < playerCount; i++) {
    html += "<div class='player'><b>P" + String(i + 1) + "</b> ";
    html += players[i].joined ? htmlEscape(players[i].name) : "Waiting...";
    if (players[i].ready) html += " <span>READY</span>";
    html += "<strong>" + String(players[i].totalScore) + " pts</strong></div>";
  }
  return html + "</div>";
}

void handlePage() {
  String token = cleanValue(server.arg("token"), 48);
  if (!token.length()) {
    redirectToGame("");
    return;
  }
  int8_t own = playerForToken(token);
  String hidden = hiddenToken(token);
  String html;
  html.reserve(7000);
  html = "<!doctype html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'>";
  html += "<meta http-equiv='refresh' content='1;url=/?token=" + token + "'><title>Reaction Arena</title><style>";
  html += "body{margin:0;background:#eef3f8;color:#132238;font-family:Arial,sans-serif}.app{max-width:620px;margin:auto;padding:24px 15px}.brand{text-align:center;font-size:36px;font-weight:900;letter-spacing:.08em}.brand span{color:#2563eb}.live{text-align:center;color:#07865e;font-weight:700;margin:7px 0 20px}.panel{background:#fff;border-radius:22px;padding:22px;box-shadow:0 16px 45px #2335}h1{text-align:center}button,input{box-sizing:border-box;width:100%;padding:14px;border-radius:12px;font-size:17px;margin:5px 0}button{border:0;background:#2563eb;color:#fff;font-weight:800}.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.player{display:grid;grid-template-columns:38px 1fr auto;gap:8px;padding:12px;border-bottom:1px solid #dde5ee}.player span{color:#07865e;font-size:12px}.player strong{font-size:13px}.rounds{padding:7px 12px 12px 50px;color:#607086;font-size:12px}.result{text-align:center;padding:18px;border-radius:14px;background:#eef4ff;font-size:22px}.muted{text-align:center;color:#607086}.danger{background:#be123c}@media(max-width:420px){.grid{grid-template-columns:1fr}}</style></head><body><main class='app'><div class='brand'>REACTION <span>ARENA</span></div><div class='live'>LIVE · 192.168.4.1</div><section class='panel'>";

  if (gameState == BOOT) {
    html += "<h1>Powering up...</h1>";
  } else if (gameState == SELECT_PLAYERS) {
    html += "<h1>Select players</h1><div class='grid'>";
    for (uint8_t count = 1; count <= 4; count++) {
      html += "<form method='post' action='/select'>" + hidden + "<input type='hidden' name='count' value='" + String(count) + "'><button>" + String(count) + " PLAYER" + String(count > 1 ? "S" : "") + "</button></form>";
    }
    html += "</div><p class='muted'>The first accepted selection locks the lobby size.</p>";
  } else if (own < 0 && (gameState == JOIN_PLAYERS || gameState == WAIT_READY || gameState == WAIT_START)) {
    html += "<h1>Join " + String(playerCount) + " player game</h1><form method='post' action='/join'>" + hidden + "<input name='name' maxlength='16' placeholder='Your name' required><button>JOIN GAME</button></form>" + playerCards();
  } else if (gameState == JOIN_PLAYERS || gameState == WAIT_READY || gameState == WAIT_START) {
    html += "<h1>Lobby</h1>" + playerCards();
    if (own >= 0 && !players[own].ready && gameState != JOIN_PLAYERS) html += "<form method='post' action='/ready'>" + hidden + "<button>I'M READY</button></form>";
    else if (own == 0 && allPlayersReady()) html += "<form method='post' action='/start'>" + hidden + "<button>START GAME</button></form>";
    else html += "<p class='muted'>Waiting for everyone...</p>";
  } else if (gameState == TURN_INTRO || gameState == LED_SEQUENCE || gameState == RANDOM_WAIT || gameState == TARGET_ACTIVE) {
    String message = gameState == TARGET_ACTIVE ? "PRESS!" : gameState == RANDOM_WAIT ? "WAIT..." : "GET READY";
    html += "<p class='muted'>Round " + String(currentRound + 1) + " / 3</p><h1>" + htmlEscape(players[currentPlayer].name) + "'S TURN</h1><div class='result'><b>" + message + "</b><br>Watch the physical LEDs</div>" + playerCards();
  } else if (gameState == SHOW_RESULT) {
    html += "<h1>" + htmlEscape(players[lastResultPlayer].name) + "</h1><div class='result'>";
    if (lastResultWasFoul) html += "FOUL: " + htmlEscape(lastResultReason) + "<br><b>0 points</b>";
    else html += String(lastResultReaction) + " ms<br><b>" + String(lastResultScore) + " points</b>";
    html += "</div>" + playerCards();
  } else if (gameState == ROUND_COMPLETE) {
    html += "<h1>Round " + String(currentRound + 1) + " complete</h1>" + playerCards();
  } else if (gameState == GAME_OVER) {
    uint8_t order[MAX_PLAYERS];
    buildRanking(order);
    if (topScoreTieCount() > 1) html += "<h1>Draw match</h1><div class='players'>";
    else html += "<h1>Winner: " + htmlEscape(players[order[0]].name) + "</h1><div class='players'>";
    for (uint8_t rank = 0; rank < playerCount; rank++) {
      uint8_t index = order[rank];
      html += "<div class='player'><b>#" + String(rank + 1) + "</b> " + htmlEscape(players[index].name) + "<strong>" + String(players[index].totalScore) + " pts</strong></div><div class='rounds'>";
      for (uint8_t round = 0; round < ROUND_COUNT; round++) {
        if (round) html += " · ";
        html += "R" + String(round + 1) + ": ";
        if (players[index].foul[round]) html += htmlEscape(players[index].reason[round]);
        else html += String(players[index].reactionTime[round]) + " ms / " + String(players[index].score[round]) + " pts";
      }
      html += "</div>";
    }
    html += "</div>";
    if (own == 0) html += "<div class='grid'><form method='post' action='/again'>" + hidden + "<button>PLAY AGAIN</button></form><form method='post' action='/new'>" + hidden + "<button class='danger'>NEW GAME</button></form></div>";
  }

  html += "</section></main></body></html>";
  server.sendHeader("Cache-Control", "no-store");
  server.send(200, "text/html; charset=utf-8", html);
}

void handleSelect() {
  int count = server.arg("count").toInt();
  if (gameState == SELECT_PLAYERS && playerCount == 0 && count >= 1 && count <= 4) {
    playerCount = count;
    for (uint8_t i = 0; i < MAX_PLAYERS; i++) clearPlayer(players[i]);
    gameState = JOIN_PLAYERS;
    stateStartedAt = millis();
  }
  redirectToGame(server.arg("token"));
}

void handleJoin() {
  String token = cleanValue(server.arg("token"), 48);
  String name = cleanValue(server.arg("name"), 16);
  if (token.length() && name.length() && (gameState == JOIN_PLAYERS || gameState == WAIT_READY || gameState == WAIT_START) && playerForToken(token) < 0) {
    for (uint8_t i = 0; i < playerCount; i++) {
      if (!players[i].joined) {
        players[i].joined = true;
        players[i].name = name;
        players[i].token = token;
        if (allPlayersJoined()) gameState = WAIT_READY;
        break;
      }
    }
  }
  redirectToGame(token);
}

void handleReady() {
  String token = cleanValue(server.arg("token"), 48);
  int8_t index = playerForToken(token);
  if (index >= 0 && (gameState == WAIT_READY || gameState == WAIT_START)) {
    players[index].ready = true;
    if (allPlayersReady()) gameState = WAIT_START;
  }
  redirectToGame(token);
}

void handleStart() {
  String token = cleanValue(server.arg("token"), 48);
  if (playerForToken(token) == 0 && gameState == WAIT_START && allPlayersReady()) {
    currentRound = 0;
    currentPlayer = 0;
    lastResultPlayer = -1;
    enterTurnIntro();
  }
  redirectToGame(token);
}

void handleAgain() {
  String token = cleanValue(server.arg("token"), 48);
  if (playerForToken(token) == 0 && gameState == GAME_OVER) {
    resetScores();
    currentRound = 0;
    currentPlayer = 0;
    gameState = WAIT_READY;
  }
  redirectToGame(token);
}

void handleNewGame() {
  String token = cleanValue(server.arg("token"), 48);
  if (playerForToken(token) == 0 && gameState == GAME_OVER) {
    setAllLeds(false);
    playerCount = 0;
    for (uint8_t i = 0; i < MAX_PLAYERS; i++) clearPlayer(players[i]);
    gameState = SELECT_PLAYERS;
  }
  redirectToGame(token);
}

void setup() {
  Serial.begin(115200);
  for (uint8_t i = 0; i < 4; i++) {
    pinMode(LED_PINS[i], OUTPUT);
    digitalWrite(LED_PINS[i], LOW);
    pinMode(BUTTON_PINS[i], INPUT_PULLUP);
    bool initial = digitalRead(BUTTON_PINS[i]);
    buttons[i] = {initial, initial, millis(), false};
  }
  for (uint8_t i = 0; i < MAX_PLAYERS; i++) clearPlayer(players[i]);

  WiFi.mode(WIFI_AP);
  WiFi.setSleep(false);
  WiFi.softAP(AP_SSID);
  randomSeed(esp_random());
  server.on("/", HTTP_GET, handlePage);
  server.on("/select", HTTP_POST, handleSelect);
  server.on("/join", HTTP_POST, handleJoin);
  server.on("/ready", HTTP_POST, handleReady);
  server.on("/start", HTTP_POST, handleStart);
  server.on("/again", HTTP_POST, handleAgain);
  server.on("/new", HTTP_POST, handleNewGame);
  server.begin();

  Serial.println("Reaction Arena ready");
  Serial.print("WiFi: ");
  Serial.println(AP_SSID);
  Serial.print("Open: http://");
  Serial.println(WiFi.softAPIP());
  stateStartedAt = millis();
}

void loop() {
  server.handleClient();
  updateButtons();
  runGameStateMachine();
  delay(1);
}
