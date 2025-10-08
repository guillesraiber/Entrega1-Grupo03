// comentarios.js
// Gestiona las pestañas de comentarios: al hacer click en una .tab se le pasa la clase "active"
document.addEventListener('DOMContentLoaded', () => {
	const tabsContainer = document.querySelector('.comments-tabs');
	if (!tabsContainer) return;

	const tabs = Array.from(tabsContainer.querySelectorAll('.tab'));
	if (tabs.length === 0) return;

	// Click handler: mueve la clase active al tab clickeado
	const activateTab = (tab) => {
		if (!tab || tab.classList.contains('active')) return;
		tabs.forEach(t => t.classList.remove('active'));
		tab.classList.add('active');
		// aquí podrías agregar lógica para mostrar/ocultar contenidos asociados
	};

	tabs.forEach(tab => {
		tab.addEventListener('click', () => activateTab(tab));
		tab.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				activateTab(tab);
			}
		});
		// mejorar accesibilidad: permitir foco
		tab.setAttribute('tabindex', '0');
	});

	// Delegación: si se quiere soportar botones añadidos dinámicamente
	tabsContainer.addEventListener('click', (e) => {
		const tab = e.target.closest('.tab');
		if (tab && tabsContainer.contains(tab)) activateTab(tab);
	});
});





// const commentType = document.querySelectorAll(".tab");
// const commentTypeContainer = document.querySelector(".comments-tab");

// commentType.addEventListener("click", function() {
//     lastActive = commentTypeContainer.querySelector(".active");
//     lastActive.classList.remove("active");

//     EventTarget.classList.add("active");
// })