const NOME_LOJA = "Shop Shoes";
document.title = NOME_LOJA;
document.getElementById("nome-loja").textContent = NOME_LOJA;

async function carregar() {
  const resposta = await fetch("catalogo.json");
  const produtos = await resposta.json();
  const grade = document.getElementById("grade");

  for (const p of produtos) {
    const card = document.createElement("article");
    card.className = "card";

    const img = document.createElement("img");
    img.src = p.imagem;
    img.alt = p.nome;
    img.loading = "lazy";

    const nome = document.createElement("h3");
    nome.textContent = p.nome;

    const preco = document.createElement("p");
    preco.textContent = p.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    card.append(img, nome, preco);
    grade.append(card);
  }
}

carregar();
