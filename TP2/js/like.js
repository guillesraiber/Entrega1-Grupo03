'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Obtener todos los contenedores de botones
  const ratingContainers = document.querySelectorAll('.rating-container');

  ratingContainers.forEach(container => {
    // 2. Para cada contenedor, encontrar sus botones y contadores
    const likeButton = container.querySelector('.like-button');
    const dislikeButton = container.querySelector('.dislike-button');
    const likeCountElem = likeButton.querySelector('.count');
    const dislikeCountElem = dislikeButton.querySelector('.count');

    let likeCount = 0;
    let dislikeCount = 0;
    let likeState = false;
    let dislikeState = false;

    // Función para actualizar los contadores en la vista
    const updateCounts = () => {
      likeCountElem.textContent = likeCount;
      dislikeCountElem.textContent = dislikeCount;
    };

    // Función para añadir la clase de animación y eliminarla después
    const animateButton = (button) => {
      button.classList.add('animate');
      setTimeout(() => button.classList.remove('animate'), 300);
    };

    // Manejador de eventos para el botón "me gusta"
    likeButton.addEventListener('click', () => {
      if (likeState) {
        likeCount--;
        likeState = false;
        likeButton.classList.remove('liked');
      } else {
        likeCount++;
        likeState = true;
        likeButton.classList.add('liked');
        animateButton(likeButton);

        if (dislikeState) {
          dislikeCount--;
          dislikeState = false;
          dislikeButton.classList.remove('disliked');
        }
      }
      updateCounts();
    });

    // Manejador de eventos para el botón "no me gusta"
    dislikeButton.addEventListener('click', () => {
      if (dislikeState) {
        dislikeCount--;
        dislikeState = false;
        dislikeButton.classList.remove('disliked');
      } else {
        dislikeCount++;
        dislikeState = true;
        dislikeButton.classList.add('disliked');
        animateButton(dislikeButton);

        if (likeState) {
          likeCount--;
          likeState = false;
          likeButton.classList.remove('liked');
        }
      }
      updateCounts();
    });
  });
});
