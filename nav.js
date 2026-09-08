// Toggles the mobile nav dropdown open/closed, and closes it
// automatically when a link inside it is tapped. Positions the
// dropdown precisely below the actual nav row (fixed to viewport)
// so it always floats above hero content regardless of that
// section's own stacking context or overflow settings.
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.getElementById('navToggle');
  var links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  var navRow = toggle.closest('nav') || toggle.closest('.hero-fuel-top');

  function positionDropdown() {
    if (!navRow) return;
    var rect = navRow.getBoundingClientRect();
    links.style.top = rect.bottom + 'px';
  }

  toggle.addEventListener('click', function () {
    positionDropdown();
    var isOpen = links.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  window.addEventListener('resize', positionDropdown);

  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
});
