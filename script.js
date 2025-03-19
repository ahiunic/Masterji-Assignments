document.addEventListener("DOMContentLoaded", function() {
    const emojis = document.querySelectorAll(".emoji");
    const moodHistory = document.getElementById("mood-history");
    const calendar = document.getElementById("calendar");

    function loadMoods(filter = 'all') {
        const moods = JSON.parse(localStorage.getItem("moodTracker")) || {};
        moodHistory.innerHTML = "";
        const now = new Date();
        
        for (const date in moods) {
            let show = false;
            const moodDate = new Date(date);
            if (filter === 'day' && date === now.toISOString().split('T')[0]) show = true;
            if (filter === 'week' && now - moodDate < 7 * 24 * 60 * 60 * 1000) show = true;
            if (filter === 'month' && now.getMonth() === moodDate.getMonth()) show = true;
            if (filter === 'all') show = true;
            
            if (show) {
                moodHistory.innerHTML += `<p><strong>${date}:</strong> ${moods[date]}</p>`;
            }
        }
    }

    function updateCalendar() {
        const moods = JSON.parse(localStorage.getItem("moodTracker")) || {};
        calendar.innerHTML = "";
        
        const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
        for (let i = 1; i <= daysInMonth; i++) {
            let dateStr = new Date(new Date().getFullYear(), new Date().getMonth(), i).toISOString().split('T')[0];
            let mood = moods[dateStr] || "-";
            calendar.innerHTML += `<div class='calendar-cell'>${i}<br>${mood}</div>`;
        }
    }

    emojis.forEach(emoji => {
        emoji.addEventListener("click", function() {
            const mood = this.innerText;
            const today = new Date().toISOString().split('T')[0];
            let moods = JSON.parse(localStorage.getItem("moodTracker")) || {};
            moods[today] = mood;
            localStorage.setItem("moodTracker", JSON.stringify(moods));
            loadMoods();
            updateCalendar();
        });
    });

    window.filterMoods = loadMoods;
    loadMoods();
    updateCalendar();
});