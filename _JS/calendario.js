let currentMonth = new Date().getMonth();

let currentYear = new Date().getFullYear();
 
const monthNames = [

    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",

    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"

];
 
function renderCalendar(month, year) {

    const calendarGrid = document.getElementById('calendarGrid');

    const currentMonthYear = document.getElementById('currentMonthYear');

    calendarGrid.innerHTML = '';

    // Atualiza o título (Mês e Ano)

    currentMonthYear.textContent = `${monthNames[month]} ${year}`;
 
    // Obtém o primeiro dia do mês (0 = domingo, 6 = sábado)

    const firstDay = new Date(year, month, 1).getDay(); 

    // Obtém o número de dias no mês

    const daysInMonth = new Date(year, month + 1, 0).getDate();
 
    // 1. Preencher espaços vazios (dias do mês anterior)

    // O dia da semana (firstDay) - se for 0 (domingo), queremos 6 espaços. 

    // Para simplificar, usamos o valor de firstDay.

    for (let i = 0; i < firstDay; i++) {

        const dayDiv = document.createElement('div');

        dayDiv.classList.add('day', 'other-month');

        // Você pode colocar aqui os últimos dias do mês anterior, mas para simplicidade, deixaremos em branco

        calendarGrid.appendChild(dayDiv);

    }
 
    // 2. Preencher os dias do mês atual

    for (let day = 1; day <= daysInMonth; day++) {

        const dayDiv = document.createElement('div');

        dayDiv.classList.add('day', 'current-month');

        dayDiv.textContent = day;
 
        // Marca o dia atual (hoje)

        const today = new Date();

        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {

            dayDiv.classList.add('today');

        }
 
        calendarGrid.appendChild(dayDiv);

    }

}
 
// Funções de Navegação

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
 
// Inicializar o calendário e adicionar Event Listeners

document.addEventListener('DOMContentLoaded', () => {

    // Renderiza o calendário inicial

    renderCalendar(currentMonth, currentYear);
 
    // Conecta os botões às funções de navegação

    document.getElementById('prevMonth').addEventListener('click', goToPrevMonth);

    document.getElementById('nextMonth').addEventListener('click', goToNextMonth);

});
 