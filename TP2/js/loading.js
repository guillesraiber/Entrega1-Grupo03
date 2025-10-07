document.addEventListener("DOMContentLoaded", () => {
    // Loader: Simular progreso de carga 
    const loader = document.getElementById('loader');
    const content = document.querySelector('.indexLoad');
    const progressText = document.getElementById('progress');

    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress++;
        progressText.textContent = `${progress}%`;

        if (progress >= 100) {
            clearInterval(loadingInterval);
            loader.style.display = 'none'; 
            //content.style.display = 'block'; 
        }
    }, 50); 
});