# Midnight ATS Resume Builder

A deep-black GitHub Pages resume builder that uses **one ATS template** and supports uploading a **Word (.docx) or PDF (.pdf)** file to extract style characteristics.

## What it does
- Keeps the user's original resume words/content.
- Applies style profile inferred from uploaded template document (font/size/line-height where available).
- Uses ATS-friendly structure in preview output.
- Includes your provided ATS HTML and CSS snippets in dedicated folders:
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
3. Select the default branch root folder and save.
