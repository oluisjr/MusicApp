document.addEventListener("DOMContentLoaded", () => {
    const lyricsContent = document.getElementById("lyricsContent");
    const lyrics = localStorage.getItem("currentLyrics");
    lyricsContent.textContent = lyrics;
});
