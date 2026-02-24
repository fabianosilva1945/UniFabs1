/* Função para abrir o menu lateral */
function openNav() {
    document.getElementById("mySidebar").style.width = "200px"; /* Define a largura do menu */
    document.getElementById("main").style.marginLeft = "200px"; /* Empurra o conteúdo principal */
}
 
/* Função para fechar o menu lateral */
function closeNav() {
    document.getElementById("mySidebar").style.width = "0"; /* Fecha o menu */
    document.getElementById("main").style.marginLeft = "0"; /* Traz o conteúdo principal de volta */
}
/* Pega todos os botões de submenu */
var dropdown = document.getElementsByClassName("dropdown-btn");
var i;
 
for (i = 0; i < dropdown.length; i++) {
  dropdown[i].addEventListener("click", function() {
    this.classList.toggle("active"); // Adiciona/remove a classe 'active' ao botão
    /* Pega o container do submenu que está logo após o botão */
    var dropdownContent = this.nextElementSibling;
    if (dropdownContent.style.display === "block") {
      dropdownContent.style.display = "none";
    } else {
      dropdownContent.style.display = "block";
    }
  });
}