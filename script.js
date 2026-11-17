const navButtons = document.querySelectorAll('.nav-item');
const panels = document.querySelectorAll('.page-panel');
const blogGrid = document.getElementById('blog-grid');

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

const yearNode = document.querySelector('[data-year]');
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const stripHtml = (html) => {
  const text = html.replace(/<[^>]*>/g, ' ');
  return text.replace(/\s+/g, ' ').trim();
};

const fallbackArticles = [
  {
    title: 'Building resilient local AI workflows',
    link: 'https://medium.com/@debanjanasarkar564',
    description: 'Practical ideas for local inference, orchestration, and high-trust automation workflows.',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Distributed systems design for real workloads',
    link: 'https://medium.com/@debanjanasarkar564',
    description: 'Patterns for load balancing, failover, and architecture decisions in high-availability systems.',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'From telecom networking to applied GenAI',
    link: 'https://medium.com/@debanjanasarkar564',
    description: 'How networking, backend systems, and AI tooling intersect in modern engineering work.',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80'
  }
];

const renderBlogCards = (articles) => {
  if (!blogGrid) return;

  blogGrid.innerHTML = articles
    .map((article) => {
      const title = article.title || 'Untitled article';
      const description = stripHtml(article.description || article.content || '');
      const thumbnail = article.thumbnail || article.enclosure?.link || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80';
      const date = article.pubDate ? new Date(article.pubDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) : 'Medium';

      return `
        <a class="blog-card" href="${article.link}" target="_blank" rel="noreferrer">
          <div class="blog-card-image" style="background-image:url('${thumbnail}')"></div>
          <div class="blog-card-body">
            <div class="blog-meta">${date}</div>
            <h3>${title}</h3>
            <p>${description.length > 140 ? description.slice(0, 140) + '…' : description}</p>
          </div>
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

    renderBlogCards(data.items.slice(0, 6));
  } catch (error) {
    renderBlogCards(fallbackArticles);
  }
};

loadMediumArticles();
