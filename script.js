let currentDate = new Date();
let shows = {};
let selectedDay = null;
let selectedShowIndex = null;
let currentLanguage = 'ENG'; // Default to English
let selectedColor = '#FFFFFF'; // Default color

const languages = {
    'ENG': {
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    'FIN': {
        monthNames: ['Tammikuu', 'Helmikuu', 'Maaliskuu', 'Huhtikuu', 'Toukokuu', 'Kesäkuu', 'Heinäkuu', 'Elokuu', 'Syyskuu', 'Lokakuu', 'Marraskuu', 'Joulukuu'],
        days: ['Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai', 'Sunnuntai']
    }
};

function renderCalendar() {
    const calendarDiv = document.getElementById('calendar');
    calendarDiv.innerHTML = '';

    // Using the current language to get month and day names
    const monthNames = languages[currentLanguage].monthNames;
    document.getElementById('currentMonthYear').innerText = monthNames[currentDate.getMonth()] + " " + currentDate.getFullYear();

    const days = languages[currentLanguage].days;

    // Create headers
    days.forEach(day => {
        const header = document.createElement('div');
        header.innerText = day;
        calendarDiv.appendChild(header);
    });

    // Get the day of the week on which the month starts. Adjust it to make Monday = 0 and Sunday = 6
    let firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    firstDayOfMonth = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;

    // Render empty boxes for the days before the first of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDiv = document.createElement('div');
        calendarDiv.appendChild(emptyDiv);
    }

    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    for (let i = 1; i <= lastDay; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.id = 'day-' + i;
        dayDiv.innerText = i;
        dayDiv.onclick = () => openDetails(i);
        calendarDiv.appendChild(dayDiv);

        if (shows[i]) {
            shows[i].forEach(show => {
                const showDiv = document.createElement('div');
                showDiv.innerHTML = show.name + ' (' + show.start + ' - ' + show.end + ')';
                showDiv.style.background = show.color;
                dayDiv.appendChild(showDiv);
            });
        }
    }
    // Fetching and clearing the side panel
    const sidePanel = document.querySelector('.side-panel');
    sidePanel.innerHTML = ''; 

    // If there are shows today, display them
    const todaysShows = shows[new Date().getDate()];
    if (todaysShows) {
        todaysShows.forEach(show => {
            const showDiv = document.createElement('div');
            showDiv.innerHTML = `
                <strong>${show.name}</strong> 
                (${show.start} - ${show.end})
                <p>${show.info}</p>
            `;
            showDiv.style.background = show.color;
            sidePanel.appendChild(showDiv);
        });
    } else {
        sidePanel.innerHTML = "<p>No shows today.</p>";
    }
}

function openDetails(day) {
    selectedDay = day;
    selectedShowIndex = null; // Reset the selected show index

    // Add backdrop to the body
    const backdrop = document.createElement('div');
    backdrop.classList.add('modal-backdrop');
    document.body.appendChild(backdrop);
    
    // Display the modal
    document.getElementById('showDetails').style.display = 'block';

    // Show existing shows for the day
    const existingShowsDiv = document.getElementById('existingShows');
    existingShowsDiv.innerHTML = '';

    if (shows[selectedDay]) {
        shows[selectedDay].forEach((show, index) => {
            const showDiv = document.createElement('div');
            showDiv.innerHTML = show.name + ' (' + show.start + ' - ' + show.end + ')';
            showDiv.style.background = show.color;
            showDiv.onclick = () => editShow(index);
            existingShowsDiv.appendChild(showDiv);
        });
    }

    // Clear input fields
    document.getElementById('startTime').value = '';
    document.getElementById('endTime').value = '';
    document.getElementById('showName').value = '';
    document.getElementById('additionalInfo').value = '';
    document.getElementById('colorPicker').value = '#FFFFFF'; // Default color
}

function closeDetails() {
    // Hide the modal
    document.getElementById('showDetails').style.display = 'none';

    // Remove the backdrop
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
        document.body.removeChild(backdrop);
    }
}

function setColor(color) {
    selectedColor = color;

    // Optionally: add some visual indication that a color is selected.
    // For simplicity, we'll just change the border of the clicked color to black
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        if (option.style.backgroundColor === color) {
            option.style.border = '2px solid black';
        } else {
            option.style.border = '1px solid #ccc';
        }
    });
}

function editShow(index) {
    selectedShowIndex = index;
    const show = shows[selectedDay][index];
    
    document.getElementById('startTime').value = show.start;
    document.getElementById('endTime').value = show.end;
    document.getElementById('showName').value = show.name;
    document.getElementById('additionalInfo').value = show.info;
    document.getElementById('colorPicker').value = show.color;
}

function addOrEditShow() {
    const show = {
        start: document.getElementById('startTime').value,
        end: document.getElementById('endTime').value,
        name: document.getElementById('showName').value,
        info: document.getElementById('additionalInfo').value,
        color: document.getElementById('colorPicker').value,
        color: selectedColor
    };

    if (!shows[selectedDay]) {
        shows[selectedDay] = [];
    }

    if (selectedShowIndex !== null) {
        shows[selectedDay][selectedShowIndex] = show; // Edit existing
    } else {
        shows[selectedDay].push(show); // Add new
    }

    renderCalendar();
    closeDetails(); // Hide the modal after saving
}

function deleteShow() {
    if (selectedShowIndex !== null) {
        shows[selectedDay].splice(selectedShowIndex, 1);
        selectedShowIndex = null; // Reset after deletion
        renderCalendar();
        closeDetails(); // Hide the modal after saving
    }
}

function changeMonth(delta) {
    currentDate.setMonth(currentDate.getMonth() + delta);
    renderCalendar();
}

function changeLanguage(lang) {
    currentLanguage = lang;
    renderCalendar(); // Re-render to reflect the language change
}

renderCalendar();
