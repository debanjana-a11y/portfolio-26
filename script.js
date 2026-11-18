const navButtons = document.querySelectorAll('.nav-item');
const panels = document.querySelectorAll('.page-panel');
const projectGrid = document.getElementById('project-grid');
const blogGrid = document.getElementById('blog-grid');

const personalProjects = [
  {
    title: 'Hyper-Local AQI & PM2.5 Forecasting Engine (Kolkata)',
    tag: 'Training from Scratch',
    type: 'ML Model',
    summary: 'A hyper-local AQI and PM2.5 forecasting engine that reduces street-level error by 90.1% compared with Open-Meteo\'s raw regional model.',
    link: 'https://github.com/debanjana-a11y/AQI-predictor'
  },
  {
    title: 'Nemotron-ATS-War-Room',
    tag: 'LLM',
    type: 'AI APP',
    summary: 'Resume analysis and job-description alignment pipeline powered by structured retrieval and LLM reasoning.',
    link: 'https://github.com/debanjana-a11y/Nemotron-ATS-War-Room'
  },
  {
    title: 'job-application-tracker',
    tag: 'AUTOMATION',
    type: 'WORKFLOW',
    summary: 'A local parsing pipeline using Node.js, FastAPI, and Ollama to organize recruiters, feedback, and applications.',
    link: 'https://github.com/debanjana-a11y/job-application-tracker'
  },
  {
    title: 'TodoList',
    tag: 'PRODUCTIVITY',
    type: 'TOOL',
    summary: 'A simple daily note-taking and task manager focused on personal planning and momentum.',
    link: 'https://github.com/debanjana-a11y/TodoList'
  },
  {
    title: 'ToPhonetic',
    tag: 'LANGUAGE',
    type: 'UTIL',
    summary: 'A tiny utility that converts English words into IPA-style phonetic output.',
    link: 'https://github.com/debanjana-a11y/tophonetics'
  }
];

const setActivePanel = (sectionId) => {
  navButtons.forEach((button) => {
    const isActive = button.dataset.section === sectionId;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  panels.forEach((panel) => {
    panel.classList.toggle('active', panel.id === sectionId);
  });
};

navButtons.forEach((button) => {
  button.addEventListener('click', () => setActivePanel(button.dataset.section));
});

const stripHtml = (html) => {
  const text = (html || '').replace(/<[^>]*>/g, ' ');
  return text.replace(/\s+/g, ' ').trim();
};

const renderProjects = (items) => {
  if (!projectGrid) return;

  projectGrid.innerHTML = items
    .map((project, index) => {
      const title = project.title || 'Untitled project';
      const tag = project.tag || 'PROJECT';
      const type = project.type || 'PERSONAL';
      const summary = project.summary || '';
      const link = project.link || '#';
      const toneClass = `tone-${(index % 4) + 1}`;

      return `
        <a class="project-card" href="${link}" target="_blank" rel="noreferrer">
          <div class="project-visual ${toneClass}">
            <span class="project-tag">${tag}</span>
            <h3>${title}</h3>
          </div>
          <div class="project-content">
            <div class="project-meta">${type}</div>
            <p>${summary}</p>
          </div>
        </a>
      `;
    })
    .join('');
};

const fallbackArticles = [
  {
    title: 'Building resilient local AI workflows',
    link: 'https://medium.com/@debanjanasarkar564',
    description: 'Practical ideas for local inference, orchestration, and high-trust automation workflows.'
  },
  {
    title: 'Distributed systems design for real workloads',
    link: 'https://medium.com/@debanjanasarkar564',
    description: 'Patterns for load balancing, failover, and architecture decisions in high-availability systems.'
  },
  {
    title: 'From telecom networking to applied GenAI',
    link: 'https://medium.com/@debanjanasarkar564',
    description: 'How networking, backend systems, and AI tooling intersect in modern engineering work.'
  }
];

const renderBlogCards = (articles) => {
  if (!blogGrid) return;

  blogGrid.innerHTML = articles
    .map((article) => {
      const title = article.title || 'Untitled article';
      const description = stripHtml(article.description || article.content || '');
      const date = article.pubDate
        ? new Date(article.pubDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })
        : 'Medium';

      return `
        <a class="blog-card" href="${article.link}" target="_blank" rel="noreferrer">
          <div class="blog-card-header">
            <div class="blog-meta">${date}</div>
            <h3>${title}</h3>
          </div>
          <p>${description.length > 140 ? description.slice(0, 140) + '…' : description}</p>
        </a>
      `;
    })
    .join('');
};

const loadMediumArticles = async () => {
  if (!blogGrid) return;

  const feedUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@debanjanasarkar564';

  try {
    const response = await fetch(feedUrl);
    const data = await response.json();

    if (data.status !== 'ok' || !Array.isArray(data.items) || data.items.length === 0) {
      throw new Error('No Medium articles found');
    }

    renderBlogCards(data.items);
  } catch (error) {
    renderBlogCards(fallbackArticles);
  }
};

renderProjects(personalProjects);
loadMediumArticles();
