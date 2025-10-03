

//  arreglo contenedor de imagenes del carrusel principal
const images = [
  { src: './images/carrusel/peg_solitaire.png', title: 'Peg Solitare', backgroundId: 'peg-solitaire' },
  { src: './images/carrusel/zombie_tsunami.png', title: 'Zombie Tsunami', backgroundId: 'zombie-tsunami' },
  { src: './images/carrusel/pacman.png', title: 'Pacman', backgroundId: 'pac-man' },
  { src: './images/carrusel/sims4.png', title: 'Sims 4', backgroundId: 'sims-4' },
  { src: './images/carrusel/gta.png', title: 'GTA', backgroundId: 'gta' },
];

// imagen actual
let currentIndex = 0;

// funcion que actualiza el carrusel en base al index actual
function updateCarousel() {

  // define derecha e izquierda desfasando el index actual por uno para ambos lados
  const leftIndex = (currentIndex - 1 + images.length) % images.length;
  const rightIndex = (currentIndex + 1) % images.length;

  // cambia valores a la izquierda
  const imgSecundaryLeft = document.getElementById('carousel-img-secondary-left');
  imgSecundaryLeft.src = images[leftIndex].src;
  imgSecundaryLeft.alt = images[leftIndex].title;

  // cambia valores al medio
  const mainImg = document.querySelector('.carousel-img-main');
  mainImg.src = images[currentIndex].src;
  mainImg.alt = images[currentIndex].title;
  document.querySelector('.carousel-img-title').textContent = images[currentIndex].title;
  document.querySelector('.carousel-img-main-container').id = images[currentIndex].backgroundId;

  // cambia valores a la derecha
  const imgSecundaryRight = document.getElementById('carousel-img-secondary-right');
  imgSecundaryRight.src = images[rightIndex].src;
  imgSecundaryRight.alt = images[rightIndex].title;
}

function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    updateCarousel();
}

function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateCarousel();
}


document.addEventListener('DOMContentLoaded', function() {
  // click en la flecha izquierda o a la imagen secundaria izquierda llama a la funcion "showPrev()"
  document.querySelector('.carousel-arrow-left').addEventListener('click', showPrev); 
  document.getElementById('carousel-img-secondary-left').addEventListener('click', showPrev);
  // click en la flecha derecha llama a la funcion "showNext()"
  document.querySelector('.carousel-arrow-right').addEventListener('click', showNext);
  document.querySelector('.carrousel-img-secondary-right').addEventListener('click', showNext);
});