const resumeForm = document.getElementById("resumeForm");
const optimizeBtn = document.getElementById("optimizeBtn");
const resumePreview = document.getElementById("resumePreview");
const templateUpload = document.getElementById("templateUpload");
const uploadStatus = document.getElementById("uploadStatus");

const templateStyle = {
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "12pt",
  lineHeight: "1.5",
  sectionSpacing: "20px",
};

function splitLines(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function improveBullet(line) {
  const normalized = line.replace(/\.$/, "");
  const hasVerb = /^(Led|Built|Improved|Managed|Delivered|Launched|Optimized)/i.test(normalized);
  let improved = hasVerb ? normalized : `Led ${normalized.charAt(0).toLowerCase()}${normalized.slice(1)}`;
  if (!/\d/.test(improved)) improved += " resulting in measurable impact";
  return `${improved}.`;
}

function applyStyleProfile() {
  resumePreview.style.fontFamily = templateStyle.fontFamily;
  resumePreview.style.fontSize = templateStyle.fontSize;
  resumePreview.style.lineHeight = templateStyle.lineHeight;
  document.querySelectorAll(".ats-section-title").forEach((el) => {
    el.style.marginTop = templateStyle.sectionSpacing;
  });
}

function renderResume() {
  const name = document.getElementById("name").value || "Your Name";
  const title = document.getElementById("title").value || "Your Role";
  const email = document.getElementById("email").value || "email@example.com";
  const phone = document.getElementById("phone").value || "(000) 000-0000";
  const location = document.getElementById("location").value || "City, Country";
  const summary = document.getElementById("summary").value || "Add your professional summary.";
  const skills = splitLines(document.getElementById("skills").value);
  const bullets = splitLines(document.getElementById("bullets").value);

  resumePreview.innerHTML = `
    <header class="ats-header">
      <h1>${name}</h1>
      <p>${phone} | ${email} | ${location}</p>
    </header>

    <section>
      <h2 class="ats-section-title">PROFESSIONAL SUMMARY</h2>
      <p>${summary}</p>
    </section>

    <section>
      <h2 class="ats-section-title">CORE SKILLS</h2>
      <p>${skills.length ? skills.join(" · ") : "Add your skills."}</p>
    </section>

    <section>
      <h2 class="ats-section-title">WORK EXPERIENCE</h2>
      <div class="exp-item">
        <div class="exp-header">
          <strong>${title}</strong>
          <span>Recent</span>
        </div>
        <ul>
          ${bullets.length ? bullets.map((b) => `<li>${b}</li>`).join("") : "<li>Add experience bullet points.</li>"}
        </ul>
      </div>
    </section>
  `;

  applyStyleProfile();
}

async function extractDocxStyle(arrayBuffer) {
  if (!window.mammoth) {
    throw new Error("Mammoth library is not loaded yet.");
  }

  const result = await window.mammoth.convertToHtml({ arrayBuffer });
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(result.value, "text/html");
  const firstHeading = htmlDoc.querySelector("h1, h2, h3, p");

  if (firstHeading) {
    const inlineStyle = firstHeading.getAttribute("style") || "";
    const fontMatch = inlineStyle.match(/font-family\s*:\s*([^;]+)/i);
    const sizeMatch = inlineStyle.match(/font-size\s*:\s*([^;]+)/i);
    const lineMatch = inlineStyle.match(/line-height\s*:\s*([^;]+)/i);
    if (fontMatch) templateStyle.fontFamily = fontMatch[1].trim();
    if (sizeMatch) templateStyle.fontSize = sizeMatch[1].trim();
    if (lineMatch) templateStyle.lineHeight = lineMatch[1].trim();
  }

  uploadStatus.textContent = "DOCX template processed. Style profile applied to your content.";
}

async function extractPdfStyle(arrayBuffer) {
  const pdfjsLib = await import("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.6.82/pdf.min.mjs");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.6.82/pdf.worker.min.mjs";

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const page = await pdf.getPage(1);
  const textContent = await page.getTextContent();
  const firstItem = textContent.items.find((item) => item.str && item.str.trim().length);

  if (firstItem) {
    const size = Math.abs(firstItem.transform[0] || 12);
    templateStyle.fontSize = `${Math.max(10, Math.min(16, Math.round(size)))}pt`;
    templateStyle.lineHeight = "1.45";
  }

  uploadStatus.textContent = "PDF template processed. Inferred style profile applied to your content.";
}

templateUpload.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  uploadStatus.textContent = "Reading template document...";

  try {
    const ext = file.name.toLowerCase();
    const arrayBuffer = await file.arrayBuffer();

    if (ext.endsWith(".docx")) {
      await extractDocxStyle(arrayBuffer);
    } else if (ext.endsWith(".pdf")) {
      await extractPdfStyle(arrayBuffer);
    } else {
      uploadStatus.textContent = "Unsupported file type. Please upload .docx or .pdf.";
      return;
    }

    renderResume();
  } catch (error) {
    uploadStatus.textContent = `Could not extract style from template: ${error.message}`;
  }
});

resumeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  renderResume();
});

optimizeBtn.addEventListener("click", () => {
  const summaryField = document.getElementById("summary");
  if (summaryField.value.trim().length < 60) {
    summaryField.value =
      "Analytically driven and results-oriented professional with proven success in data-backed decision making, communication, and cross-functional execution.";
  }

  const bulletsField = document.getElementById("bullets");
  const bullets = splitLines(bulletsField.value);
  bulletsField.value = bullets.length
    ? bullets.map(improveBullet).join("\n")
    : "Led a customer success initiative that improved retention by 18%.";

  renderResume();
});

renderResume();
