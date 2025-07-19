// Call this AFTER header is injected into the page
function highlightNavLink() {
  const currentPage = window.location.pathname.split('/').pop();
  const navButtons = document.querySelectorAll('.nav-button');
  console.log(currentPage, navButtons)
  navButtons.forEach(btn => {
    const href = btn.getAttribute('href');
    if (href === currentPage || (href === 'index.html' && currentPage === '')) {
      btn.classList.add('active');
    } else btn.classList.remove('active')
  });
}
