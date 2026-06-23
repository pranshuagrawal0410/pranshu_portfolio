/* ===================================================
   PRANSHU AGRAWAL PORTFOLIO — main.js
   Shared across all pages
   =================================================== */

"use strict";

/* ---- 1. Theme toggle ---- */
(function initTheme() {
  const root = document.documentElement;
  const btn  = document.querySelector('[data-theme-toggle]');
  if (!btn) return;

  // Detect system preference
  let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);

  const icons = { dark: 'bi-sun', light: 'bi-moon-stars-fill' };
  const labels = { dark: 'Switch to light mode', light: 'Switch to dark mode' };

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    btn.innerHTML = `<i class="bi ${icons[t]}"></i>`;
    btn.setAttribute('aria-label', labels[t]);
    theme = t;
  }
  applyTheme(theme);

  btn.addEventListener('click', () => {
    applyTheme(theme === 'dark' ? 'light' : 'dark');
  });
})();


/* ---- 2. Smooth scroll for all anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Close Bootstrap mobile nav if open
    const navCollapse = document.querySelector('.navbar-collapse.show');
    if (navCollapse) {
      const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
      if (bsCollapse) bsCollapse.hide();
    }
  });
});


/* ---- 3. Active nav link scroll spy (home page only) ---- */
(function initScrollSpy() {
  const sections  = document.querySelectorAll('main [id]');
  const navLinks  = document.querySelectorAll('.navbar-nav .nav-link');
  if (!sections.length || !navLinks.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(s => io.observe(s));
})();


/* ---- 4. Animated metric counters ---- */
(function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const end = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '+';
      let current = 0;
      const duration = 1200;
      const steps = 50;
      const increment = Math.ceil(end / steps);
      const interval = Math.floor(duration / steps);

      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          current = end;
          clearInterval(timer);
        }
        el.textContent = current.toLocaleString() + suffix;
      }, interval);

      obs.unobserve(el);
    });
  }, { threshold: 0.7 });

  els.forEach(el => io.observe(el));
})();


/* ---- 5. Skill bar fill on scroll ---- */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');
  if (!bars.length) return;

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.level;
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => io.observe(bar));
})();


/* ---- 6. Enquiry form — Web3Forms integration ---- */
(function initForm() {
  const form = document.getElementById('enquiry-form');
  if (!form) return;

  const msgEl  = document.getElementById('form-msg');
  const btnEl  = form.querySelector('[type="submit"]');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Basic client-side validation
    const name    = form.querySelector('#f-name').value.trim();
    const email   = form.querySelector('#f-email').value.trim();
    const message = form.querySelector('#f-message').value.trim();
    if (!name || !email || !message) {
      showMsg('Please fill in all required fields.', 'error');
      return;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      showMsg('Please enter a valid email address.', 'error');
      return;
    }

    btnEl.disabled = true;
    btnEl.textContent = 'Sending…';

    const data = new FormData(form);

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      });
      const json = await res.json();
      if (json.success) {
        showMsg('Message sent! Pranshu will respond within 24 hours.', 'success');
        form.reset();
      } else {
        throw new Error(json.message || 'Submission failed');
      }
    } catch (err) {
      showMsg('Something went wrong. Please email directly at Pranshuagr176@gmail.com', 'error');
    } finally {
      btnEl.disabled = false;
      btnEl.textContent = 'Send message';
    }
  });

  function showMsg(text, type) {
    if (!msgEl) return;
    msgEl.textContent = text;
    msgEl.className = 'form-msg ' + type;
    msgEl.style.display = 'block';
    msgEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setTimeout(() => { msgEl.style.display = 'none'; }, 7000);
  }
})();


/* ---- 7. Project card filter (projects.html) ---- */
(function initFilter() {
  const filterBtns = document.querySelectorAll('[data-filter]');
  const cards      = document.querySelectorAll('[data-category]');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('btn-swiss'));
      filterBtns.forEach(b => b.classList.add('btn-outline-swiss'));
      btn.classList.remove('btn-outline-swiss');
      btn.classList.add('btn-swiss');

      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.category.includes(filter);
        card.style.display = show ? '' : 'none';
      });
    });
  });
})();
document.addEventListener("DOMContentLoaded", function () {
  const navCollapse = document.getElementById("mainNav");
  if (!navCollapse) return;

  const bsCollapse = new bootstrap.Collapse(navCollapse, {
    toggle: false
  });

  const navLinks = navCollapse.querySelectorAll(".nav-link");

  navLinks.forEach(link => {
    link.addEventListener("click", function () {
      if (window.innerWidth < 992) {
        bsCollapse.hide();
      }
    });
  });
});
