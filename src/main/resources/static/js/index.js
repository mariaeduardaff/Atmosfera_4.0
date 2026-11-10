const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;

themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    if (html.classList.contains('dark')) {
        themeIcon.className = 'fa-solid fa-sun';
        themeIcon.style.color = '#f59e0b';
    } else {
        themeIcon.className = 'fa-solid fa-moon';
        themeIcon.style.color = '';
    }
});

// holograma canvass
const canvas = document.getElementById('halftoneHeroCanvas');
const ctx = canvas.getContext('2d');

let width, height;
function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    width = canvas.width;
    height = canvas.height;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let mouseX = width / 2;
let mouseY = height / 2;
let targetMouseX = mouseX;
let targetMouseY = mouseY;

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    targetMouseX = (e.clientX - rect.left) * window.devicePixelRatio;
    targetMouseY = (e.clientY - rect.top) * window.devicePixelRatio;
});

let time = 0;
function renderHalftone() {
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    ctx.clearRect(0, 0, width, height);

    const spacing = 10 * window.devicePixelRatio;

    for (let x = spacing / 2; x < width; x += spacing) {
        for (let y = spacing / 2; y < height; y += spacing) {

            const dx = x - mouseX;
            const dy = y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const wave1 = Math.sin(x * 0.015 + time) * Math.cos(y * 0.015 + time);
            const wave2 = Math.sin(dist * 0.02 - time * 2);
            const factor = (wave1 + wave2 + 2) / 4;

            const maxRadius = (spacing / 2) * 0.95;
            const radius = Math.max(0.6, factor * maxRadius);

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);

            const alpha = 0.2 + factor * 0.8;
            ctx.fillStyle = `rgba(227, 6, 19, ${alpha})`;
            ctx.fill();
        }
    }

    time += 0.025;
    requestAnimationFrame(renderHalftone);
}

renderHalftone();