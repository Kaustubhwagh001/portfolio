// Basic interactions: nav smooth scroll highlight & regen button hooks
document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll behavior for internal links (works in modern browsers)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // small nav active class on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a');
  function onScroll(){
    let current = '';
    sections.forEach(s => {
      const top = s.getBoundingClientRect().top;
      if (top <= 80) current = s.id;
    });
    navLinks.forEach(n => {
      n.classList.toggle('active', n.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  // Regen layout control for graph (delegated)
  const regenBtn = document.getElementById('regenGraph');
  if (regenBtn) {
    regenBtn.addEventListener('click', () => {
      if (window.renderDependencyGraph) window.renderDependencyGraph(true);
    });
  }
});
