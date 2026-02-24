let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
 
const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];
 
// --- Funções Auxiliares de Data e Formato ---
 
/**
 * Formats a Date object to the YYYY-MM-DD standard.
 * @param {Date} date - Date object.
 * @returns {string} Formatted date.
 */
function formatDate(date) {
    const y = date.getFullYear();
    // Add 1 to month because it is 0-indexed, then pad with '0'
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}
 
// --- Funções de Lógica de Revisão Automática (Itens do HTML) ---
 
/**
 * Calculates the review due date and the status color.
 */
function calculateReviewData(inclusionDateStr, reviewDays, itemName) {
    if (!inclusionDateStr || isNaN(reviewDays) || reviewDays <= 0) {
        return null;
    }
   
    const dataInclusao = new Date(inclusionDateStr + 'T00:00:00');
    const dataLimiteRevisao = new Date(dataInclusao);
    // Add the number of days to the inclusion date
    dataLimiteRevisao.setDate(dataInclusao.getDate() + reviewDays);
 
    // Calculate status to define marker color
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Normalize 'today' to midnight for accurate comparison
 
    const diffTime = dataLimiteRevisao.getTime() - hoje.getTime();
    // Calculate days remaining (round up to include today)
    const diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
   
    let color = 'bg-green-event'; // Default: OK
    let statusText = 'Normal';
 
    if (diasRestantes <= 0) {
        color = 'bg-red-event'; // Overdue
        statusText = 'URGENTE (VENCIDO)';
    } else if (diasRestantes <= 30) {
        color = 'bg-yellow-event'; // Attention (30 days or less)
        statusText = 'ATENÇÃO (Próximo)';
    }
   
    return {
        date: formatDate(dataLimiteRevisao),
        title: `[REVISÃO]: ${itemName}`,
        description: `Status: ${statusText}. Faltam ${diasRestantes > 0 ? diasRestantes : 0} dias.`,
        color: color,
        source: 'Revisão Automática (HTML Data)'
    };
}
 
/**
 * Loads automatic review events from data- attributes in the HTML.
 * @returns {Array} List of review events.
 */
function loadRevisionEvents() {
    const revisionEvents = [];
    const items = document.querySelectorAll('#revisionItems li');
 
    items.forEach(item => {
        const dataInclusao = item.getAttribute('data-inclusao');
        const revisaoDias = parseInt(item.getAttribute('data-revisao-dias'));
        const nome = item.getAttribute('data-item-nome') || 'Item de Revisão';
        const deveDuplicar = item.getAttribute('data-duplicar-dias') === 'true';
 
        let diasRevisaoTotal = revisaoDias;
        if (deveDuplicar) {
            diasRevisaoTotal = revisaoDias * 2;
        }
 
        const reviewData = calculateReviewData(dataInclusao, diasRevisaoTotal, nome);
       
        if (reviewData) {
            revisionEvents.push(reviewData);
        }
    });
    return revisionEvents;
}
 
 
// --- Lógica de Renderização do Calendário ---
 
function renderCalendar(month, year) {
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthYear = document.getElementById('currentMonthYear');
    calendarGrid.innerHTML = '';
 
    // Update the title (Month and Year)
    currentMonthYear.textContent = `${monthNames[month]} ${year}`;
 
    // Combine all events: currently only automatic ones are implemented
    const allEvents = loadRevisionEvents();
 
    const eventsMap = {}; // Structure: { 'YYYY-MM-DD': [events] }
 
    // Filter and map events for the current month
    allEvents.filter(event => {
        // Use 'T00:00:00' to avoid timezone issues when parsing the date string
        const eventDate = new Date(event.date + 'T00:00:00');
        return eventDate.getMonth() === month && eventDate.getFullYear() === year;
    }).forEach(event => {
        if (!eventsMap[event.date]) {
            eventsMap[event.date] = [];
        }
        eventsMap[event.date].push(event);
    });
   
    // Get the first day of the month (0 = Sunday, 6 = Saturday)
    const firstDay = new Date(year, month, 1).getDay();
    // Get the number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayFormatted = formatDate(new Date());
 
    // 1. Fill empty spaces (days from the previous month)
    for (let i = 0; i < firstDay; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day', 'other-month');
        calendarGrid.appendChild(dayDiv);
    }
 
    // 2. Fill the days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateFormatted = formatDate(date);
 
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day', 'current-month');
        dayDiv.textContent = day;
        dayDiv.dataset.date = dateFormatted; // Store the date for click
 
        // Mark the current day (today)
        if (dateFormatted === todayFormatted) {
            dayDiv.classList.remove('current-month');
            dayDiv.classList.add('today');
        }
 
        // --- NEW: Event Marking and Colors ---
        const eventsOnThisDay = eventsMap[dateFormatted];
        if (eventsOnThisDay && eventsOnThisDay.length > 0) {
            // Choose the most 'urgent' color for the marker
            const markerColor = eventsOnThisDay.some(e => e.color === 'bg-red-event') ? 'bg-red-event' :
                                eventsOnThisDay.some(e => e.color === 'bg-yellow-event') ? 'bg-yellow-event' :
                                'bg-green-event';
 
            const marker = document.createElement('div');
            marker.classList.add('event-marker', markerColor);
            dayDiv.appendChild(marker);
        }
 
        // --- NEW: Add the click listener to open the modal ---
        dayDiv.addEventListener('click', () => handleDayClick(dateFormatted, eventsOnThisDay));
 
        calendarGrid.appendChild(dayDiv);
    }
}
 
// --- Funções de Navegação ---
 
function goToPrevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
}
 
function goToNextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
}
 
// --- Lógica de Clique no Dia (Modal) ---
 
/**
 * Handles the click on a day cell, showing the modal with event details.
 * @param {string} dateFormatted - YYYY-MM-DD date.
 * @param {Array} events - List of events for the clicked day.
 */
function handleDayClick(dateFormatted, events) {
    const modal = document.getElementById('dayDetailModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
 
    modalTitle.textContent = `Eventos em ${dateFormatted}`;
    modalContent.innerHTML = '';
 
    if (events && events.length > 0) {
        events.forEach(event => {
            // Adjust classes for Tailwind styling in the modal
            const colorClass = event.color.replace('bg-', 'text-');
            const borderColorClass = event.color.replace('bg-', 'border-l-');
           
            modalContent.innerHTML += `
                <div class="flex items-start p-3 rounded-md bg-gray-50 border-l-4 ${borderColorClass}">
                    <span class="${colorClass} mr-3 text-xl leading-none font-bold">&bull;</span>
                    <div>
                        <p class="font-semibold text-gray-900">${event.title}</p>
                        <p class="text-xs text-gray-600">${event.description}</p>
                        <p class="text-xs text-gray-400">Fonte: ${event.source}</p>
                    </div>
                </div>
            `;
        });
    } else {
        modalContent.innerHTML = '<p class="text-center italic">Nenhum evento registrado para esta data.</p>';
    }
 
    modal.classList.remove('hidden'); // Show the modal
}
 
/**
 * Hides the detail modal.
 */
function closeModal() {
    document.getElementById('dayDetailModal').classList.add('hidden');
}
 
 
// Inicializar o calendário e adicionar Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Render the initial calendar
    renderCalendar(currentMonth, currentYear);
 
    // Connect the buttons to navigation functions
    document.getElementById('prevMonth').addEventListener('click', goToPrevMonth);
    document.getElementById('nextMonth').addEventListener('click', goToNextMonth);
});
 