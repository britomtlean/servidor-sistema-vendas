
/*************************************
  *      GERENCIAMENTO DE VENDAS
  *************************************/

const tabelaContainer = document.getElementById("tabelaContainer");
const filtroDataInput = document.getElementById("filtroData");
const limparFiltroBtn = document.getElementById("limparFiltro");
const total = document.getElementById('totalPedidos')

let vendas = [];
let ultimaLista = "";
let dataSelecionada = new Date().toLocaleDateString("sv-SE", {
    timeZone: "America/Sao_Paulo",
}); // Data atual no fuso correto

/************** FUNÇÕES DE UTILIDADE **************/
function getDataLocalFormatada(data) {
    // Retorna data no formato yyyy-mm-dd no fuso de São Paulo
    return new Date(data).toLocaleDateString("sv-SE", {
        timeZone: "America/Sao_Paulo",
    });
}

/************** UI **************/

function renderLoading() {
    tabelaContainer.innerHTML = `<div class="loading">Carregando...</div>`;
}

function renderTabela() { //Se não receber nenhuma venda da requisição exibe essa menssagem
    if (!vendas.length) {
        tabelaContainer.innerHTML = `<div class="loading">Nenhuma venda encontrada</div>`;
        return;
    }

    const vendasFiltradas = vendas.filter(v => {
        const dataLocal = getDataLocalFormatada(v.dataOriginal);
        return (
            (!dataSelecionada || dataLocal === dataSelecionada) &&
            (v.status === null || v.status === "")
        );
    });


    if (vendasFiltradas.length === 0) { //Se não retornar nenhuma venda com a data selecionada exibe essa menssagem
        tabelaContainer.innerHTML = `<div class="loading">Nenhuma venda encontrada para esta data</div>`;
        total.innerHTML = ""
        return;
    }

    const tabela = `
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Valor</th>
                <th>Data</th>
                <th>Informações</th>
                <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            ${vendasFiltradas
            .map(
                row => `
            <tr>
              <td>${row.id}</td>
              <td>${parseFloat(row.valorTotal).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                })}</td>
              <td>${row.data}</td>
              <td><a href="/PDF/venda_${row.id}.pdf" target="_blank" style="color:black;">Detalhes</a></td>
              <td>
                ${row.status
                        ? '<span style="color:green;">Concluído</span>'
                        : `<button class="btn" onclick="handleConcluir(${row.id})">Concluir</button>`
                    }
              </td>
            </tr>`
            )
            .join("")}
        </tbody>
    </table>
    `;

    tabelaContainer.innerHTML = tabela;

    total.innerHTML = "Total: "+ vendasFiltradas.reduce((acumulador, array) => {
        return acumulador + (array.valorTotal);
    }, 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    })

    total.style.fontSize = "2.5rem"
    total.style.fontWeight = "bold"
    total.style.padding = "10px 20px"
    total.style.background = "radial-gradient(circle, rgb(230,230,230,0.3), rgb(197,197,197,0.3))";
    total.style.borderRadius = "8px"
}

/************** FETCH **************/

async function carregarVendas() {
    try {
        const res = await fetch(
            "https://servidor-sistema-vendas.up.railway.app/vendas/",
            { method: "GET", headers: { "Content-Type": "application/json" } }
        );

        if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);

        const data = await res.json();

        const novasVendas = data.map(v => ({
            id: v.id_vendas,
            dataOriginal: v.data_vendas,
            data: new Date(v.data_vendas).toLocaleString("pt-BR", {
                timeZone: "America/Sao_Paulo",
            }),
            valorTotal: v.valorTotal_vendas,
            status: v.status,
        }));

        // Só re-renderiza se houve alterações
        const jsonString = JSON.stringify(novasVendas);
        if (jsonString !== ultimaLista) {
            vendas = novasVendas;
            ultimaLista = jsonString;
            renderTabela();
        }

    } catch (err) {
        console.error(err);
        tabelaContainer.innerHTML = `<div class="loading">Erro ao carregar vendas: ${err.message}</div>`;
    }
}

/************** AÇÕES **************/

async function handleConcluir(id) {
    if (!confirm("Deseja marcar esta venda como concluída?")) return;

    try {
        const res = await fetch(
            `https://servidor-sistema-vendas.up.railway.app/vendas/${id}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "concluido" }),
            }
        );

        if (!res.ok) throw new Error("Erro ao concluir venda");

        alert("Venda concluída com sucesso!");
        await carregarVendas();
    } catch (err) {
        alert("Erro: " + err.message);
    }
}

/************** FILTRO **************/

filtroDataInput.addEventListener("change", e => {
    dataSelecionada = e.target.value;
    renderTabela();
});

limparFiltroBtn.addEventListener("click", () => {
    dataSelecionada = ""
    filtroDataInput.value = dataSelecionada;
    renderTabela();
});

/************** INICIALIZAÇÃO **************/

renderLoading();
filtroDataInput.value = dataSelecionada; // Mostra a data atual no input
carregarVendas();

// Atualiza automaticamente a cada 5 segundos
setInterval(carregarVendas, 5000);
