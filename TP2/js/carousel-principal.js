

//  arreglo contenedor de imagenes del carrusel principal
const images = [
  { src: './images/carrusel/peg_solitaire.png', title: 'Peg Solitare' },
  { src: './images/carrusel/zombie_tsunami.png', title: 'Zombie Tsunami' },
  { src: './images/carrusel/pacman.png', title: 'Pacman' },
  { src: './images/carrusel/sims4.png', title: 'Sims 4' },
  { src: './images/carrusel/gta.png', title: 'GTA' },
];

// imagen actual
let currentIndex = 0;

// funcion que actualiza el carrusel en base al index actual
function updateCarousel() {

  // define derecha e izquierda desfasando el index actual por uno para ambos lados
  const leftIndex = (currentIndex - 1 + images.length) % images.length;
  const rightIndex = (currentIndex + 1) % images.length;

  // cambia valores a la izquierda
  document.getElementById('carousel-img-secondary-left').src = images[leftIndex].src;
  document.getElementById('carousel-img-secondary-left').alt = images[leftIndex].title;

  // cambia valores al medio
  document.querySelector('.carousel-img-main').src = images[currentIndex].src;
  document.querySelector('.carousel-img-main').alt = images[currentIndex].title;
  document.querySelector('.carousel-img-title').textContent = images[currentIndex].title;

  // cambia valores a la derecha
  document.getElementById('carousel-img-secondary-right').src = images[rightIndex].src;
  document.getElementById('carousel-img-secondary-right').alt = images[rightIndex].title;
}

function showPrev() {
  // resta uno al index y le suma la longitud del arreglo para evitar negativos,
  // luego aplica modulo para volver el index al rango del arreglo
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateCarousel();
}

function showNext() {
  // lo mismo que showPrev pero sumando uno
  currentIndex = (currentIndex + 1) % images.length;
  updateCarousel();
}

document.addEventListener('DOMContentLoaded', function() {
  // click en la flecha izquierda llama a la funcion "showPrev()"
  document.querySelector('.carousel-arrow-left').addEventListener('click', showPrev);  
  // click en la flecha derecha llama a la funcion "showNext()"
  document.querySelector('.carousel-arrow-right').addEventListener('click', showNext);
});