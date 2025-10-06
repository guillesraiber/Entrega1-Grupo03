

//  arreglo contenedor de imagenes del carrusel principal
const images = [
  { src: './images/Carrusel principal/peg_solitaire.png', title: 'Peg Solitare', backgroundId: 'peg-solitaire', link: 'pagina-juego.html' },
  { src: './images/Carrusel principal/zombie_tsunami.png', title: 'Zombie Tsunami', backgroundId: 'zombie-tsunami', link: '#' },
  { src: './images/Carrusel principal/pacman.png', title: 'Pacman', backgroundId: 'pac-man', link: '#' },
  { src: './images/Carrusel principal/sims4.png', title: 'Sims 4', backgroundId: 'sims-4', link: '#' },
  { src: './images/Carrusel principal/gta.png', title: 'GTA', backgroundId: 'gta', link: '#' },
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
  document.querySelector('.carousel-img-main-container').href = images[currentIndex].link;
  document.querySelector('.carousel-img-title').textContent = images[currentIndex].title;
  document.querySelector('.carousel-img-main-container').id = images[currentIndex].backgroundId;

  // cambia valores a la derecha
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
  const arrowLeft = document.querySelector('.carousel-arrow-left');
  if (arrowLeft) arrowLeft.addEventListener('click', showPrev);

  // usamos getElementById porque en el HTML los elementos secundarios tienen id, no clase
  const imgSecLeft = document.getElementById('carousel-img-secondary-left');
  if (imgSecLeft) imgSecLeft.addEventListener('click', showPrev);

  // click en la flecha derecha llama a la funcion "showNext()"
  const arrowRight = document.querySelector('.carousel-arrow-right');
  if (arrowRight) arrowRight.addEventListener('click', showNext);

  const imgSecRight = document.getElementById('carousel-img-secondary-right');
  if (imgSecRight) imgSecRight.addEventListener('click', showNext);
  // Aseguro que el carrusel se inicialice con el estado correcto
  if (typeof updateCarousel === 'function') updateCarousel();

});