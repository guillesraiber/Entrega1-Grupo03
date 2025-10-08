  const menuButton = document.querySelector('#nav-menu-img');
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');

  
  menuButton.addEventListener('click', function() {
    
      sidebar.classList.toggle('collapsed');
      mainContent.classList.toggle('sidebar-collapsed');
      
      
      if (window.innerWidth >= 768) {
        menuButton.src = sidebar.classList.contains('collapsed') ? 'images/buttons/nav_menu_open.svg' : 'images/buttons/nav_menu_collapse.svg';
        // si el sidebar está colapsado, mostrar icono de abrir, sino de cerrar
      } else { 
        menuButton.src = sidebar.classList.contains('collapsed') ? 'images/buttons/nav_menu_collapse.svg' : 'images/buttons/nav_menu_open.svg';
        // espacio en blanco para que pongas el código necesario cuando la pantalla sea menor a 768px
      }
});