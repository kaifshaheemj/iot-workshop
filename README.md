# One-day university IoT workshop

Morning is a 75-minute presentation followed by eight guided hardware exercises. Afternoon is three project labs, locked until the facilitator opens them.

## Student URLs (after GitHub Pages is on)

- Playbook: `https://<org>.github.io/<repo>/workshop/`
- Morning slides: `https://<org>.github.io/<repo>/workshop/slides.html`

Enable Pages in the repo: Settings → Pages → Source **GitHub Actions**.

## Unlock (after lunch)

- Students type the spoken code on the last morning card (default **AFTERNOON**), or open `?phase=afternoon`.
- Unlock is stored in the browser so refresh keeps labs visible.
- Facilitators rehearse with `?role=facilitator` (labs always visible).
- Do not time-lock to the clock.

## Offline zips

CI uploads artifacts on every push, and attaches them to git tags:

- `workshop-morning.zip` — playbook + 20-slide presentation + `sketches/exercises` for Exercises 1–8
- `workshop-afternoon.zip` — complete playbook + morning exercises + `sketches/traffic`, `sketches/tripwire`, `sketches/reaction`

Use the afternoon zip when students join an ESP32 access point and lose campus internet.

## Update the morning deck

1. Edit the source PowerPoint deck.
2. Copy the updated original to `workshop/assets/From-Sensors-to-Smart-Systems.pptx`.
3. Export every slide at 1600×900 PNG.
4. Replace `workshop/slides/images/01.png` through `20.png`, preserving the numeric order and removing stale numbered images.
5. Update the presentation title in `workshop/slides.js` if it changed, then push. Pages republishes automatically.

## Repo map

| Path | Who |
|---|---|
| `workshop/` | Student day app + presentation viewer |
| `workshop/assets/` | Downloadable original presentation |
| `workshop/contexts/` | Teammates fill **one** PoC file |
| `templates/workshop-playbook/` | Zip + prompt for authors |
| `sketches/exercises/` | Morning Exercises 1–8 with circuit diagrams |
| `sketches/traffic`, `tripwire`, `reaction` | Afternoon project pack |
| `playbook/` | Earlier single tripwire draft |

Final POC pin maps: Traffic red/yellow/green 4/2/16, KY-037 DO 17, OLED SDA/SCL 22/21; Tripwire LDR AO 34, laser S 25, buzzer SIG 27; Reaction Arena LEDs 16/17/18/19 and matching buttons 25/26/27/32.
