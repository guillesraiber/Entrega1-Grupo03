// flappy.js - versión corregida
document.addEventListener('DOMContentLoaded', () => {

  // Config y estado
  const cfg = { worldSpeed: 2.4 };
  const player = { x:0, y:170, vy:0, gravity:0.45, flap:-9, width:44, height:34 };
  let worldX = 0;
  let running = false;
  let lastTs = null;

  // Elementos DOM
  const playBtn = document.getElementById('play-btn');
  const stopBtn = document.getElementById('stop-btn');
  const playerEl = document.getElementById('flappyPlayer');
  const gameEl = document.getElementById('flappyGame');

  // Selección de capas con filtro (si falta alguna, no rompe)
  const rawLayers = [
    { selector: '.layer-1', speed: 0.18 },
    { selector: '.layer-2', speed: 0.36 },
    { selector: '.layer-3', speed: 0.56 },
    { selector: '.layer-4', speed: 0.78 },
    { selector: '.layer-5', speed: 1.00 }
  ];
  const layers = rawLayers.map(r => {
    const el = document.querySelector(r.selector);
    return el ? { el, speed: r.speed } : null;
  }).filter(Boolean);

  // Inicializa posición del jugador y tamaño DOM
  function updatePlayerDom() {
    if (!playerEl || !gameEl) return;
    const screenLeft = Math.round(gameEl.clientWidth * 0.2);
    playerEl.style.left = screenLeft + 'px';
    playerEl.style.top = Math.round(player.y) + 'px';
    const tilt = Math.max(-45, Math.min(45, player.vy * 3));
    playerEl.style.transform = `rotate(${tilt}deg)`;
  }

  // Entrada: flap
  function flap() {
    if (!running) return;
    player.vy = player.flap;
  }
  window.addEventListener('keydown', e => { if (e.code === 'Space') { e.preventDefault(); flap(); }});
  window.addEventListener('mousedown', () => flap());
  window.addEventListener('touchstart', e => { e.preventDefault(); flap(); }, { passive:false });

  // Botones
  playBtn.addEventListener('click', () => {
    running = true;
    lastTs = null;
    worldX = 0;
  });
  stopBtn.addEventListener('click', () => { running = false; });

  // Loop principal (siempre corriendo para evitar dependencia de start instantáneo)
  function loop(ts) {
    if (!lastTs) lastTs = ts;
    const dt = Math.min((ts - lastTs)/16.6667, 4);
    lastTs = ts;

    if (running) {
      // avanzar mundo
      worldX += cfg.worldSpeed * dt;

      // física jugador
      player.vy += player.gravity * dt;
      player.y += player.vy * dt;
      // límites
      player.y = Math.max(0, Math.min(gameEl.clientHeight - player.height, player.y));
    }

    // actualizar parallax: fondo mueve background-position X (técnica del Tema5)
    layers.forEach(layer => {
      // Calculamos offset en px
      const offset = - Math.round(worldX * layer.speed);
      // Aplicamos a backgroundPositionX; si no soporta, usamos backgroundPosition
      try {
        layer.el.style.backgroundPositionX = offset + 'px';
      } catch (e) {
        layer.el.style.backgroundPosition = offset + 'px 0';
      }
    });

    updatePlayerDom();
    requestAnimationFrame(loop);
  }

  // start loop
  requestAnimationFrame(loop);

  // Si la ventana cambia de tamaño, reajusta posición visible del jugador
  window.addEventListener('resize', () => updatePlayerDom());

});
