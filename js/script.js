/* ════════════════════════════════════════════════
   script.js — Bibash Basnet Portfolio
════════════════════════════════════════════════ */

/* ════════════════════════
   CUSTOM CURSOR
════════════════════════ */
(function initCursor() {
  const dot  = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  const hoverEls = 'a, button, .btn, .skill-card, .proj-card, .cert-card, .edu-card, .sc, .crow, .cd-row, .tl-item';
  document.querySelectorAll(hoverEls).forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width       = '48px';
      ring.style.height      = '48px';
      ring.style.borderColor = 'rgba(0,200,255,.7)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width       = '32px';
      ring.style.height      = '32px';
      ring.style.borderColor = 'rgba(0,200,255,.45)';
    });
  });
})();


/* ════════════════════════
   TYPEWRITER
════════════════════════ */
(function initTypewriter() {
  const roles = [
    'Network Security Engineer',
    'IT Professional',
    'SIEM · Splunk Analyst',
    'Certified Cybersecurity Analyst',
    'Network & Security Enthusiast',
  ];

  let ri = 0, ci = 0, deleting = false;
  const el = document.getElementById('typewriter');
  if (!el) return;

  // remove the CSS ::after cursor since JS controls content
  el.style.cssText = 'min-height:1.4em';

  function tick() {
    const s = roles[ri];
    if (!deleting) {
      el.textContent = s.slice(0, ++ci);
      if (ci === s.length) { deleting = true; setTimeout(tick, 1800); return; }
    } else {
      el.textContent = s.slice(0, --ci);
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
    }
    setTimeout(tick, deleting ? 42 : 82);
  }
  tick();
})();


/* ════════════════════════
   SCROLL REVEAL
════════════════════════ */
(function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger');
  const io  = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
})();


/* ════════════════════════
   NAVBAR: SHRINK ON SCROLL + ACTIVE LINK
════════════════════════ */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function onScroll() {
    // shrink navbar
    navbar.classList.toggle('scrolled', window.scrollY > 60);

    // active link
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 140) current = s.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ════════════════════════
   SCROLL-TO-TOP BUTTON
════════════════════════ */
(function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });
})();


/* ════════════════════════
   MOBILE NAV
════════════════════════ */
function toggleMenu() {
  const links     = document.getElementById('navLinks');
  const ham       = document.getElementById('hamburger');
  const isOpen    = links.classList.toggle('open');
  ham.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMenu() {
  const links = document.getElementById('navLinks');
  const ham   = document.getElementById('hamburger');
  links.classList.remove('open');
  ham.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

document.addEventListener('click', e => {
  const navbar = document.getElementById('navbar');
  if (navbar && !navbar.contains(e.target)) closeMenu();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });


/* ════════════════════════
   CONTACT FORM (Formspree AJAX)
════════════════════════ */
(function initContactForm() {
  const form   = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form || !status) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn          = form.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
    btn.disabled  = true;
    status.className   = 'form-status';
    status.style.display = 'none';

    try {
      const res = await fetch(form.action, {
        method: 'POST', body: new FormData(form),
        headers: { 'Accept': 'application/json' },
      });
      if (res.ok) {
        status.className = 'form-status success';
        status.innerHTML = '<i class="fa-solid fa-circle-check"></i> Message sent! I\'ll get back to you soon.';
        form.reset();
      } else {
        const d   = await res.json();
        const msg = d?.errors?.map(x => x.message).join(', ') || 'Submission failed.';
        throw new Error(msg);
      }
    } catch (err) {
      status.className = 'form-status error';
      status.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> ' +
        (err.message || 'Something went wrong. Please email me directly.');
    }

    btn.innerHTML = originalHTML;
    btn.disabled  = false;
  });
})();


/* ════════════════════════
   SUBTLE CARD TILT
════════════════════════ */
(function initCardTilt() {
  const cards = document.querySelectorAll('.skill-card, .sc, .cert-card, .edu-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = e.clientX - left, y = e.clientY - top;
      const rx = ((y - height / 2) / height) * -5;
      const ry = ((x - width  / 2) / width)  *  5;
      card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();


/* ════════════════════════
   SKILL TAG RIPPLE
════════════════════════ */
(function initTagRipple() {
  document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', e => {
      const r    = document.createElement('span');
      const rect = tag.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      r.style.cssText = `
        position:absolute; border-radius:50%;
        width:${size}px; height:${size}px;
        left:${e.clientX - rect.left - size/2}px;
        top:${e.clientY - rect.top  - size/2}px;
        background:rgba(0,200,255,.25);
        transform:scale(0); animation:ripple .5s ease-out forwards;
        pointer-events:none;
      `;
      tag.style.position = 'relative';
      tag.style.overflow = 'hidden';
      tag.appendChild(r);
      setTimeout(() => r.remove(), 500);
    });
  });

  // inject ripple keyframe once
  if (!document.getElementById('ripple-style')) {
    const s = document.createElement('style');
    s.id = 'ripple-style';
    s.textContent = '@keyframes ripple { to { transform:scale(2.5); opacity:0; } }';
    document.head.appendChild(s);
  }
})();


/* ════════════════════════
   COUNTER ANIMATION
════════════════════════ */
(function initCounters() {
  const counters = document.querySelectorAll('.sc-num');

  const parse = str => {
    const clean = str.replace(/[^0-9.]/g, '');
    return parseFloat(clean) || 0;
  };
  const suffix = str => str.replace(/[0-9.]/g, '');

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = parse(el.textContent);
      const suf    = suffix(el.textContent);
      const dur    = 1400;
      const start  = performance.now();

      (function step(now) {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const val  = target * ease;
        el.textContent = (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suf;
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());

      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => io.observe(c));
})();