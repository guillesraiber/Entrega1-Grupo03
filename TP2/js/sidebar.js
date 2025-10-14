  const menuButton = document.querySelector('#nav-menu-img');
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');
  const logoNavbar = document.querySelector('.logo-full');

      if (window.innerWidth <= 768) {
        logoNavbar.src = 'images/logo/Logo-circular.png';
        menuButton.src = sidebar.classList.contains('collapsed') ? 'images/buttons/nav_menu_collapse.svg' : 'images/buttons/nav_menu_open.svg';
      } else {
        logoNavbar.src = 'images/logo/Logo_horizontal.png';
        menuButton.src = sidebar.classList.contains('collapsed') ? 'images/buttons/nav_menu_open.svg' : 'images/buttons/nav_menu_collapse.svg'; 
      }

    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        logoNavbar.src = 'images/logo/Logo-circular.png';
        menuButton.src = sidebar.classList.contains('collapsed') ? 'images/buttons/nav_menu_collapse.svg' : 'images/buttons/nav_menu_open.svg';
      } else {
        logoNavbar.src = 'images/logo/Logo_horizontal.png';
        menuButton.src = sidebar.classList.contains('collapsed') ? 'images/buttons/nav_menu_open.svg' : 'images/buttons/nav_menu_collapse.svg'; 
      }
    })
  
  menuButton.addEventListener('click', function() {
    
      sidebar.classList.toggle('collapsed');
      mainContent.classList.toggle('sidebar-collapsed');
      
      
      if (window.innerWidth >= 768) {
        menuButton.src = sidebar.classList.contains('collapsed') ? 'images/buttons/nav_menu_collapse.svg' : 'images/buttons/nav_menu_open.svg';
        // si el sidebar está colapsado, mostrar icono de abrir, sino de cerrar
      } else { 
        menuButton.src = sidebar.classList.contains('collapsed') ? 'images/buttons/nav_menu_open.svg' : 'images/buttons/nav_menu_collapse.svg'; 
        // espacio en blanco para que pongas el código necesario cuando la pantalla sea menor a 768px
      }
});