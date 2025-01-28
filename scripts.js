document.addEventListener('DOMContentLoaded', () => {
    const loadMusicButton = document.getElementById('load-music');
    const audioInput = document.getElementById('audio-input');
    const songList = document.getElementById('song-list');
    const nowPlayingSection = document.getElementById('now-playing-section');
    const backToListButton = document.getElementById('back-to-list');
    const playPauseButton = document.getElementById('play-pause');
    const prevSongButton = document.getElementById('prev-song');
    const nextSongButton = document.getElementById('next-song');
    const albumArt = document.getElementById('album-art');
    const songTitle = document.getElementById('song-title');
    const songArtist = document.getElementById('song-artist');

    let audioFiles = [];
    let currentIndex = -1;
    let audioElement = new Audio();

    // Load music from device
    loadMusicButton.addEventListener('click', () => {
        audioInput.click();
    });

    audioInput.addEventListener('change', (event) => {
        audioFiles = Array.from(event.target.files);
        displaySongList();
    });

    // Display list of songs
    function displaySongList() {
        songList.innerHTML = '';
        audioFiles.forEach((file, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = file.name;
            listItem.addEventListener('click', () => playSong(index));
            songList.appendChild(listItem);
        });
    }

    // Play selected song
    function playSong(index) {
        currentIndex = index;
        const selected
