(function () {
  'use strict';

  /* ---------- Défilement fluide (ancres) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      e.preventDefault();
      var target = document.querySelector(targetId);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      var nav = document.querySelector('.hero-nav');
      if (nav) nav.classList.remove('is-open');
    });
  });

  /* ---------- Menu mobile (hamburger) ---------- */
  var heroNavToggle = document.getElementById('hero-nav-toggle');
  var heroNav = document.querySelector('.hero-nav');
  if (heroNavToggle && heroNav) {
    heroNavToggle.addEventListener('click', function () {
      var open = heroNav.classList.toggle('is-open');
      heroNavToggle.setAttribute('aria-expanded', open);
      heroNavToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }

  /* Fermeture du menu au clic sur un lien */
  var heroNavLinks = document.querySelectorAll('.hero-nav-menu a');
  heroNavLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      heroNav.classList.remove('is-open');
      heroNavToggle.setAttribute('aria-expanded', 'false');
      heroNavToggle.setAttribute('aria-label', 'Ouvrir le menu');
      document.body.style.overflow = '';
    });
  });

  /* ---------- Barre de navigation (fond au scroll) ---------- */
  function updateHeroNavBackground() {
    if (!heroNav) return;
    if (window.scrollY > 0) {
      heroNav.classList.add('is-scrolled');
    } else {
      heroNav.classList.remove('is-scrolled');
    }
  }
  window.addEventListener('scroll', updateHeroNavBackground, { passive: true });
  window.addEventListener('resize', updateHeroNavBackground);
  updateHeroNavBackground();

  /* ---------- Révélation des sections au scroll ---------- */
  var sections = document.querySelectorAll('section');
  var options = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, options);

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* ---------- Bouton « Retour en haut » ---------- */
  var backToTop = document.getElementById('back-to-top');
  var aboutSection = document.getElementById('about');

  function updateBackToTop() {
    if (!backToTop || !aboutSection) return;
    var rect = aboutSection.getBoundingClientRect();
    if (rect.top <= 0) {
      backToTop.classList.add('is-visible');
    } else {
      backToTop.classList.remove('is-visible');
    }
  }

  window.addEventListener('scroll', updateBackToTop, { passive: true });
  window.addEventListener('resize', updateBackToTop);
  updateBackToTop();

  if (backToTop) {
    backToTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Carousel « The Space » ---------- */
  var carousel = document.getElementById('space-carousel');
  var track = carousel ? carousel.querySelector('.space-carousel-track') : null;
  var slides = carousel ? carousel.querySelectorAll('.space-carousel-slide') : [];
  var dotsContainer = document.getElementById('space-carousel-dots');
  var dots = dotsContainer ? dotsContainer.querySelectorAll('.space-carousel-dot') : [];
  var currentIndex = 0;
  var totalSlides = slides.length;
  var autoTimer = null;
  var AUTO_INTERVAL = 3000;

  function goToSlide(index) {
    if (totalSlides === 0) return;
    currentIndex = (index + totalSlides) % totalSlides;

    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === currentIndex);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === currentIndex);
      dot.setAttribute('aria-current', i === currentIndex ? 'true' : null);
    });
  }

  function startAutoAdvance() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(function () {
      goToSlide(currentIndex + 1);
    }, AUTO_INTERVAL);
  }

  function stopAutoAdvance() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  if (carousel && track && dots.length === totalSlides && totalSlides > 0) {
    goToSlide(0);
    startAutoAdvance();

    // Clic sur l'image : gauche = précédent, droite = suivant
    track.addEventListener('click', function (e) {
      var rect = track.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var mid = rect.width / 2;
      if (x < mid) {
        goToSlide(currentIndex - 1);
      } else {
        goToSlide(currentIndex + 1);
      }
      startAutoAdvance();
    });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        goToSlide(i);
        startAutoAdvance();
      });
    });
  }
})();
