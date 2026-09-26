# Minimal JSON-driven Personal Website

A responsive personal portfolio built with only:
- HTML
- CSS
- Vanilla JavaScript
- JSON

No framework, no build step, no database.

## Customize

Almost everything lives in `data.json`.

### Reorder sections

Change:

```json
"sections": ["hero", "about", "skills", "experience", "projects", "certifications", "writing", "contact"]
```

For example:

```json
"sections": ["hero", "projects", "experience", "skills", "contact"]
```

A section not listed there will not render.

### Optional content

Most content is conditional. If you remove or empty an item:
- no profile image -> image area disappears
- no resume path -> Resume button disappears
- no calendar -> Schedule a call disappears
- no project image -> no image is rendered
- no blog/social URL -> that link is skipped
- remove a section from `sections` -> whole section disappears

### Add your files

Put your resume at:

`assets/resume.pdf`

Put images in `assets/` and reference them in JSON, e.g.:

```json
"profileImage": "assets/me.jpg"
```

## GitHub Pages

1. Create a GitHub repository.
2. Upload all files in this folder.
3. Go to **Settings → Pages**.
4. Select **Deploy from a branch**.
5. Choose your main branch and `/ (root)`.
6. Save.

GitHub Pages will host it for free.

## Local preview

Because `data.json` is loaded with `fetch()`, opening `index.html` directly as a `file://` URL may be blocked by the browser.

Use any static server, for example:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Design

The template intentionally takes inspiration from the supplied screenshots:
- dark terminal/editor aesthetic
- monospace metadata
- subtle grid
- thin borders
- large typography
- responsive layout
- optional light mode
- no framework or dependency
