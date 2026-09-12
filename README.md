# One-day university IoT workshop

Morning is a 75-minute presentation followed by eight guided hardware exercises. Afternoon is three project labs, locked until the facilitator opens them.

## Student URLs (after GitHub Pages is on)

- Playbook: `https://<org>.github.io/<repo>/workshop/`

Enable Pages in the repo: Settings → Pages → Source **GitHub Actions**.

## Unlock (after lunch)

- Students type the spoken code on the last morning card (default **AFTERNOON**), or open `?phase=afternoon`.
- Unlock is stored in the browser so refresh keeps labs visible.
- Facilitators rehearse with `?role=facilitator` (labs always visible).
- Do not time-lock to the clock.

## Offline zips

CI uploads artifacts on every push, and attaches them to git tags:

- `workshop-morning.zip` — playbook + both PowerPoint sources + `sketches/exercises` for Exercises 1–8
- `workshop-afternoon.zip` — complete playbook + both PowerPoint sources + morning exercises + `sketches/traffic`, `sketches/tripwire`, `sketches/reaction`

Use the afternoon zip when students join an ESP32 access point and lose campus internet.

## Update the presentations

Replace the source decks under `presentations/` while keeping the canonical filenames `From-Sensors-to-Smart-Systems.pptx` and `IOT-Workshop-Prep-Book.pptx`. Push the change and Pages republishes the download files automatically.

## Repo map

| Path | Who |
|---|---|
| `workshop/` | Student day playbook |
| `presentations/` | Canonical prep-book and workshop PowerPoint sources |
| `sketches/exercises/` | Morning Exercises 1–8 with circuit diagrams |
| `sketches/traffic`, `tripwire`, `reaction` | Afternoon project pack |

Final POC pin maps: Traffic red/yellow/green 4/2/16, KY-037 DO 17, OLED SDA/SCL 22/21; Tripwire LDR AO 34, laser S 25, buzzer SIG 27; Reaction Arena LEDs 16/17/18/19 and matching buttons 25/26/27/32.
