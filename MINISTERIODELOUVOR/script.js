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
                    ${music.name} 
                    <a href="${music.link}" target="_blank">▶</a> 
                    <button onclick="editMusic('${selectedDay}', ${index})">✏️</button>
                    <button onclick="deleteMusic('${selectedDay}', ${index})">🗑</button>
                `;
                musicList.appendChild(li);
            });
        }
    }

    window.editMusic = function (date, index) {
        let newName = prompt("Novo nome da música:", louvores[date][index].name);
        let newLink = prompt("Novo link da música:", louvores[date][index].link);

        if (newName && newLink) {
            louvores[date][index] = { name: newName, link: newLink };
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

    addMusicButton.addEventListener("click", () => {
        if (!selectedDay) {
            alert("Selecione um dia no calendário primeiro!");
            return;
        }

        let musicName = prompt("Nome da música:");
        let musicLink = prompt("Link do YouTube:");

        if (musicName && musicLink) {
            if (!louvores[selectedDay]) {
                louvores[selectedDay] = [];
            }

            louvores[selectedDay].push({ name: musicName, link: musicLink });
            localStorage.setItem("louvores", JSON.stringify(louvores));
            updateMusicList();
        }
    });

    prevMonthBtn.addEventListener("click", () => {
        currentMonth = (currentMonth - 1 + 12) % 12;
        renderCalendar();
    });

    nextMonthBtn.addEventListener("click", () => {
        currentMonth = (currentMonth + 1) % 12;
        renderCalendar();
    });

    renderCalendar();
});
