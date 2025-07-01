// Função para carregar tarefas do localStorage ao iniciar a página
window.onload = function () {
    const tarefasSalvas = JSON.parse(localStorage.getItem("tarefas")) || [];
    tarefasSalvas.forEach(tarefa => adicionarTarefaNaLista(tarefa));
};

// Função principal chamada ao adicionar nova tarefa
function novaTarefa() {
    const input = document.getElementById("tarefas");
    const tarefaTexto = input.value.trim();

    if (tarefaTexto !== "") {
        adicionarTarefaNaLista(tarefaTexto);
        salvarTarefa(tarefaTexto);
        input.value = "";
    } else {
        alert("Por favor, adicione uma tarefa.");
    }
}

// Função que adiciona o item visualmente na lista
function adicionarTarefaNaLista(tarefaTexto) {
    const lista = document.getElementById("minhaLista");
    const li = document.createElement("li");

    li.style.display = "flex";
    li.style.alignItems = "center";

    const botao = document.createElement("button");
    const icone = document.createElement("i");
    icone.classList.add("fas", "fa-check");

    botao.style.backgroundColor = "green";
    botao.style.color = "white";
    botao.style.border = "none";
    botao.style.borderRadius = "50%";
    botao.style.width = "30px";
    botao.style.height = "30px";
    botao.style.cursor = "pointer";
    botao.style.display = "flex";
    botao.style.alignItems = "center";
    botao.style.justifyContent = "center";
    botao.style.marginRight = "50px";

    botao.addEventListener("click", function () {
        lista.removeChild(li);
        removerTarefa(tarefaTexto);
    });

    botao.addEventListener('mouseover', () => {
        botao.style.backgroundColor = 'rgb(0, 189, 0)';
        botao.style.color = 'white';
    });

    botao.addEventListener('mouseout', () => {
        botao.style.backgroundColor = 'green';
        botao.style.color = 'white';
    });

    li.textContent = tarefaTexto;
    botao.appendChild(icone);
    li.appendChild(botao);
    lista.appendChild(li);
}

// Salvar tarefa no localStorage
function salvarTarefa(tarefaTexto) {
    const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
    tarefas.push(tarefaTexto);
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

// Remover tarefa do localStorage
function removerTarefa(tarefaTexto) {
    let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
    tarefas = tarefas.filter(tarefa => tarefa !== tarefaTexto);
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}
