/**
 * Burwood Mechanics & Transmission — main.js
 * Minimal, production-ready vanilla JavaScript
 */

(function () {
  'use strict';

  /* ---- STICKY HEADER ---- */
  (function initStickyHeader() {
    const header = document.getElementById('site-header');
    if (!header) return;

    function onScroll() {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();


  /* ---- MOBILE NAVIGATION ---- */
  (function initMobileNav() {
    const btn = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('main-nav');
    if (!btn || !nav) return;

    function close() {
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Open navigation menu');
      nav.classList.remove('open');
    }

    btn.addEventListener('click', function () {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        close();
      } else {
        btn.setAttribute('aria-expanded', 'true');
        btn.setAttribute('aria-label', 'Close navigation menu');
        nav.classList.add('open');
      }
    });

    // Close on nav link click
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', close);
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!btn.contains(e.target) && !nav.contains(e.target)) {
        close();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  })();


  /* ---- SMOOTH SCROLL (hash links) ---- */
  (function initSmoothScroll() {
    const headerHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '68',
      10
    );

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = anchor.getAttribute('href').slice(1);
        if (!targetId) return;
        const target = document.getElementById(targetId);
        if (!target) return;

        e.preventDefault();

        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });

        // Update focus for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    });
  })();


  /* ---- SCROLL REVEAL ---- */
  (function initScrollReveal() {
    const elements = document.querySelectorAll(
      '.service-card, .vehicle-card, .why-item, .testimonial-card, ' +
      '.trust-item, .location-block, .why-us-media, .about-media, .about-content'
    );

    if (!elements.length) return;

    // Stagger children within parent grids
    document.querySelectorAll(
      '.services-grid, .vehicles-grid, .testimonials-grid, .why-grid'
    ).forEach(function (grid) {
      Array.from(grid.children).forEach(function (child, i) {
        child.classList.add('reveal');
        if (i > 0) {
          child.classList.add('reveal-delay-' + Math.min(i, 3));
        }
      });
    });

    // Add reveal class to standalone elements
    ['.why-us-media', '.about-media', '.about-content', '.location-info', '.contact-info'].forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.classList.add('reveal');
      });
    });

    function checkReveal() {
      const all = document.querySelectorAll('.reveal:not(.visible)');
      all.forEach(function (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 60) {
          el.classList.add('visible');
        }
      });
    }

    // Use IntersectionObserver if available
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
      );

      document.querySelectorAll('.reveal').forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // Fallback
      window.addEventListener('scroll', checkReveal, { passive: true });
      checkReveal();
    }
  })();


  /* ---- CONTACT FORM VALIDATION ---- */
  (function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const fields = {
      fname:    { el: document.getElementById('fname'),    error: document.getElementById('fname-error'),    validate: validateName },
      fphone:   { el: document.getElementById('fphone'),   error: document.getElementById('fphone-error'),   validate: validatePhone },
      femail:   { el: document.getElementById('femail'),   error: document.getElementById('femail-error'),   validate: validateEmail },
      fmessage: { el: document.getElementById('fmessage'), error: document.getElementById('fmessage-error'), validate: validateMessage },
    };

    function validateName(val) {
      if (!val.trim()) return 'Please enter your full name.';
      if (val.trim().length < 2) return 'Name must be at least 2 characters.';
      return '';
    }

    function validatePhone(val) {
      const cleaned = val.replace(/\s/g, '');
      if (!cleaned) return 'Please enter your phone number.';
      if (!/^(\+?61|0)[2-9]\d{8}$/.test(cleaned) && !/^04\d{8}$/.test(cleaned) && cleaned.length < 8) {
        return 'Please enter a valid Australian phone number.';
      }
      return '';
    }

    function validateEmail(val) {
      if (!val.trim()) return 'Please enter your email address.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) return 'Please enter a valid email address.';
      return '';
    }

    function validateMessage(val) {
      if (!val.trim()) return 'Please describe your enquiry or the service you need.';
      if (val.trim().length < 10) return 'Please provide a bit more detail (at least 10 characters).';
      return '';
    }

    function showError(field, msg) {
      if (!field.el || !field.error) return;
      field.error.textContent = msg;
      if (msg) {
        field.el.classList.add('is-error');
        field.el.setAttribute('aria-invalid', 'true');
      } else {
        field.el.classList.remove('is-error');
        field.el.removeAttribute('aria-invalid');
      }
    }

    function validateField(key) {
      const field = fields[key];
      if (!field || !field.el) return true;
      const msg = field.validate(field.el.value);
      showError(field, msg);
      return !msg;
    }

    // Live validation on blur
    Object.keys(fields).forEach(function (key) {
      const field = fields[key];
      if (!field.el) return;
      field.el.addEventListener('blur', function () {
        validateField(key);
      });
      field.el.addEventListener('input', function () {
        if (field.el.classList.contains('is-error')) {
          const msg = field.validate(field.el.value);
          showError(field, msg);
        }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      let valid = true;
      Object.keys(fields).forEach(function (key) {
        if (!validateField(key)) valid = false;
      });

      if (!valid) {
        // Focus first error field
        const firstError = form.querySelector('.is-error');
        if (firstError) firstError.focus();
        return;
      }

      // Simulate successful submission
      const btn = document.getElementById('form-submit');
      const success = document.getElementById('form-success');

      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Sending...';
      }

      // In production: replace with actual fetch/XHR to your backend
      setTimeout(function () {
        form.reset();
        Object.keys(fields).forEach(function (key) {
          showError(fields[key], '');
        });

        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Send Enquiry';
          btn.style.display = 'none';
        }

        if (success) {
          success.hidden = false;
          success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 900);
    });
  })();


  /* ---- ACTIVE NAV HIGHLIGHT (scroll spy) ---- */
  (function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    const headerHeight = 80;

    function onScroll() {
      let current = '';
      sections.forEach(function (section) {
        const top = section.getBoundingClientRect().top;
        if (top <= headerHeight + 40) {
          current = section.id;
        }
      });

      navLinks.forEach(function (link) {
        link.removeAttribute('aria-current');
        const href = link.getAttribute('href').slice(1);
        if (href === current) {
          link.setAttribute('aria-current', 'page');
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  })();


  /* ---- PHONE CTA PULSE (subtle attention) ---- */
  (function initPhonePulse() {
    const phone = document.querySelector('.header-phone');
    if (!phone) return;

    // Add subtle pulse after 8 seconds if user hasn't scrolled past hero
    setTimeout(function () {
      if (window.scrollY < 300) {
        phone.style.transition = 'color 0.3s ease';
        phone.style.color = 'var(--red)';
        setTimeout(function () {
          phone.style.color = '';
        }, 1200);
      }
    }, 8000);
  })();

})();
