function botao(texto, rotulo, aoClicar) {
  const b = document.createElement("button");
  b.textContent = texto;
  b.setAttribute("aria-label", rotulo);
  b.addEventListener("click", aoClicar);
  return b;
}

function desenhar(alvo, produtos) {
  alvo.replaceChildren();
  const itens = lerCarrinho().filter(i => produtos.some(p => p.id === i.id));

  if (itens.length === 0) {
    const msg = document.createElement("p");
    msg.textContent = "Seu carrinho está vazio. ";
    const link = document.createElement("a");
    link.href = "index.html";
    link.textContent = "Ver os tênis";
    link.style.textDecoration = "underline";
    msg.append(link);
    alvo.append(msg);
    return;
  }

  let total = 0;
  const redesenhar = () => desenhar(alvo, produtos);

  itens.forEach(i => {
    const p = produtos.find(x => x.id === i.id);
    const subtotal = p.preco * i.qtd;
    total += subtotal;

    const linha = document.createElement("div");
    linha.className = "item";

    const img = document.createElement("img");
    img.src = p.imagem;
    img.alt = p.nome;

    const info = document.createElement("div");
    const nome = document.createElement("h3");
    nome.textContent = p.nome;
    const detalhe = document.createElement("p");
    detalhe.textContent = "Tamanho " + i.tamanho + " · " + moeda(p.preco) + " cada";
    const controles = document.createElement("div");
    controles.className = "controles";
    const qtd = document.createElement("span");
    qtd.textContent = i.qtd;
    controles.append(
      botao("−", "Diminuir quantidade", () => { alterarQuantidade(i.id, i.tamanho, -1); redesenhar(); }),
      qtd,
      botao("+", "Aumentar quantidade", () => { alterarQuantidade(i.id, i.tamanho, 1); redesenhar(); })
    );
    info.append(nome, detalhe, controles);

    const direita = document.createElement("div");
    direita.className = "subtotal";
    const valor = document.createElement("div");
    valor.textContent = moeda(subtotal);
    const remover = document.createElement("button");
    remover.className = "link";
    remover.textContent = "Remover";
    remover.addEventListener("click", () => { removerDoCarrinho(i.id, i.tamanho); redesenhar(); });
    direita.append(valor, remover);

    linha.append(img, info, direita);
    alvo.append(linha);
  });

  const linhaTotal = document.createElement("div");
  linhaTotal.className = "total";
  const rotulo = document.createElement("span");
  rotulo.textContent = "Total";
  const valorTotal = document.createElement("span");
  valorTotal.textContent = moeda(Math.round(total * 100) / 100);
  linhaTotal.append(rotulo, valorTotal);

  const finalizar = document.createElement("button");
  finalizar.className = "botao";
  finalizar.textContent = "Finalizar compra";
  const aviso = document.createElement("p");
  aviso.id = "aviso";
  finalizar.addEventListener("click", () => {
    aviso.textContent = "O pagamento será ativado no próximo passo.";
  });

  alvo.append(linhaTotal, finalizar, aviso);
}

async function iniciar() {
  const alvo = document.getElementById("carrinho");
  const resposta = await fetch("catalogo.json");
  const produtos = await resposta.json();
  desenhar(alvo, produtos);
}

iniciar();
