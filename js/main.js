(function () {
  'use strict';

  // Custom cursor (desktop, fine pointers only)
  var cursor = document.querySelector('.cursor');
  if (cursor && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    var x = 0, y = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', function (e) {
      x = e.clientX; y = e.clientY;
      cursor.classList.add('on');
    });
    document.addEventListener('mouseleave', function () { cursor.classList.remove('on'); });
    (function loop() {
      cx += (x - cx) * 0.22;
      cy += (y - cy) * 0.22;
      cursor.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a, button, .chips li').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.classList.add('big'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('big'); });
    });
  }

  // Nav border once scrolled
  var nav = document.getElementById('nav');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 10); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Scroll reveal
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // Active nav link + experience index highlight
  function trackActive(selector, attr, linkSel) {
    var links = document.querySelectorAll(linkSel);
    var targets = [];
    links.forEach(function (l) {
      var t = document.querySelector(l.getAttribute('href'));
      if (t) targets.push({ link: l, el: t });
    });
    if (!targets.length || !('IntersectionObserver' in window)) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          targets.forEach(function (t) { t.link.classList.toggle('active', t.el === en.target); });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    targets.forEach(function (t) { obs.observe(t.el); });
  }
  trackActive('section', 'id', '.nav-links a');
  trackActive('.job', 'id', '.exp-index a');

  // Show / hide details on experience entries
  document.querySelectorAll('.toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      btn.textContent = open ? 'Show details' : 'Hide details';
      if (open) { panel.setAttribute('hidden', ''); } else { panel.removeAttribute('hidden'); }
    });
  });

  // Open the details when a role is jumped to from the index
  document.querySelectorAll('.exp-index a').forEach(function (a) {
    a.addEventListener('click', function () {
      var job = document.querySelector(a.getAttribute('href'));
      var btn = job && job.querySelector('.toggle');
      if (btn && btn.getAttribute('aria-expanded') === 'false') btn.click();
    });
  });
})();
