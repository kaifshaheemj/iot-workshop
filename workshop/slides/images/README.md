# Slide images

Export the Google prep-book and replace the placeholder SVGs.

1. In Google Slides: File → Download → PNG (one image per slide), or PDF then convert.
2. Name files in order: `01.png`, `02.png`, `03.png`, …
3. Put them in this folder.
4. Update `workshop/slides.json` `images` list, or delete the JSON `images` array and let the slider auto-read `01.png`, `02.png`, …
5. Commit and push. GitHub Pages updates in about a minute.

Do not put afternoon demo names, wiring, or sketch screenshots on early morning slides.
