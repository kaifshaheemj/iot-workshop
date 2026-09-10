# Workshop playbook — share this folder

This folder is a **student workshop playbook template**. For the **one-day university session** in this repo, teammates do **not** redesign the morning or the lock. They fill **one** PoC context and generate **one** afternoon module.

Works in Cursor, GitHub Copilot, ChatGPT, Claude, Gemini, Windsurf, or any other assistant.

## Who it is for

- **Students:** university workshop attendees. Morning theory; after lunch, three kit labs in order.
- **Your team:** fill only the PoC. Do not invent UI, extra parts, or afternoon spoilers for the morning.

## Files

| File | What it is | Who edits |
|---|---|---|
| `styles.css` | Light theme, Calibri 12pt, Times New Roman titles | Nobody |
| `index.html` | Shell | Nobody |
| `app.js` | Next/Back, checkpoint gate | Nobody |
| `content.js` | Lessons | Copilot, from context |
| `CONTEXT.md` | PoC / problem | **Your team only** |
| `PROMPT.md` | Instructions for the copilot | Paste as-is |

For this repo’s day: copy one of `workshop/contexts/traffic.md`, `tripwire.md`, or `reaction.md` into `CONTEXT.md` (or attach that file). Do not paste all three.

---

BEGIN PROMPT

You are generating **one** student workshop PoC module from a single CONTEXT file. The audience is university students in a live one-day workshop (mixed skill). Morning theory and afternoon unlock already exist in `workshop/`. You are not making a product landing page or a textbook.

### If you are working in this repo’s day playbook (`workshop/`)

- Do **not** rewrite morning modules (`workshop`, `theory`) or the unlock card.
- Do **not** reveal this PoC on morning pages or in the slide deck.
- Read **only** the one CONTEXT file the teammate attached (`workshop/contexts/traffic.md` or `tripwire.md` or `reaction.md`). Ignore the other two labs.
- Update **only** that lab’s afternoon module inside `workshop/content.js` (`phase: "afternoon"`, teaser stays “Afternoon N — locked until lunch”).
- Write Arduino sketches only under `sketches/traffic/`, `sketches/tripwire/`, or `sketches/reaction/` to match that CONTEXT.
- Keep `workshop/app.js`, `workshop/index.html`, `workshop/styles.css`, `workshop/slides.html` unchanged.

### If you are generating a standalone playbook from this template folder

The theme already exists. Do not restyle. Keep `styles.css`, `index.html`, `app.js` unchanged. Rewrite `content.js` only (and `sketches/` if the PoC needs uploadable code). Always start with a Workshop first page (**Why you are here**). Then: Setup (kit from PoC only) → labs that build to the PoC → troubleshoot.

### Keep unchanged (theme)

- Light cream/sky, white cards, teal, coral; Calibri body 12pt; Times New Roman h1 18pt / h2 14pt
- Gated Next, yellow banner if they skip the checkpoint, checkbox does not auto-advance, last step stays put

### Nuances (required)

- **Only parts in this PoC.** Lab 2 has no practice button. Lab 3 may include a react button because that PoC needs it. No extra sensors “for practice.”
- **Skill picker** classes: `only-beginner`, `hide-expert`.
- **Checkpoints** on every lab step that can fail.
- **Arduino:** folder name = `.ino` name, ASCII comments, wiring at top of file, no extra libraries unless the PoC needs them. USB data cable vs charge-only.
- **Facilitator** notes: ask before you tell.
- Offline: double-click `index.html`. No npm, no React, no login.
- Use only existing classes: `lede`, `callout`, `callout warn`, `callout danger`, `only-beginner`, `hide-expert`, `data-table`, `code-block`, `checklist`, `accordion`.

### Input

Read the single CONTEXT the teammate filled. That is the only workshop-specific input. If CONTEXT is empty, stop and ask for the PoC. If CONTEXT describes one of the three day labs, implement that lab only.

END PROMPT
