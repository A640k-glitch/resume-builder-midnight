const templates = [
  {
    id: "template-atlantic",
    name: "Atlantic Minimal",
    source: "Inspired by Novorésumé clean layouts",
  },
  {
    id: "template-onyx",
    name: "Onyx Executive",
    source: "Inspired by Canva executive templates",
  },
  {
    id: "template-zenith",
    name: "Zenith Modern",
    source: "Inspired by Enhancv modern resumes",
  },
  {
    id: "template-slate",
    name: "Slate Sidebar",
    source: "Inspired by Resume.io two-column format",
  },
  {
    id: "template-noir",
    name: "Noir Professional",
    source: "Inspired by Adobe Express resume styles",
  },
];

const templateList = document.getElementById("templateList");
const resumePreview = document.getElementById("resumePreview");
const resumeForm = document.getElementById("resumeForm");
const optimizeBtn = document.getElementById("optimizeBtn");

let selectedTemplate = templates[0].id;

function createTemplateButtons() {
  templateList.innerHTML = templates
    .map(
      (template) => `
      <button type="button" class="template ${template.id === selectedTemplate ? "active" : ""}" data-template-id="${template.id}">
        <strong>${template.name}</strong>
        <p>${template.source}</p>
      </button>
    `,
    )
    .join("");
}

function splitBullets(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function improveBullet(line) {
  const starters = ["Led", "Delivered", "Built", "Improved", "Optimized", "Launched"];
  const hasStrongVerb = starters.some((verb) => line.toLowerCase().startsWith(verb.toLowerCase()));
  const normalized = line.replace(/\.$/, "");

  let improved = hasStrongVerb ? normalized : `Led ${normalized.charAt(0).toLowerCase()}${normalized.slice(1)}`;

  if (!/\d/.test(improved)) {
    improved += " resulting in measurable performance gains";
  }

  if (!improved.endsWith(".")) {
    improved += ".";
  }

  return improved.charAt(0).toUpperCase() + improved.slice(1);
}

function renderResume() {
  const name = document.getElementById("name").value || "Your Name";
  const title = document.getElementById("title").value || "Your Role";
  const email = document.getElementById("email").value || "email@example.com";
  const phone = document.getElementById("phone").value || "(000) 000-0000";
  const location = document.getElementById("location").value || "City, Country";
  const summary = document.getElementById("summary").value || "Add your professional summary.";
  const bullets = splitBullets(document.getElementById("bullets").value);

  resumePreview.className = `resume-preview ${selectedTemplate}`;
  resumePreview.innerHTML = `
    <header class="resume-header">
      <h4 class="resume-name">${name}</h4>
      <p class="resume-title">${title}</p>
      <p class="resume-contact">${email} · ${phone} · ${location}</p>
    </header>
    <p class="resume-summary">${summary}</p>
    <ul class="resume-bullets">
      ${
        bullets.length
          ? bullets.map((bullet) => `<li>${bullet}</li>`).join("")
          : "<li>Add achievement bullets to preview your experience.</li>"
      }
    </ul>
  `;
}

resumeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  renderResume();
});

templateList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-template-id]");
  if (!button) return;
  selectedTemplate = button.dataset.templateId;
  createTemplateButtons();
  renderResume();
});

optimizeBtn.addEventListener("click", () => {
  const bulletsField = document.getElementById("bullets");
  const rawBullets = splitBullets(bulletsField.value);

  if (!rawBullets.length) {
    bulletsField.value = "Led a cross-functional initiative that improved user retention by 18%.";
  } else {
    bulletsField.value = rawBullets.map(improveBullet).join("\n");
  }

  const summaryField = document.getElementById("summary");
  if (summaryField.value.trim().length < 50) {
    summaryField.value =
      "Strategic and execution-focused professional with a track record of delivering measurable business impact through cross-functional leadership, process improvement, and user-centered decision making.";
  }

  renderResume();
});

createTemplateButtons();
renderResume();
