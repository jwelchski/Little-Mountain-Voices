/* Little Mountain Voices holding page: opening countdown and map pin animation.
   The page reads fine without this file; it only adds to it. */
(function () {
  'use strict';

  // Opening: 1 August 2027, midnight Pacific (PDT, UTC-7). Change here if the date moves.
  var OPENING = Date.parse('2027-08-01T00:00:00-07:00');

  var box = document.getElementById('countdown');
  if (box) {
    var nums = {};
    box.querySelectorAll('[data-unit]').forEach(function (el) { nums[el.getAttribute('data-unit')] = el; });
    var sr = document.getElementById('until-sr');
    var timer = null;

    var set = function (unit, value) {
      var el = nums[unit];
      if (el.textContent === value) return;
      el.textContent = value;
      el.classList.remove('tick');
      void el.offsetWidth; // restart the animation
      el.classList.add('tick');
    };
    var pad = function (n) { return n < 10 ? '0' + n : String(n); };

    var tick = function () {
      var left = Math.floor((OPENING - Date.now()) / 1000);
      if (left <= 0) {
        box.hidden = true;
        if (timer) clearInterval(timer);
        return;
      }
      var days = Math.floor(left / 86400);
      set('d', String(days));
      set('h', pad(Math.floor(left % 86400 / 3600)));
      set('m', pad(Math.floor(left % 3600 / 60)));
      set('s', pad(left % 60));
      // Screen readers get one plain sentence instead of the ticking tiles.
      var said = ': about ' + days + (days === 1 ? ' day' : ' days') + ' left';
      if (sr.textContent !== said) sr.textContent = said;
    };

    if (OPENING > Date.now()) {
      tick();
      box.hidden = false;
      timer = setInterval(tick, 1000);
    }
  }

  // Pins pop in when the map scrolls into view. Without this they simply show.
  var map = document.getElementById('map');
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (map && !still && 'IntersectionObserver' in window) {
    map.classList.add('armed');
    new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { map.classList.add('play'); obs.disconnect(); }
      });
    }, { threshold: 0.35 }).observe(map);
  }
})();
