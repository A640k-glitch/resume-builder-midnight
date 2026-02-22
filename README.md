# ATS Resume Builder

A clean ATS-focused GitHub Pages resume builder with single-template style upload.

## What it does
- Keeps the user's original resume wording.
- Accepts one `.docx` or `.pdf` template file and applies inferred style profile (font/size/spacing) to preview.
- Uses ATS-safe structure for output preview.
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
