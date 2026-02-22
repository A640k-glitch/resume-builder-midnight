const form = document.getElementById('resume-form');
const preview = document.getElementById('resume-preview');
const optimizeBtn = document.getElementById('optimize-btn');
const templateGallery = document.getElementById('template-gallery');

const templates = [
  {
    id: 'executive',
    name: 'Executive Noir',
    description: 'Premium single-column format for leadership and strategy roles.',
    source: 'https://www.canva.com/resumes/templates/professional/'
  },
  {
    id: 'modern',
    name: 'Modern Edge',
    description: 'Clean hierarchy and accent color for product, engineering, and design.',
    source: 'https://www.overleaf.com/latex/templates/tagged/cv'
  },
  {
    id: 'slate',
    name: 'Slate Classic',
    description: 'Conservative corporate tone with maximum readability.',
    source: 'https://novoresume.com/resume-templates'
  },
  {
    id: 'minimal',
    name: 'Minimal Grid',
    description: 'Simple typography for ATS-friendly submissions.',
    source: 'https://resumegenius.com/resume-templates'
  },
  {
    id: 'bold',
    name: 'Bold Impact',
    description: 'Statement layout for sales, consulting, and GTM professionals.',
    source: 'https://www.indeed.com/career-advice/resume-samples'
  }
];

let currentTemplate = 'executive';

const state = {
  name: 'Avery Morgan',
  title: 'Senior Product Designer',
  email: 'avery@email.com',
  phone: '+1 555 010 2233',
  location: 'Toronto, Canada',
  summary: 'Outcome-driven designer with 8+ years shaping B2B and SaaS experiences that accelerate growth and retention.',
  experience: [
    'Redesigned onboarding journey and increased activation by 32% in six weeks.',
    'Built a design system used by 6 teams, reducing UI delivery time by 40%.',
    'Partnered with product and engineering to launch 3 features generating $1.1M ARR.'
  ],
  skills: ['Figma', 'Product Strategy', 'Design Systems', 'A/B Testing', 'Mentorship']
};

function renderTemplates() {
  templateGallery.innerHTML = templates
    .map(
      (template) => `
      <article class="template-card">
        <h4>${template.name}</h4>
        <p>${template.description}</p>
        <a href="${template.source}" target="_blank" rel="noreferrer">Online reference</a>
        <button type="button" data-template="${template.id}" class="btn ${currentTemplate === template.id ? 'accent' : ''}">
          Use template
        </button>
      </article>
    `
    )
    .join('');

  templateGallery.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => {
      currentTemplate = button.dataset.template;
      renderResume();
      renderTemplates();
    });
  });
}

function renderResume() {
  preview.className = `template ${currentTemplate}`;
  preview.innerHTML = `
    <h3 class="resume-name">${state.name}</h3>
    <p class="resume-title">${state.title}</p>
    <p class="resume-contact">${state.email} • ${state.phone} • ${state.location}</p>

    <section class="resume-section">
      <h4>Summary</h4>
      <p>${state.summary}</p>
    </section>

    <section class="resume-section">
      <h4>Experience Highlights</h4>
      <ul>${state.experience.map((line) => `<li>${line}</li>`).join('')}</ul>
    </section>

    <section class="resume-section">
      <h4>Core Skills</h4>
      <div class="chip-list">${state.skills.map((skill) => `<span class="chip">${skill}</span>`).join('')}</div>
    </section>
  `;
}

function writeStatus(message) {
  let status = document.querySelector('.status');
  if (!status) {
    status = document.createElement('p');
    status.className = 'status';
    form.appendChild(status);
  }
  status.textContent = message;
}

function collectFormData() {
  const data = new FormData(form);
  state.name = data.get('name') || '';
  state.title = data.get('title') || '';
  state.email = data.get('email') || '';
  state.phone = data.get('phone') || '';
  state.location = data.get('location') || '';
  state.summary = data.get('summary') || '';
  state.experience = (data.get('experience') || '').split('\n').filter(Boolean);
  state.skills = (data.get('skills') || '').split(',').map((skill) => skill.trim()).filter(Boolean);
}

function fallbackOptimize(lines) {
  return lines.map((line) => {
    const trimmed = line.replace(/^[•\-\s]+/, '').trim();
    if (!trimmed) return '';
    if (/\d/.test(trimmed)) return trimmed;
    return `Delivered measurable impact by ${trimmed.charAt(0).toLowerCase()}${trimmed.slice(1)}`;
  }).filter(Boolean);
}

async function optimizeWithApi(lines) {
  const apiKey = document.getElementById('ai-key').value.trim();
  const endpointInput = document.getElementById('ai-endpoint').value.trim();
  const endpoint = endpointInput || 'https://openrouter.ai/api/v1/chat/completions';

  if (!apiKey) return fallbackOptimize(lines);

  const prompt = `Rewrite these resume bullets in concise, achievement-oriented style. Return JSON array of strings only. Bullets: ${JSON.stringify(lines)}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4
    })
  });

  if (!response.ok) {
    throw new Error(`API request failed (${response.status})`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '[]';
  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : fallbackOptimize(lines);
  } catch {
    return fallbackOptimize(lines);
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  collectFormData();
  renderResume();
  writeStatus('Preview updated.');
});

optimizeBtn.addEventListener('click', async () => {
  collectFormData();
  if (!state.experience.length) {
    writeStatus('Add at least one experience bullet first.');
    return;
  }

  writeStatus('Optimizing bullets with AI...');
  try {
    state.experience = await optimizeWithApi(state.experience);
    form.elements.experience.value = state.experience.join('\n');
    renderResume();
    writeStatus('Optimization complete.');
  } catch (error) {
    state.experience = fallbackOptimize(state.experience);
    form.elements.experience.value = state.experience.join('\n');
    renderResume();
    writeStatus(`API unavailable. Applied local optimization instead.`);
  }
});

function seedForm() {
  Object.entries({
    name: state.name,
    title: state.title,
    email: state.email,
    phone: state.phone,
    location: state.location,
    summary: state.summary,
    experience: state.experience.join('\n'),
    skills: state.skills.join(', ')
  }).forEach(([key, value]) => {
    form.elements[key].value = value;
  });
}

seedForm();
renderResume();
renderTemplates();
