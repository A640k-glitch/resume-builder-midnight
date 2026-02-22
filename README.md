# ATS Resume Builder

Single-template ATS resume builder for GitHub Pages.

## Features
- One ATS template flow (no multi-template design picker).
- Upload `.docx` or `.pdf` template to extract style cues.
- Keeps the user's resume text unchanged while applying inferred style profile.
- Includes provided ATS template assets:
  - `templates/ats-html/ats-template.html`
  - `templates/ats-css/ats-template.css`

## Run locally
```bash
python3 -m http.server 4173
```
Then open `http://localhost:4173`.

## Deploy to GitHub Pages
1. Push this repository to GitHub.
2. Open **Settings → Pages**.
3. Select the deployment source for the default branch root.
4. Save and wait for publish.
