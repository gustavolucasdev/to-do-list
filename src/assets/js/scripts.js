function novaTarefa() {
    console.log("Chamando função");
    const input = document.getElementById("tarefas");
    const lista = document.getElementById("minhaLista");

    if (input.value.trim() !== "") {
        const li = document.createElement("li");

        // Estilizar o item da lista para usar flexbox
        li.style.display = "flex";
        li.style.alignItems = "center";

        // Criar um botão para remover a tarefa
        const botao = document.createElement("button");

        // Criar um ícone para o botão
        const icone = document.createElement("i");
        icone.classList.add("fas", "fa-check");

        // Estilizando o botão
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
        botao.style.marginLeft = "20px";

        // Adicionar evento de clique ao botão
        botao.addEventListener("click", function () {
            lista.removeChild(li); // Remove o item da lista
        });

        // Definir o texto do item de lista
        li.textContent = input.value;

        // Adicionar o ícone ao botão
        botao.appendChild(icone);
        // Adicionar o botão ao item de lista
        li.appendChild(botao);
        lista.appendChild(li);

        // Limpar o campo de entrada após adicionar
        input.value = "";
    } else {
        alert("Por favor, adicione uma tarefa.");
    }
}
