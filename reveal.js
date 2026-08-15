// Adds a slow, deliberate fade/rise to elements with class="reveal"
// as they scroll into view. No dependencies.
document.addEventListener('DOMContentLoaded', function () {
  var targets = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || targets.length === 0) {
    targets.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  targets.forEach(function (el) { observer.observe(el); });
});
