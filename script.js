function initBurgerMenu() {
  const burgerIcon = document.querySelector('.burger-icon');
  const sideMenu = document.querySelector('.side-menu');
  const body = document.body;

  if (burgerIcon && sideMenu) {
    burgerIcon.addEventListener('click', function () {
      this.classList.toggle('active');
      sideMenu.classList.toggle('open');
      body.classList.toggle('no-scroll');

      const isExpanded = this.getAttribute('aria-expanded') === 'true' || false;
      this.setAttribute('aria-expanded', !isExpanded);
    });

    sideMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function () {
        burgerIcon.classList.remove('active');
        sideMenu.classList.remove('open');
        body.classList.remove('no-scroll');
        burgerIcon.setAttribute('aria-expanded', 'false');
      });
    });
  } else {
    console.warn("Burger icon or side menu not found after header load.");
  }
}
