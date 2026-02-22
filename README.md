# ATS Resume Builder

A single-template ATS resume builder for GitHub Pages.

## Features
- Clean two-panel design for content input and live ATS preview.
- Upload one `.docx` or `.pdf` document and apply inferred template style to preview.
- Keep original user wording while applying style profile (font/size/spacing).
- Includes an Education section in the builder and final preview.
- Download the current preview as a Word-compatible `.doc` file.
- Includes provided ATS source snippets:
  - `templates/ats-html/ats-template.html`
  - `templates/ats-css/ats-template.css`

## Run locally
```bash
python3 -m http.server 4173
```
Open `http://localhost:4173`.

## Deploy to GitHub Pages
1. Push branch to GitHub.
2. Go to **Settings → Pages**.
3. Select default branch root and save.
