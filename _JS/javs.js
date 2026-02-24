const searchInput = document.getElementById('search');

searchInput.addEventListener('input', (event) => {
    const value = formatString(event.target.value);

    const itens = document.querySelectorAll('.itens .item');
    const noResults = document.getElementById('no_results');

    let hasResults = false;

    if (value !== '') {
        itens.forEach(item => {
            const itemTitle = item.querySelector('.item-title')?.textContent || '';
            const itemDescription = item.querySelector('.item-description')?.textContent || '';

            if (
                formatString(itemTitle).indexOf(value) !== -1 ||
                formatString(itemDescription).indexOf(value) !== -1
            ) {
                item.style.display = 'flex';
                hasResults = true;
            } else {
                item.style.display = 'none';
            }
        });

        noResults.style.display = hasResults ? 'none' : 'block';
    } else {
        itens.forEach(item => {
            item.style.display = 'flex';
        });
        noResults.style.display = 'none';
    }
});

function formatString(value) {
    return value
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, ''); // Remove acentos
}

    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('menu-toggle');
    const overlay = document.getElementById('overlay');
    toggle.addEventListener('click', ()=>{
      sidebar.classList.toggle('open');
      overlay.classList.toggle('show');
    });
    overlay.addEventListener('click', ()=>{sidebar.classList.remove('open');overlay.classList.remove('show')});
 
    // Adiciona classe active ao clicar
    document.querySelectorAll('.menu a').forEach(a=>{
      a.addEventListener('click', (e)=>{
        document.querySelectorAll('.menu a').forEach(x=>x.classList.remove('active'));
        a.classList.add('active');
      })
    });