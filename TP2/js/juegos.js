
document.addEventListener("DOMContentLoaded", () => {
  const gamesContainer = document.getElementById("games-container");

  fetch("https://vj.interfaces.jima.com.ar/api/v2")
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
    "Indie": "images/Iconos juegos y categorias/para_niños.svg",
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
    verTodosGenero.className = "view-all-link";
    verTodosGenero.href = "#"; // Aquí se pondría el enlace real
    verTodosGenero.textContent = "Ver todos";
    headerContainer.appendChild(verTodosGenero);

    carousel.appendChild(headerContainer);

    // Track
    const track = document.createElement("div");
    track.className = "carousel-track";

    // Si es "Recientes", le agrego clase especial para fondo gris y una card del peg solitaire
    const isRecientes = titulo.toLowerCase() === "recientes";
    if (isRecientes) {
      carousel.classList.add("recientes-carousel");

      const card = document.createElement("div");
      card.className = "game-card";
      card.innerHTML = `
        <img src="images/Peg solitaire/peg-solitaire-card.png" alt="Peg Solitarie" class="game-img" loading="lazy">
        <div class="game-info">
          <h4 class="game-title" title="Peg Solitaire">Peg Solitaire</h4>
          <div class="game-meta">
            <span class="game-price free">Gratis</span>

              <button class="play-btn" onclick="window.location.href='pagina-juego.html'">Jugar</button>

          </div>
        </div>
      `;
      track.appendChild(card);
    }

    juegos.forEach(juego => {
      const name = juego?.name || "Sin nombre";
      const img = juego?.background_image_low_res || "images/placeholder.png";
      // Decide categoría de precio por probabilidad:
      // 60% => free, 30% => priced, 10% => obtained
      const r = Math.random();
      let priceClass = "free";
      let priceText = "Gratis";
      if (r < 0.6) {
        priceClass = "free";
        priceText = "Gratis";
      } else if (r < 0.9) {
        priceClass = "priced";
        // Genera un precio aleatorio entre $0.99 y $19.99
        const priceValue = (Math.random() * (19.99 - 0.99) + 0.99).toFixed(2);
        priceText = `$${priceValue}`;
      } else {
        priceClass = "obtained";
        priceText = "Obtenido";
      }

      const card = document.createElement("div");
      card.className = "game-card";
      card.innerHTML = `
        <img src="${img}" alt="${name}" class="game-img" loading="lazy">
        <div class="game-info">
          <h4 class="game-title" title="${name}">${name}</h4>
          <div class="game-meta">
            <span class="game-price ${priceClass}">${priceText}</span>
            <button class="play-btn">Jugar</button>
          </div>
        </div>
      `;
      track.appendChild(card);
    });

    carousel.appendChild(track);

    const NAV_BUTTON_THRESHOLD = 3;

    // Botones de navegación
    if (juegos.length >= NAV_BUTTON_THRESHOLD) {
      const prevBtn = document.createElement("button");
      prevBtn.textContent = "◀";
      prevBtn.className = "carousel-btn prev-btn";

      const nextBtn = document.createElement("button");
      nextBtn.textContent = "▶";
      nextBtn.className = "carousel-btn next-btn";

      carousel.appendChild(prevBtn);
      carousel.appendChild(nextBtn);

      prevBtn.addEventListener("click", () => {
        track.scrollBy({ left: -550, behavior: "smooth" });
      });
      nextBtn.addEventListener("click", () => {
        track.scrollBy({ left: 550, behavior: "smooth" });
      });
    }

    gamesContainer.appendChild(carousel);
  }
});