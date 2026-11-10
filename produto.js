const id = new URLSearchParams(location.search).get("id") || "";

function linha(rotulo, valor) {
  const p = document.createElement("p");
  p.textContent = rotulo + ": " + valor;
  return p;
}

async function iniciar() {
  const alvo = document.getElementById("produto");
  if (!/^[a-z]+-\d{2}$/.test(id)) {
    alvo.textContent = "Produto não encontrado.";
    return;
  }
  const resposta = await fetch("catalogo.json");
  const produtos = await resposta.json();
  const p = produtos.find(x => x.id === id);
  if (!p) {
    alvo.textContent = "Produto não encontrado.";
    return;
  }
  document.title = p.nome + " | Shop Shoes";

  const img = document.createElement("img");
  img.src = p.imagem;
  img.alt = p.nome;

  const info = document.createElement("div");
  const titulo = document.createElement("h1");
  titulo.textContent = p.nome;
  const preco = document.createElement("p");
  preco.className = "preco";
  preco.textContent = moeda(p.preco);

  const aviso = document.createElement("p");
  aviso.id = "aviso";

  const rotuloTam = document.createElement("strong");
  rotuloTam.textContent = "Tamanho";
  const tamanhos = document.createElement("div");
  tamanhos.className = "tamanhos";
  let escolhido = null;
  p.tamanhos.forEach(t => {
    const b = document.createElement("button");
    b.className = "tam";
    b.textContent = t;
    b.addEventListener("click", () => {
      escolhido = t;
      tamanhos.querySelectorAll(".tam").forEach(x => x.classList.remove("escolhido"));
      b.classList.add("escolhido");
      aviso.textContent = "";
    });
    tamanhos.append(b);
  });

  const comprar = document.createElement("button");
  comprar.className = "botao";
  comprar.textContent = "Adicionar ao carrinho";
  comprar.addEventListener("click", () => {
    aviso.classList.remove("ok");
    if (!escolhido) {
      aviso.textContent = "Escolha um tamanho.";
      return;
    }
    if (adicionarAoCarrinho(p.id, escolhido)) {
      aviso.classList.add("ok");
      aviso.textContent = "Adicionado ao carrinho.";
    } else {
      aviso.textContent = "Não foi possível adicionar (carrinho cheio ou armazenamento bloqueado).";
    }
  });

  info.append(
    titulo, preco,
    linha("Marca", p.marca), linha("Categoria", p.categoria),
    linha("Estilo", p.estilo), linha("Cor", p.cor),
    rotuloTam, tamanhos, comprar, aviso
  );
  alvo.append(img, info);

  registrarVisualizacao(p);

  const parecidos = recomendarParecidos(produtos, p, 4);
  if (parecidos.length > 0) {
    const secao = document.createElement("section");
    const h = document.createElement("h2");
    h.textContent = "Você também pode gostar";
    const grade = document.createElement("div");
    grade.className = "grade";
    parecidos.forEach(x => grade.append(criarCard(x)));
    secao.append(h, grade);
    document.querySelector("main").append(secao);
  }

  iniciarPrivacidade(() => registrarVisualizacao(p));
}

iniciar();
