'use strict';
document.addEventListener('DOMContentLoaded', () => {

// flechas de carrusel de imagenes y gameplays
const prevBtn = document.querySelector(".gameplays-scroll-button.left");
const nextBtn = document.querySelector(".gameplays-scroll-button.right");
const galleryTrack = document.querySelector(".gallery-track");

prevBtn.addEventListener("click", () => {
  galleryTrack.scrollBy({ left: -350, behavior: "smooth" });
});
nextBtn.addEventListener("click", () => {
  galleryTrack.scrollBy({ left: 350, behavior: "smooth" });
});


// Gestiona las pestañas de comentarios: al hacer click en una .tab se le pasa la clase "active"
	const tabsContainer = document.querySelector('.comments-tabs');
	if (!tabsContainer) return;

	const tabs = Array.from(tabsContainer.querySelectorAll('.tab'));

	// Click handler: mueve la clase active al tab clickeado
	const activateTab = (tab) => {
		if (!tab || tab.classList.contains('active')) return;
		tabs.forEach(t => t.classList.remove('active'));
		tab.classList.add('active');
		// aquí podrías agregar lógica para mostrar/ocultar contenidos asociados
	};

	tabs.forEach(tab => {
		tab.addEventListener('click', () => activateTab(tab));
	});

	// Delegación: si se quiere soportar botones añadidos dinámicamente
	tabsContainer.addEventListener('click', (e) => {
		const tab = e.target.closest('.tab');
		if (tab && tabsContainer.contains(tab)) activateTab(tab);
	});
});