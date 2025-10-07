  const menuButton = document.querySelector('#nav-menu-img');
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');

  
  menuButton.addEventListener('click', function() {
      if(window.innerWidth <768) {
        sidebar.classList.toggle('open');
      } else {
        sidebar.classList.remove('collapsed');
        mainContent.classList.toggle('sidebar-collapsed');
      }
      menuButton.src = sidebar.classList.contains('collapsed') ? 'images/buttons/nav_menu_open.svg' : 'images/buttons/nav_menu_collapse.svg';
                                                                  // si el sidebar está colapsado, mostrar icono de abrir, sino de cerrar
});