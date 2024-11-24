// script.js

// Countdown Timer
function updateCountdown() {
    const now = new Date();
    const newYear = new Date(`January 1, ${now.getFullYear() + 1} 00:00:00`);
    const timeDiff = newYear - now;

    const months = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 30));
    const weeks = Math.floor((timeDiff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24 * 7));
    const days = Math.floor((timeDiff % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    document.getElementById('countdown').innerText =
        `${months} Months, ${weeks} Weeks, ${days} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds`;
}

// Fireworks
const fireworks = new Fireworks({
    target: document.body,
    hue: { min: 0, max: 360 },
    acceleration: 1.05,
    brightness: { min: 50, max: 80 },
    decay: { min: 0.015, max: 0.03 }
});
fireworks.start();

document.addEventListener('click', (e) => {
    fireworks.addMouseFirework(e.clientX, e.clientY);
});

// Update Timer Every Second
updateCountdown();
setInterval(updateCountdown, 1000);
