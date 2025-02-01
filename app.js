// Service Worker Registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(registration => console.log('SW registered'))
        .catch(err => console.log('SW registration failed'));
}

// Initialize variables
let songs = [];
let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let touchStartX = 0;
let touchStartY = 0;
const SHAKE_THRESHOLD = 15;

// DOM Elements
const audio = new Audio();
const playPauseBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const shuffleBtn = document.getElementById('shuffle');
const repeatBtn = document.getElementById('repeat');
const volumeSlider = document.getElementById('volume');
const progressContainer = document.getElementById('progress-container');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const titleEl = document.getElementById('title');
const artistEl = document.getElementById('artist');
const coverEl = document.getElementById('cover');
const playlistItems = document.getElementById('playlist-items');

// Initialize playlist
function initPlaylist() {
    playlistItems.innerHTML = songs.map((song, index) => `
        <div class="playlist-item ${index === currentSongIndex ? 'active' : ''}" data-index="${index}">
            ${song.cover ? `<img src="${song.cover}" alt="${song.title}">` : ''}
            <div>
                <div class="song-title">${song.title}</div>
                <div class="artist">${song.artist}</div>
            </div>
        </div>
    `).join('');
}

// Load song
function loadSong(index) {
    const song = songs[index];
    titleEl.textContent = song.title;
    artistEl.textContent = song.artist;
    coverEl.src = song.cover || 'https://picsum.photos/300';
    audio.src = song.src;
    
    document.querySelectorAll('.playlist-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`.playlist-item[data-index="${index}"]`)?.classList.add('active');
}

// File input handler
document.getElementById('file-input').addEventListener('change', function(e) {
    const files = Array.from(e.target.files);
    files.forEach(storeOfflineSong);
    
    const newSongs = files.map(file => ({
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: "Unknown Artist",
        src: URL.createObjectURL(file),
        cover: 'https://picsum.photos/300'
    }));
    
    songs = [...newSongs];
    initPlaylist();
    loadSong(currentSongIndex);
});

// Play/pause toggle
function togglePlay() {
    isPlaying ? audio.pause() : audio.play();
}

// Format time display
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Update progress bar
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    currentTimeEl.textContent = formatTime(currentTime);
    durationEl.textContent = formatTime(duration);
}

// Set progress on click
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

// Event listeners
playPauseBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', () => changeSong(-1));
nextBtn.addEventListener('click', () => changeSong(1));
shuffleBtn.addEventListener('click', toggleShuffle);
repeatBtn.addEventListener('click', toggleRepeat);
volumeSlider.addEventListener('input', (e) => audio.volume = e.target.value);
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', handleSongEnd);
progressContainer.addEventListener('click', setProgress);
document.getElementById('back-btn').addEventListener('click', () => {
    document.querySelector('.player-container').classList.remove('active');
});

playlistItems.addEventListener('click', (e) => {
    const playlistItem = e.target.closest('.playlist-item');
    if (playlistItem) {
        currentSongIndex = parseInt(playlistItem.dataset.index);
        loadSong(currentSongIndex);
        audio.play();
        document.querySelector('.player-container').classList.add('active');
    }
});

audio.addEventListener('play', () => {
    isPlaying = true;
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    document.querySelector('.album-art').style.animation = 'pulse 2s infinite';
    updateMediaSession();
    if ('wakeLock' in navigator) {
        navigator.wakeLock.request('screen');
    }
});

audio.addEventListener('pause', () => {
    isPlaying = false;
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    document.querySelector('.album-art').style.animation = '';
});

function changeSong(direction) {
    currentSongIndex = (currentSongIndex + direction + songs.length) % songs.length;
    loadSong(currentSongIndex);
    if (isPlaying) audio.play();
}

function toggleShuffle() {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
}

function toggleRepeat() {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active', isRepeat);
}

function handleSongEnd() {
    if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
    } else {
        changeSong(1);
    }
}

// Touch Gesture Handling
function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}

function handleTouchEnd(e) {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX;
