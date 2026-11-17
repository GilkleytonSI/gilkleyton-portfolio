'use strict';

const projects = {
  catalogo: {
    name: 'PrimeCatálogo', kicker: 'CATÁLOGO DIGITAL / PROJETO AUTORAL', color: '#c1d7bb',
    lead: 'Uma forma de apresentar produtos e transformar a escolha do cliente em um pedido pelo WhatsApp.',
    tags: ['PHP', 'MySQL', 'MVC', 'JavaScript', 'Catálogo digital'],
    purpose: 'Reunir o catálogo, a organização dos produtos e o fluxo de pedido em uma experiência acessível para o negócio e para o cliente.',
    features: ['Página pública da empresa com categorias e produtos.', 'Produtos com imagens, preços, variações e controle de estoque.', 'Carrinho e envio dos dados do pedido pelo WhatsApp.', 'Painel de clientes e pedidos, com acompanhamento de status.', 'Administração de planos, assinaturas manuais e faturas.'],
    technical: 'O projeto explora PHP orientado a objetos, organização MVC e acesso ao MySQL com PDO. A separação entre catálogo público e painel administrativo ajuda a organizar os fluxos de cada perfil.'
  },
  quiz: {
    name: 'Reino Quiz', kicker: 'APRENDIZADO & COMUNIDADE / PROJETO AUTORAL', color: '#b9a5da',
    lead: 'Uma plataforma cristã gratuita para aprender, criar quizzes e participar de desafios em comunidade.',
    tags: ['PHP', 'MySQL', 'Quizzes', 'Gamificação', 'Plataforma gratuita'],
    purpose: 'Conectar conhecimento bíblico e tecnologia em uma experiência participativa, com espaço para jogadores, criadores, líderes e administradores.',
    features: ['Criação de quizzes com perguntas, referências e explicações bíblicas.', 'Revisão, moderação e publicação de conteúdo.', 'Resultados, histórico, rankings, níveis e conquistas.', 'Equipes, turmas, convites e acompanhamento de participação.', 'Desafios de sobrevivência, contra o tempo, jornada pelos livros e campeonatos.', 'Eventos, comunicados e central de notificações.'],
    technical: 'O desafio está em conectar diferentes perfis e permissões ao fluxo de criação e participação. A organização do projeto contempla tentativas, correção de respostas, progresso e moderação.'
  },
  linkorbit: {
    name: 'Linkorbit', kicker: 'PRESENÇA DIGITAL / PROJETO AUTORAL', color: '#e6d8bb',
    lead: 'Uma página personalizável para conectar links, conteúdos e serviços em um único endereço.',
    tags: ['PHP', 'MySQL', 'Personalização', 'Estatísticas', 'Links'],
    purpose: 'Facilitar a apresentação de uma presença digital, dando ao usuário controle sobre a aparência, os conteúdos e a organização de sua página.',
    features: ['Perfil com avatar, capa, bio, localização, temas e cores.', 'Links, vídeos e serviços com ordenação e ativação.', 'Agendamento de conteúdos.', 'Estatísticas de visualizações e cliques, com filtros.', 'Planos com recursos e limites por perfil.', 'Administração de assinaturas manuais e faturas.'],
    technical: 'O projeto combina a página pública com um painel de configuração e acompanhamento. O cuidado com a interface móvel acompanha a lógica de conteúdo, personalização e análise de acessos.'
  }
};

const languages = window.PortfolioLanguages;
const languageStorageKey = 'gilkleyton-portfolio-language';
const languageSelect = document.querySelector('#site-language');
let currentLanguage = 'pt';
let copyFeedbackKey = '';

function initialLanguage() {
  const requested = new URLSearchParams(window.location.search).get('lang');
  if (Object.hasOwn(languages, requested)) return requested;
  try {
    const saved = window.localStorage.getItem(languageStorageKey);
    if (Object.hasOwn(languages, saved)) return saved;
  } catch { /* The site still works when browser storage is unavailable. */ }
  return 'pt';
}

function translate(key, values = {}) {
  let text = languages[currentLanguage].messages[key] ?? languages.pt.messages[key] ?? key;
  Object.entries(values).forEach(([name, value]) => { text = text.replaceAll(`{${name}}`, String(value)); });
  return text;
}

function updateFilterStatus() {
  const count = Array.from(cards).filter(card => !card.hidden).length;
  document.querySelector('#filter-status').textContent = translate(count === 1 ? 'filterOne' : 'filterMany', {count});
}

