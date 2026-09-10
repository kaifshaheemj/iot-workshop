---
name: workshop-playbook
description: >-
  Builds or extends an offline workshop playbook using this repo’s light theme,
  Calibri/Times New Roman sizes, gated Next/checkpoints, and content.js modules.
  Use when the user asks for a workshop playbook, student handbook, lab guide,
  interactive playbook, or to reuse the Intruder Detection playbook template.
---

# Workshop playbook

Reuse the template folder that **already contains the theme**. Do not invent a new UI.

## Required files

Start from [templates/workshop-playbook/](../../../templates/workshop-playbook/) for a **standalone** playbook.

For this repo’s **one-day session**, edit [workshop/](../../../workshop/) instead: morning theory stays visible; afternoon modules use `phase: "afternoon"` and stay locked until unlock. Teammates fill **one** of [workshop/contexts/](../../../workshop/contexts/) (`traffic.md`, `tripwire.md`, `reaction.md`) and paste [PROMPT.md](../../../templates/workshop-playbook/PROMPT.md). Do not spoil PoC names on morning pages or slides.

- `styles.css` — locked theme (do not rewrite)
- `index.html` — shell
- `app.js` — engine (includes afternoon unlock in `workshop/app.js`)
- `content.js` — morning + locked afternoon modules

The team fills CONTEXT only (their PoC). First student page must always be the university workshop day (**Why you are here**) with **no demo names**. Do not add hardware that is not in the PoC.

## Theme lock

- Light only. Teal actions, coral accent, white cards.
- Body font: Calibri. Headings: Times New Roman.
- Sizes: 12pt body, 11pt caption, 10pt small, 13pt lede, 14pt h2, 18pt h1.
- Code: Consolas / Courier New.

## Behavior lock

- Offline `index.html`. No npm/React.
- Next is blocked until checkpoint (and quiz) is done. Show the yellow gate banner. Stay on the page.
- Ticking a checkbox does not change the page.
- Last step: Done stays on that page.
- Set `window.PLAYBOOK_ID` to a unique slug.

## Content shape

```javascript
window.PLAYBOOK_ID = "unique-slug";
window.PLAYBOOK = {
  modules: [{ id, title, phase: "afternoon"?, teaser?, steps: [{ id, title, html, checkpoint?, quiz?, facilitator? }] }]
};
```

Use existing classes only: `lede`, `callout`, `callout warn`, `only-beginner`, `hide-expert`, `data-table`, `code-block`, `checklist`, `accordion`.

Hardware sketches: Arduino IDE folders (`name/name.ino`), ASCII comments, no extra libraries unless requested.
