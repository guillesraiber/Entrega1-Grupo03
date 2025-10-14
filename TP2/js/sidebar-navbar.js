  const menuButton = document.querySelector('#nav-menu-img');
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');
  const logoNavbar = document.querySelector('.logo-full');
  const searchInput = document.getElementById('search');

      // al iniciar la pagina chequea el ancho de la pagina y ajusta el logo del navbar y 
      // el boton de abrir y cerrar sidebar
      resizeNavbarElements();

    // cada vez que se ajusta el tamaño de pagina se chequea el ancho de la misma.
    // cuando llega 768 o menos, se hace el mismo ajusto responsive que antes
    window.addEventListener('resize', () => {
      resizeNavbarElements();
    })
  
  menuButton.addEventListener('click', function() {
    
      sidebar.classList.toggle('collapsed');
      mainContent.classList.toggle('sidebar-collapsed');
      
      
      if (window.innerWidth <= 768) {
        menuButton.src = sidebar.classList.contains('collapsed') ? 'images/buttons/nav_menu_collapse.svg' : 'images/buttons/nav_menu_open.svg';
        // si el ancho es de menos 768 o menos, los cambios son acordes a mobile (con sidebar cerrado 100% o abierto 100%)
      } else { 
        menuButton.src = sidebar.classList.contains('collapsed') ? 'images/buttons/nav_menu_open.svg' : 'images/buttons/nav_menu_collapse.svg'; 
        // si el ancho es mas de 768 los cambios son de desktop (con sidebar siempre abierto pero se hace grande o chico)
      }
});

function resizeNavbarElements() {
  if (window.innerWidth <= 768) {
    logoNavbar.src = 'images/logo/Logo-circular.png';
    menuButton.src = sidebar.classList.contains('collapsed') ? 'images/buttons/nav_menu_collapse.svg' : 'images/buttons/nav_menu_open.svg';
    searchInput.placeholder = "Buscar";
  } else {
    logoNavbar.src = 'images/logo/Logo_horizontal.png';
    menuButton.src = sidebar.classList.contains('collapsed') ? 'images/buttons/nav_menu_open.svg' : 'images/buttons/nav_menu_collapse.svg'; 
    searchInput.placeholder = "Buscar juegos o categorías";
  }
}