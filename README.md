# One-day university IoT workshop

Morning is theory (playbook + in-site slider). Afternoon is three kit labs, locked until the facilitator opens them.

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

- `workshop-morning.zip` — playbook + slider images, **no sketches**
- `workshop-afternoon.zip` — playbook + `sketches/traffic`, `sketches/tripwire`, `sketches/reaction`

Use the afternoon zip when students join an ESP32 access point and lose campus internet.

## Update the morning deck

1. Edit the Google prep-book.
2. File → Download → PNG.
3. Replace files in `workshop/slides/images/` as `01.png`, `02.png`, …
4. Point `workshop/slides.json` at those files (or drop JSON images and let the slider auto-read numbered PNGs).
5. Push. Pages republishes. The slider does not unlock labs.

## Repo map

| Path | Who |
|---|---|
| `workshop/` | Student day app |
| `workshop/contexts/` | Teammates fill **one** PoC file |
| `templates/workshop-playbook/` | Zip + prompt for authors |
| `sketches/traffic`, `tripwire`, `reaction` | Afternoon pack only |
| `playbook/` | Earlier single tripwire draft |

Default pins (change in CONTEXT, then in the sketch `#define` / `const int` lines): traffic R/Y/G 25/26/27, sound 34; tripwire LDR 34, laser 25, buzzer 27; reaction LEDs 25/26/27, button 4.
