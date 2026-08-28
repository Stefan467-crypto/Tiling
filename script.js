document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     Footer year
  --------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     Header: solid once the page scrolls past the dark hero
  --------------------------------------------------------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------------------------------------------------------
     Mobile menu overlay
  --------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const menuClose = document.getElementById('menuClose');
  const mobileMenu = document.getElementById('mobileMenu');

  const openMenu = () => {
    mobileMenu.classList.add('open');
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-lock');
  };
  const closeMenu = () => {
    mobileMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-lock');
  };

  navToggle.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
  });
  menuClose.addEventListener('click', closeMenu);

  // Close on Escape, on any in-menu link tap, and if the viewport
  // grows back to desktop size while the menu is open.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
  });
  mobileMenu.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 760 && mobileMenu.classList.contains('open')) closeMenu();
  });

  /* ---------------------------------------------------------
     Scroll reveal for content blocks
  --------------------------------------------------------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 60}ms`;
    revealObserver.observe(el);
  });

  /* ---------------------------------------------------------
     Project placeholder grid — generated so every card stays
     identical and easy to swap for real photography later.
  --------------------------------------------------------- */
  const projectGrid = document.getElementById('projectGrid');
  if (projectGrid) {
    const placeholderIcon = `
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.4"/>
        <circle cx="8.5" cy="10" r="1.6" stroke="currentColor" stroke-width="1.4"/>
        <path d="M3 16.5l5-4.5 3.5 3 4-4L21 15" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 6; i++) {
      const card = document.createElement('div');
      card.className = 'photo-placeholder reveal';
      card.innerHTML = `<span class="ph-icon" aria-hidden="true">${placeholderIcon}</span><span class="ph-label">Photo placeholder</span>`;
      frag.appendChild(card);
    }
    projectGrid.appendChild(frag);
    projectGrid.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 60}ms`;
      revealObserver.observe(el);
    });
  }

  /* ---------------------------------------------------------
     Contact form
     ---------------------------------------------------------
     Submits in the background to popovstefan647@gmail.com and
     shows a plain success/error message on this page — the
     visitor never leaves the site and never sees which relay
     service delivers the email.
  --------------------------------------------------------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');
  const DESTINATION_EMAIL = 'popovstefan647@gmail.com';

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const phone = form.phone.value.trim();
      const message = form.message.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      status.classList.remove('success');

      if (!name || !message) {
        status.textContent = 'Please add your name and a short message.';
        return;
      }
      if (!emailPattern.test(email)) {
        status.textContent = 'Please enter a valid email address.';
        return;
      }

      submitBtn.disabled = true;
      status.textContent = 'Sending your message…';

      try {
        const res = await fetch(`https://formsubmit.co/ajax/${DESTINATION_EMAIL}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            phone,
            message,
            _subject: 'New enquiry from the Tiletech website'
          })
        });

        if (!res.ok) throw new Error('Request failed');

        status.textContent = `Thanks ${name.split(' ')[0]}, your message has been sent. We'll be in touch shortly.`;
        status.classList.add('success');
        form.reset();
      } catch (err) {
        status.textContent = `Something went wrong sending your message — please email us directly at ${DESTINATION_EMAIL}.`;
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

});

