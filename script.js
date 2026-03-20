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

  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Ring follows with lag
  (function animRing() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  // Grow ring on interactive elements
  const interactives = 'a, button, .btn, .skill-card, .proj-card, .cert-card, .edu-card, .sc';
  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width       = '50px';
      ring.style.height      = '50px';
      ring.style.borderColor = 'var(--accent)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width       = '34px';
      ring.style.height      = '34px';
      ring.style.borderColor = 'rgba(0,200,255,.4)';
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

  let roleIndex = 0, charIndex = 0, deleting = false;
  const el = document.getElementById('typewriter');
  if (!el) return;

  function tick() {
    const current = roles[roleIndex];

    if (!deleting) {
      el.textContent = current.slice(0, ++charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
    } else {
      el.textContent = current.slice(0, --charIndex);
      if (charIndex === 0) {
        deleting    = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    setTimeout(tick, deleting ? 45 : 85);
  }

  tick();
})();


/* ════════════════════════
   SCROLL REVEAL
════════════════════════ */
(function initScrollReveal() {
  const selector = '.reveal, .reveal-left, .reveal-right, .stagger';
  const elements = document.querySelectorAll(selector);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
})();


/* ════════════════════════
   ACTIVE NAV HIGHLIGHT
════════════════════════ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function updateActive() {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 140) {
        current = section.id;
      }
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === '#' + current) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
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
  const links    = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  const isOpen   = links.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMenu() {
  const links    = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  links.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

// Close menu on outside click
document.addEventListener('click', e => {
  const navbar = document.getElementById('navbar');
  if (navbar && !navbar.contains(e.target)) closeMenu();
});

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});


/* ════════════════════════
   CONTACT FORM (Formspree AJAX)
════════════════════════ */
(function initContactForm() {
  const form   = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form || !status) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;
    btn.innerHTML  = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
    btn.disabled   = true;
    status.className = 'form-status';
    status.style.display = 'none';

    try {
      const res = await fetch(form.action, {
        method:  'POST',
        body:    new FormData(form),
        headers: { 'Accept': 'application/json' },
      });

      if (res.ok) {
        status.className    = 'form-status success';
        status.innerHTML    = '<i class="fa-solid fa-circle-check"></i> Message sent! I\'ll get back to you soon.';
        form.reset();
      } else {
        const data = await res.json();
        const msg  = data?.errors?.map(err => err.message).join(', ') || 'Submission failed.';
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
   CARD TILT EFFECT (subtle)
════════════════════════ */
(function initCardTilt() {
  const cards = document.querySelectorAll('.skill-card, .sc, .cert-card, .edu-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotX   = ((y - cy) / cy) * -4;
      const rotY   = ((x - cx) / cx) *  4;
      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-3px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
