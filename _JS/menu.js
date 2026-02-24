// Toggle simples para telas pequenas
    const sidebar = document.getElementById('sidebar'); //sidebar: pega o elemento com id="sidebar" (provavelmente o menu lateral).
    //const toggle = document.getElementById('menu-toggle');// pega o botão ou ícone com id="menu-toggle" (usado para abrir/fechar o menu).
    const overlay = document.getElementById('overlay');//overlay: pega o elemento com id="overlay" (a camada escura que aparece sobre o conteúdo quando o menu está aberto).
    
    //Este pedaço esta comentado devido a realizar bertra e fechamento do menu lateral esquerdo
    //toggle.addEventListener('click', ()=>{ //addEventListener('click', ...): escuta o clique no botão.
      //sidebar.classList.toggle('open'); //sidebar.classList.toggle('open'): adiciona ou remove a classe open no menu lateral (abre ou fecha).
     // overlay.classList.toggle('show'); //overlay.classList.toggle('show'): adiciona ou remove a classe show na camada overlay (mostra ou esconde).
    //});
    //overlay.addEventListener('click', ()=>{
      //sidebar.classList.remove('open'); //open do sidebar → fecha o menu.
      //overlay.classList.remove('show')}); //show do overlay → esconde a camada.
 
    // Adiciona classe active ao clicar
    document.querySelectorAll('.menu a').forEach(a=>{
      a.addEventListener('click', (e)=>{
        document.querySelectorAll('.menu a').forEach(x=>x.classList.remove('active'));
        a.classList.add('active');
      })
    });