document.addEventListener("DOMContentLoaded", () => {
    const calendarDays = document.getElementById("calendarDays");
    const selectedMonth = document.getElementById("month");
    const yearDisplay = document.getElementById("year");
    const musicList = document.getElementById("musicList");
    const addMusicButton = document.getElementById("addMusic");
    const prevMonthBtn = document.getElementById("prevMonth");
    const nextMonthBtn = document.getElementById("nextMonth");

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let selectedDay = null;
    let louvores = JSON.parse(localStorage.getItem("louvores")) || {};

    const monthNames = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

    async function getLyrics(artist, song) {
        const url = `https://api.lyrics.ovh/v1/${artist}/${song}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.lyrics) {
                return data.lyrics;
            } else {
                return "Letra não encontrada.";
            }
        } catch (error) {
            console.error("Erro ao buscar a letra:", error);
            return "Erro ao buscar a letra.";
        }
    }

    function renderCalendar() {
        calendarDays.innerHTML = "";
        selectedMonth.textContent = monthNames[currentMonth];
        yearDisplay.textContent = currentYear;

        let firstDay = new Date(currentYear, currentMonth, 1).getDay();
        let totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            let empty = document.createElement("div");
            calendarDays.appendChild(empty);
        }

        for (let day = 1; day <= totalDays; day++) {
            let dayElement = document.createElement("div");
            dayElement.classList.add("day");
            dayElement.textContent = day;

            if (selectedDay === `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`) {
                dayElement.classList.add("selected");
            }

            dayElement.addEventListener("click", (event) => selectDay(event, day));
            calendarDays.appendChild(dayElement);
        }
    }

    function selectDay(event, day) {
        selectedDay = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        document.querySelectorAll(".day").forEach(el => el.classList.remove("selected"));
        event.target.classList.add("selected");
        updateMusicList();
    }

    function updateMusicList() {
        musicList.innerHTML = "";

        if (selectedDay && louvores[selectedDay]) {
            louvores[selectedDay].forEach((music, index) => {
                let li = document.createElement("li");
                li.innerHTML = `
                    ${index + 1}ª - ${music.name} (${music.chord}) 
                    <a href="${music.link}" target="_blank">▶</a> 
                    <button onclick="editMusic('${selectedDay}', ${index})">✏️</button>
                    <button onclick="deleteMusic('${selectedDay}', ${index})">🗑</button>
                    <button onclick="viewLyrics('${selectedDay}', ${index})">📄</button>
                `;
                musicList.appendChild(li);
            });
        }
    }

    window.editMusic = function (date, index) {
        let newName = prompt("Novo nome da música:", louvores[date][index].name);
        let newChord = prompt("Novo tom da música:", louvores[date][index].chord);

        if (newName && newChord) {
            louvores[date][index].name = newName;
            louvores[date][index].chord = newChord;
            louvores[date][index].link = `https://www.youtube.com/results?search_query=${encodeURIComponent(newName)}`;

            localStorage.setItem("louvores", JSON.stringify(louvores));
            updateMusicList();
        }
    };

    window.deleteMusic = function (date, index) {
        louvores[date].splice(index, 1);

        if (louvores[date].length === 0) {
            delete louvores[date];
        }

        localStorage.setItem("louvores", JSON.stringify(louvores));
        updateMusicList();
    };

    window.viewLyrics = function (date, index) {
        alert(louvores[date][index].lyrics);
    };

    addMusicButton.addEventListener("click", async () => {
        if (!selectedDay) {
            alert("Selecione um dia no calendário primeiro!");
            return;
        }

        let musicName = prompt("Nome da música:");
        let artistName = prompt("Nome do artista:");
        let chord = prompt("Tom da música:");

        if (musicName && artistName && chord) {
            try {
                const lyrics = await getLyrics(artistName, musicName);

                if (!louvores[selectedDay]) {
                    louvores[selectedDay] = [];
                }

                louvores[selectedDay].push({ 
                    name: musicName, 
                    link: `https://www.youtube.com/results?search_query=${encodeURIComponent(musicName)}`, 
                    chord: chord, 
                    lyrics: lyrics 
                });

                localStorage.setItem("louvores", JSON.stringify(louvores));
                updateMusicList();
            } catch (error) {
                alert("Erro ao buscar a letra.");
            }
        }
    });

    prevMonthBtn.addEventListener("click", () => {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
        renderCalendar();
    });

    nextMonthBtn.addEventListener("click", () => {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
        renderCalendar();
    });

    renderCalendar();
});