function applyLanguage(language, {persist = false, updateUrl = false, announce = false} = {}) {
  currentLanguage = Object.hasOwn(languages, language) ? language : 'pt';
  const locale = languages[currentLanguage];
  document.documentElement.lang = locale.locale;
  languageSelect.value = currentLanguage;
  document.querySelectorAll('[data-i18n]').forEach(element => {
    element.textContent = translate(element.dataset.i18n);
  });
  // HTML translations are trusted, fixed strings that preserve the original inline formatting.
  document.querySelectorAll('[data-i18n-html]').forEach(element => {
    element.innerHTML = translate(element.dataset.i18nHtml);
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(element => {
    element.setAttribute('aria-label', translate(element.dataset.i18nAria));
  });
  menuToggle.setAttribute('aria-label', translate(menuToggle.getAttribute('aria-expanded') === 'true' ? 'menuClose' : 'menuOpen'));
  document.title = translate('metaTitle');
  document.querySelector('meta[name="description"]').content = translate('metaDescription');
  document.querySelector('meta[property="og:title"]').content = translate('ogTitle');
  document.querySelector('meta[property="og:description"]').content = translate('ogDescription');
  document.querySelector('meta[property="og:locale"]').content = locale.ogLocale;
  const structuredData = document.querySelector('script[type="application/ld+json"]');
  const person = JSON.parse(structuredData.textContent);
  person.jobTitle = translate('jobTitle');
  person.knowsAbout = ['PHP', 'MySQL', 'JavaScript', translate('webDevelopment')];
  structuredData.textContent = JSON.stringify(person);
  document.querySelector('#contato .button').href = `mailto:gilkleyton.dev@gmail.com?subject=${encodeURIComponent(translate('mailSubject'))}`;
  if (document.querySelector('#filter-status').textContent) updateFilterStatus();
  if (copyFeedbackKey) copyFeedback.textContent = translate(copyFeedbackKey);
  if (dialog.open) populateProject(currentProject);
  if (persist) {
    try { window.localStorage.setItem(languageStorageKey, currentLanguage); } catch { /* Optional preference storage. */ }
  }
  if (updateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set('lang', currentLanguage);
    window.history.replaceState(null, '', url);
  }
  if (announce) document.querySelector('#language-status').textContent = translate('languageChanged');
}

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
function closeMenu() {
  nav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', translate('menuOpen'));
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  nav.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', translate(open ? 'menuClose' : 'menuOpen'));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('is-open')) {
    closeMenu();
    menuToggle.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
const desktopMedia = window.matchMedia('(min-width: 861px)');
desktopMedia.addEventListener('change', event => { if (event.matches) closeMenu(); });

const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.project-card');
filters.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filters.forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  cards.forEach(card => {
    const visible = filter === 'all' || card.dataset.category === filter;
    card.hidden = !visible;
  });
  updateFilterStatus();
}));

const dialog = document.querySelector('#project-dialog');
const projectKeys = Object.keys(projects);
let currentProject = 'catalogo';
let dialogTrigger = null;
function populateProject(key) {
  if (!Object.hasOwn(projects, key)) return;
  const project = {...projects[key], ...languages[currentLanguage].projects[key]};
  currentProject = key;
  document.querySelector('#dialog-title').textContent = project.name;
  document.querySelector('#dialog-kicker').textContent = project.kicker;
  document.querySelector('#dialog-colorbar').style.backgroundColor = project.color;
  document.querySelector('#dialog-lead').textContent = project.lead;
  document.querySelector('#dialog-purpose').textContent = project.purpose;
  document.querySelector('#dialog-technical').textContent = project.technical;
  const tags = document.querySelector('#dialog-tags');
  tags.replaceChildren(...project.tags.map(tag => {
    const span = document.createElement('span');
    span.textContent = tag;
    return span;
  }));
  const features = document.querySelector('#dialog-features');
  features.replaceChildren(...project.features.map(feature => {
    const li = document.createElement('li');
    li.textContent = feature;
    return li;
  }));
  dialog.scrollTop = 0;
}
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  dialogTrigger = button;
  populateProject(button.dataset.project);
  document.body.classList.add('modal-open');
  dialog.showModal();
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  if (dialogTrigger) dialogTrigger.focus({preventScroll:true});
});
document.querySelector('.dialog-prev').addEventListener('click', () => {
  populateProject(projectKeys[(projectKeys.indexOf(currentProject) - 1 + projectKeys.length) % projectKeys.length]);
});
document.querySelector('.dialog-next').addEventListener('click', () => {
  populateProject(projectKeys[(projectKeys.indexOf(currentProject) + 1) % projectKeys.length]);
});
document.querySelector('#dialog-contact').addEventListener('click', event => {
  event.preventDefault();
  dialog.close();
  document.querySelector('#contato').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  const url = new URL(window.location.href);
  url.hash = 'contato';
  window.history.replaceState(null, '', url);
  document.querySelector('#contato .button').focus({preventScroll:true});
});

const emailButton = document.querySelector('#copy-email');
const copyFeedback = document.querySelector('#copy-feedback');
let feedbackTimer;
emailButton.addEventListener('click', async () => {
  const email = 'gilkleyton.dev@gmail.com';
  clearTimeout(feedbackTimer);
  try {
    if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(email);
    copyFeedbackKey = 'copySuccess';
  } catch {
    const range = document.createRange();
    range.selectNodeContents(emailButton.querySelector('span'));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    copyFeedbackKey = 'copyFallback';
  }
  copyFeedback.textContent = translate(copyFeedbackKey);
  feedbackTimer = window.setTimeout(() => { copyFeedback.textContent = ''; copyFeedbackKey = ''; }, 7000);
});

document.querySelector('#year').textContent = new Date().getFullYear();
languageSelect.addEventListener('change', () => {
  applyLanguage(languageSelect.value, {persist:true, updateUrl:true, announce:true});
});
applyLanguage(initialLanguage());
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      nav.querySelectorAll('a').forEach(link => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, {rootMargin:'-15% 0px -65% 0px', threshold:0});
  document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
}
