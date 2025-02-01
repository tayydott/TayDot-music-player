const playerContainer = document.getElementById('player-container');
const backBtn = document.getElementById('back-btn');
const playBtn = document.getElementById('play');
let isPlaying = false;

// Play/Pause toggle
playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    playBtn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
});

// Back button
backBtn.addEventListener('click', () => {
    playerContainer.classList.remove('active');
});

// Swipe gestures
document.addEventListener('swiped-left', () => alert('Next song'));
document.addEventListener('swiped-right', () => alert('Previous song'));
document.addEventListener('swiped-up', () => playerContainer.classList.add('active'));
document.addEventListener('swiped-down', () => playerContainer.classList.remove('active'));

// Device Motion Controls
let lastShakeTime = 0;
window.addEventListener('devicemotion', (event) => {
    const acceleration = event.accelerationIncludingGravity;
    const shakeThreshold = 15;
    const now = new Date().getTime();
    
    if (acceleration.x > shakeThreshold || acceleration.y > shakeThreshold || acceleration.z > shakeThreshold) {
        if (now - lastShakeTime > 1000) {
            alert('Shuffling playlist');
            lastShakeTime = now;
        }
    }
});

// Orientation Change Detection
window.addEventListener("orientationchange", () => {
    if (window.orientation === 90 || window.orientation === -90) {
        alert("Landscape mode detected!");
    } else {
        alert("Portrait mode detected!");
    }
});
