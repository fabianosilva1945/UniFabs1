/**

* Calcula os dias restantes para a revisão e aplica a classe de cor ao item.

* * @param {HTMLElement} itemElement - O elemento <li> do item.

*/

function checkItemForReview(itemElement) {

    const dataInclusaoStr = itemElement.getAttribute('data-inclusao');

    const revisaoDias = parseInt(itemElement.getAttribute('data-revisao-dias'));

    // Verifica se os atributos necessários existem

    if (!dataInclusaoStr || isNaN(revisaoDias) || revisaoDias <= 0) {

        // console.warn("Item sem dados de revisão válidos:", itemElement);

        return; 

    }
 
    // Converte a data de inclusão para um objeto Date

    const dataInclusao = new Date(dataInclusaoStr);

    // Calcula a data limite para a revisão

    const dataLimiteRevisao = new Date(dataInclusao);

    dataLimiteRevisao.setDate(dataInclusao.getDate() + revisaoDias);
 
    const hoje = new Date();
 
    // Calcula a diferença em milissegundos

    const diffTime = dataLimiteRevisao.getTime() - hoje.getTime();

    // Converte a diferença para dias

    const diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
 
    // Remove quaisquer classes de status anteriores

    itemElement.classList.remove('status-ok', 'status-atencao', 'status-vencido');
 
    // Lógica de Mudança de Cor (Aviso)

    const DIAS_AVISO_ATENCAO = 30; // Define o período de aviso em dias (ex: 30 dias antes da data limite)
 
    if (diasRestantes <= 0) {

        // 🔴 Revisão Vencida

        itemElement.classList.add('status-vencido');

        // Opcional: Adicionar um título/descrição de alerta visual

        const nomeItem = itemElement.getAttribute('data-item-nome') || 'Este Item';

        itemElement.title = `${nomeItem} está VENCIDO! Necessita de Revisão Imediata.`;

    } else if (diasRestantes <= DIAS_AVISO_ATENCAO) {

        // 🟡 Atenção (Próximo de Vencer)

        itemElement.classList.add('status-atencao');

        const nomeItem = itemElement.getAttribute('data-item-nome') || 'Este Item';

        itemElement.title = `${nomeItem} precisa de Revisão em breve! Faltam ${diasRestantes} dias.`;

    } else {

        // 🟢 Status OK

        itemElement.classList.add('status-ok');

        const nomeItem = itemElement.getAttribute('data-item-nome') || 'Este Item';

        itemElement.title = `${nomeItem} está atualizado. Faltam ${diasRestantes} dias para a próxima revisão.`;

    }

}
 
// Executar a função para todos os itens ao carregar a página

document.addEventListener('DOMContentLoaded', () => {

    const itens = document.querySelectorAll('.item');

    itens.forEach(item => {

        checkItemForReview(item);

    });

});
 