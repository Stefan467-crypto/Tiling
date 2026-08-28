document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     Footer year
  --------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     Mobile nav toggle
  --------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  navToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open);
  });

  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------------------------------------------------------
     Scroll reveal for content blocks
  --------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 60}ms`;
    revealObserver.observe(el);
  });

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
