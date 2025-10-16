'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Obtener todos los contenedores de botones
  const ratingContainers = document.querySelectorAll('.rating-container');

  ratingContainers.forEach(container => {
    // Para cada contenedor, encontrar sus botones y contadores
    const likeButton = container.querySelector('.like-button');
    const dislikeButton = container.querySelector('.dislike-button');

    let likeState = false;
    let dislikeState = false;

    // Función para actualizar los contadores en la vista
    const updateCounts = (likeCount, dislikeCount, likeCountElem, dislikeCountElem) => {
      likeCountElem.textContent = likeCount;
      dislikeCountElem.textContent = dislikeCount;
    };

    // función para añadir la clase de animación y eliminarla después
    const animateButton = (button) => {
      button.classList.add('animate');
      setTimeout(() => button.classList.remove('animate'), 1000);
    };

    // Manejador de eventos para el botón "me gusta"
    likeButton.addEventListener('click', () => {
      let likeCountElem = likeButton.querySelector('.count');
      let dislikeCountElem = dislikeButton.querySelector('.count');
      let dislikeCount = parseInt(dislikeCountElem.textContent);
      let likeCount = parseInt(likeCountElem.textContent);

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
      updateCounts(likeCount, dislikeCount, likeCountElem, dislikeCountElem);
    });

    // Manejador de eventos para el botón "no me gusta"
    dislikeButton.addEventListener('click', () => {
      let likeCountElem = likeButton.querySelector('.count');
      let dislikeCountElem = dislikeButton.querySelector('.count');
      let dislikeCount = parseInt(dislikeCountElem.textContent);
      let likeCount = parseInt(likeCountElem.textContent);

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
      updateCounts(likeCount, dislikeCount, likeCountElem, dislikeCountElem);
    });
  });
});
