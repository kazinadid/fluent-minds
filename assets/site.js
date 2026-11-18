'use strict';
document.documentElement.classList.add('js');
const mainNav = document.querySelector('body > nav');
if (mainNav) {
  mainNav.setAttribute('aria-label', 'Main navigation');
  const links = mainNav.querySelector('.nav-links');
  if (links) {
    links.id = 'main-navigation';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'menu-toggle';
    button.textContent = 'Menu';
    button.setAttribute('aria-controls', links.id);
    button.setAttribute('aria-expanded', 'false');
    mainNav.insertBefore(button, links);
    const close = () => {
      links.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
    };
    button.addEventListener('click', () => {
      button.setAttribute('aria-expanded', String(links.classList.toggle('is-open')));
    });
    mainNav.addEventListener('keydown', event => {
      if (event.key === 'Escape') { close(); button.focus(); }
    });
    links.querySelectorAll('a').forEach(link => {
      if (link.pathname === location.pathname || (location.pathname === '/' && link.pathname === '/index.html')) {
        link.setAttribute('aria-current', 'page');
      }
      link.addEventListener('click', close);
    });
  }
}
const normalise = text => text.toLocaleLowerCase().normalize('NFKC').trim();
const articleSearch = document.getElementById('article-search');
if (articleSearch) {
  const cards = [...document.querySelectorAll('#blogGrid .blog-card')];
  const buttons = [...document.querySelectorAll('[data-filter]')];
  const params = new URLSearchParams(location.search);
  let category = buttons.some(button => button.dataset.filter === params.get('topic')) ? params.get('topic') : 'all';
  articleSearch.value = params.get('q') || '';
  const update = () => {
    const terms = normalise(articleSearch.value).split(/\s+/).filter(Boolean);
    let count = 0;
    cards.forEach(card => {
      card.hidden = !((category === 'all' || card.dataset.cat === category) && terms.every(term => normalise(card.textContent).includes(term)));
      if (!card.hidden) count++;
    });
    buttons.forEach(button => {
      const active = button.dataset.filter === category;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    document.getElementById('article-count').textContent = `${count} of ${cards.length} articles and guides`;
    document.getElementById('article-empty').hidden = count > 0;
    const url = new URL(location.href);
    if (category !== 'all') url.searchParams.set('topic', category); else url.searchParams.delete('topic');
    if (articleSearch.value.trim()) url.searchParams.set('q', articleSearch.value.trim()); else url.searchParams.delete('q');
    history.replaceState(null, '', url);
  };
  buttons.forEach(button => button.addEventListener('click', () => { category = button.dataset.filter; update(); }));
  articleSearch.addEventListener('input', update);
  document.querySelector('[data-reset="articles"]').addEventListener('click', () => {
    category = 'all'; articleSearch.value = ''; update(); articleSearch.focus();
  });
  update();
}
const providerSearch = document.getElementById('therapy-search');
if (providerSearch) {
  const region = document.getElementById('therapy-region');
  const cards = [...document.querySelectorAll('.provider-card')];
  const update = () => {
    const terms = normalise(providerSearch.value).split(/\s+/).filter(Boolean);
    let count = 0;
    cards.forEach(card => {
      card.hidden = !((region.value === 'all' || region.value === card.dataset.region) && terms.every(term => normalise(card.textContent).includes(term)));
      if (!card.hidden) count++;
    });
    document.getElementById('provider-count').textContent = `${count} of ${cards.length} service locations / departments`;
    document.getElementById('provider-empty').hidden = count > 0;
  };
  providerSearch.addEventListener('input', update);
  region.addEventListener('change', update);
  document.querySelector('[data-reset="providers"]').addEventListener('click', () => {
    region.value = 'all'; providerSearch.value = ''; update(); providerSearch.focus();
  });
  update();
}
document.querySelectorAll('[data-print]').forEach(button => button.addEventListener('click', () => window.print()));
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const subject = new URLSearchParams(location.search).get('subject');
  const select = document.getElementById('subject');
  if (subject && [...select.options].some(option => option.value === subject)) select.value = subject;
  contactForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const button = contactForm.querySelector('[type=submit]');
    const message = document.getElementById('successMsg');
    button.disabled = true;
    button.textContent = 'Sending…';
    message.hidden = false;
    message.style.display = 'block';
    message.classList.remove('status-error');
    message.textContent = 'Sending your message…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch('/', {
        method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: new URLSearchParams(new FormData(contactForm)).toString(), signal: controller.signal
      });
      if (!response.ok) throw new Error('Submission failed');
      message.textContent = 'Thank you. Your message has been sent.';
      contactForm.reset();
    } catch (error) {
      message.classList.add('status-error');
      message.textContent = 'We could not confirm delivery. Your message is still here. Try again, or email nadid450hossain@gmail.com using the email link on this page.';
    } finally {
      clearTimeout(timeout);
      button.disabled = false;
      button.textContent = 'Send Message →';
    }
  });
}
const downloadPlan = document.getElementById('download-plan');
if (downloadPlan) {
  downloadPlan.addEventListener('click', () => {
    const goal = document.getElementById('practice-goal').value.trim();
    const status = document.getElementById('plan-status');
    if (!goal) { status.textContent = 'Write a small goal first.'; document.getElementById('practice-goal').focus(); return; }
    const blob = new Blob(['Fluent Minds | My speaking plan\n\nMy goal: '+goal+'\n\nWhat would help me feel supported?\n\nWhat did I communicate?\n\nOne thing I want to remember:\n'], {type:'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = 'my-speaking-plan.txt';
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = 'Your plan has been downloaded. Your goal stays in this browser tab only.';
  });
}
