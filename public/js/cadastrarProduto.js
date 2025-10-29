    document.getElementById("formProduto").addEventListener("submit", async (e) => {
      e.preventDefault()

      //**************************selecionar elementos**************************//
      const nome = document.getElementById('produto').value;
      const descricao = document.getElementById('descricao').value;
      const valor = document.getElementById('valor').value;
      const estoque = document.getElementById('estoque').value;
      const imagem = document.getElementById('imagem');
      const btn = document.getElementById('btnEnviar');

      const previewWrapper = document.getElementById("previewWrapper");
      const previewImg = document.getElementById("previewImg");
      const fileInfo = document.getElementById("fileInfo");
      const status = document.getElementById("status");
      const loading = document.getElementById("loading");
      /********************************************************************** */

      btn.style.display = "none";

      // Preview
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImg.src = e.target.result;
        fileInfo.textContent = `${imagem.name} — ${(imagem.size / 1024 / 1024).toFixed(2)} MB`;
        previewWrapper.style.display = "flex";
        previewWrapper.style.flexDirection = "column";

      };
      reader.readAsDataURL(imagem.files[0]);

      // Criar FormData
      const fd = new FormData();
      fd.append("produto_produtos", nome);
      fd.append("descricao_produtos", descricao);
      fd.append("valor_produtos", valor);
      fd.append("estoque_produtos", estoque);
      fd.append("imagem_produtos", imagem.files[0]);

      const res = await fetch("https://servidor-sistema-vendas.up.railway.app/produtos", {
        method: "POST",
        body: fd,
      });

      const data = await res.json()

      if (res.ok) {
        status.style.display = "block";
        status.style.color = "green";
        status.textContent = data.message || "Produto cadastrado com sucesso!";
        // Limpar formulário
        document.getElementById("formProduto").reset();
        // Recarregar lista de produtos
        carregarProdutos();
        btn.style.display = "block";
      }
      else {
        status.style.display = "block";
        status.style.color = "red";
        status.textContent = data.message || "Erro ao cadastrar produto";
        btn.style.display = "block"
      }

      // UI de carregamento
      //loading.style.display = "block";
    });
