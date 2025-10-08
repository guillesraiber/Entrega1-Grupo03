  const menuButton = document.querySelector('#nav-menu-img');
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');

  
  menuButton.addEventListener('click', function() {
    
      sidebar.classList.toggle('collapsed');
      mainContent.classList.toggle('sidebar-collapsed');
      
      menuButton.src = sidebar.classList.contains('collapsed') ? 'images/buttons/nav_menu_open.svg' : 'images/buttons/nav_menu_collapse.svg';
                                                                  // si el sidebar está colapsado, mostrar icono de abrir, sino de cerrar
});