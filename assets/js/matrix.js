const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const fontSize = 16;
const columns = Math.floor(width / fontSize);
const drops = [];

// Initialize each column at a random
for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -100; 
}

function draw() {
    // This draws a semi-transparent layer every frame.
    ctx.fillStyle = "rgba(11, 19, 38, 0.15)"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
        const text = Math.random() > 0.5 ? "1" : "0";

        ctx.fillStyle = "#00f9f962"; 
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Resetting the drop to the top randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }

        drops[i]++;
    }
}

setInterval(draw, 50);

// Keep canvas responsive
window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});