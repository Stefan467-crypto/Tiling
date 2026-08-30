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
  const toTopBtn = document.getElementById('toTop');

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (toTopBtn) {
    toTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------------------------------------------------------
     Keep --header-h in sync with the header's real rendered
     height, so the hero/sections never sit underneath it even
     if the brand text wraps on a narrow screen.
  --------------------------------------------------------- */
  const syncHeaderHeight = () => {
    if (!header) return;
    document.documentElement.style.setProperty('--header-h', `${header.offsetHeight}px`);
  };
  syncHeaderHeight();
  window.addEventListener('resize', syncHeaderHeight);
  window.addEventListener('load', syncHeaderHeight);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncHeaderHeight);
  }
  if (window.ResizeObserver && header) {
    new ResizeObserver(syncHeaderHeight).observe(header);
  }

  /* ---------------------------------------------------------
     Mobile menu — side drawer
  --------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const menuClose = document.getElementById('menuClose');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuBackdrop = document.getElementById('menuBackdrop');

  const openMenu = () => {
    mobileMenu.classList.add('open');
    menuBackdrop.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-lock');
  };
  const closeMenu = () => {
    mobileMenu.classList.remove('open');
    menuBackdrop.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-lock');
  };

  navToggle.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
  });
  menuClose.addEventListener('click', closeMenu);
  menuBackdrop.addEventListener('click', closeMenu);

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
     Contact form
     ---------------------------------------------------------
     Submits in the background to tiletechltd1@gmail.com and
     shows a plain success/error message on this page — the
     visitor never leaves the site and never sees which relay
     service delivers the email.
  --------------------------------------------------------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');
  const DESTINATION_EMAIL = 'tiletechltd1@gmail.com';

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