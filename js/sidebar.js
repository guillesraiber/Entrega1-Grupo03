  const menuButton = document.querySelector('.menu-button');
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');
  
  menuButton.addEventListener('click', function() {
      sidebar.classList.toggle('collapsed');
      mainContent.classList.toggle('sidebar-collapsed');
      document.getElementById('menu-icon').src = sidebar.classList.contains('collapsed') ? 'images/nav_menu_open.svg' : 'images/nav_menu_collapse.svg';
                                                                  // si el sidebar está colapsado, mostrar icono de abrir, sino de cerrar
  });