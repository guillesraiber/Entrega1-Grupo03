document.addEventListener("DOMContentLoaded", () => {
  const gamesContainer = document.getElementById("games-container");

  fetch("https://vj.interfaces.jima.com.ar/api")
    .then(response => response.json())
    .then(data => {
      // Carrusel por fecha (más recientes)
      const juegosPorFecha = [...data]
        .filter(j => j.released)
        .sort((a, b) => new Date(b.released) - new Date(a.released))
        .slice(0, 12);
      renderCarousel("Recientes", juegosPorFecha);

      // Carrusel por rating (mejor puntuados)
      const juegosPorRating = [...data]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 12);
      renderCarousel("Trending", juegosPorRating);

      // Agrupar juegos por género
      const juegosPorGenero = {};
      data.forEach(juego => {
        if (juego.genres?.length) {
          juego.genres.forEach(genero => {
            if (!juegosPorGenero[genero.name]) {
              juegosPorGenero[genero.name] = [];
            }
            juegosPorGenero[genero.name].push(juego);
          });
        } else {
          (juegosPorGenero["Sin género"] ||= []).push(juego);
        }
      });

      Object.entries(juegosPorGenero).forEach(([genero, juegos]) => {
        renderCarousel(genero, juegos);
      });
    })
    .catch(error => console.error("Error cargando juegos:", error));

  // Agrega los iconos dinamicamente según categoría
  const iconosCategorias = {
    "Recientes": "images/Iconos juegos y categorias/recientes.svg",
    "Trending": "images/Iconos juegos y categorias/trending.svg",
    "Action": "images/Iconos juegos y categorias/accion.svg",
    "RPG": "images/Iconos juegos y categorias/2_jugadorea.svg",
    "Shooter": "images/Iconos juegos y categorias/guerra.svg",
    "Puzzle": "images/Iconos juegos y categorias/de_mesa.svg",
    "Adventure": "images/Iconos juegos y categorias/aventuras.svg",
    "Indie": "images/Iconos juegos y categorias/random.svg",
    "Platformer": "images/Iconos juegos y categorias/terror.svg",
    "Massively Multiplayer": "images/Iconos juegos y categorias/multijugador.svg",
    "Sports": "images/Iconos juegos y categorias/futbol.svg",
    "Racing": "images/Iconos juegos y categorias/carreras.svg",
    "Simulation": "images/Iconos juegos y categorias/pokemon.svg",
    "Arcade": "images/Iconos juegos y categorias/clasicos.svg",
    "Strategy": "images/Iconos juegos y categorias/estrategia.svg",
    "Casual": "images/Iconos juegos y categorias/motos.svg",
    "Fighting": "images/Iconos juegos y categorias/pc.svg",
  }

  function renderCarousel(titulo, juegos) {
    const carousel = document.createElement("div");
    carousel.className = "games-carousel";

    // Si es "Recientes", le agrego clase especial para fondo gris
    const isRecientes = titulo.toLowerCase() === "recientes";
    if (isRecientes) {
      carousel.classList.add("recientes-carousel");
    }

    // Contenedor para título y "Ver todos" en la misma línea
    const headerContainer = document.createElement("div");
    headerContainer.className = "carousel-header";

    // Icono de la categoría (si existe en el mapa)
    if (iconosCategorias[titulo]) {
      const icono = document.createElement("img");
      icono.src = iconosCategorias[titulo];
      icono.alt = `Icono de ${titulo}`;
      icono.className = "category-icon"; 
      headerContainer.appendChild(icono);
    }

    // Título
    const generoTitle = document.createElement("h3");
    generoTitle.className = "games-category-title";
    generoTitle.textContent = titulo;
    headerContainer.appendChild(generoTitle);

    // "Ver todos"
    const verTodosGenero = document.createElement("a");
    verTodosGenero.className = "ver-todos-link";
    verTodosGenero.href = "#"; // Aquí se pondría el enlace real
    verTodosGenero.textContent = "Ver todos";
    headerContainer.appendChild(verTodosGenero);

    carousel.appendChild(headerContainer);

    // Track
    const track = document.createElement("div");
    track.className = "carousel-track";

    juegos.forEach(juego => {
      const name = juego?.name || "Sin nombre";
      const img = juego?.background_image || "images/placeholder.png";
      const priceVal = (typeof juego?.price === "number") ? juego.price : (juego?.price ? Number(juego.price) : 0);
      const precio = (priceVal && !Number.isNaN(priceVal) && priceVal > 0) ? `$${priceVal.toFixed(2)}` : "Gratis";

      const card = document.createElement("div");
      card.className = "game-card";
      card.innerHTML = `
        <img src="${img}" alt="${name}" class="game-img" loading="lazy">
        <div class="game-info">
          <h4 class="game-title" title="${name}">${name}</h4>
          <div class="game-meta">
            <span class="game-price">${precio}</span>
            <button class="play-btn">Jugar</button>
          </div>
        </div>
      `;
      track.appendChild(card);
    });

    carousel.appendChild(track);

    // Botones de navegación
    if (juegos.length > 5) {
      const prevBtn = document.createElement("button");
      prevBtn.textContent = "◀";
      prevBtn.className = "carousel-btn prev-btn";

      const nextBtn = document.createElement("button");
      nextBtn.textContent = "▶";
      nextBtn.className = "carousel-btn next-btn";

      carousel.appendChild(prevBtn);
      carousel.appendChild(nextBtn);

      prevBtn.addEventListener("click", () => {
        track.scrollBy({ left: -220, behavior: "smooth" });
      });
      nextBtn.addEventListener("click", () => {
        track.scrollBy({ left: 220, behavior: "smooth" });
      });
    }

    gamesContainer.appendChild(carousel);
  }
});