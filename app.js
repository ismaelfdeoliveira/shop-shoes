const NOME_LOJA = "Shop Shoes";
const CATEGORIAS = { corrida: "Corrida", casual: "Casual", retro: "Retrô", street: "Street" };
let produtos = [];

function moeda(v) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function criarCard(p) {
  const a = document.createElement("a");
  a.className = "card";
  a.href = "produto.html?id=" + encodeURIComponent(p.id);
  const img = document.createElement("img");
  img.src = p.imagem;
  img.alt = p.nome;
  img.loading = "lazy";
  const nome = document.createElement("h3");
  nome.textContent = p.nome;
  const preco = document.createElement("p");
  preco.textContent = moeda(p.preco);
  a.append(img, nome, preco);
  return a;
}

function mostrar(cat) {
  const grade = document.getElementById("grade");
  grade.replaceChildren();
  const lista = cat === "todos" ? produtos : produtos.filter(p => p.categoria === cat);
  lista.forEach(p => grade.append(criarCard(p)));
  document.getElementById("titulo-catalogo").textContent =
    cat === "todos" ? "Todos os tênis" : "Tênis " + CATEGORIAS[cat];
  document.querySelectorAll("nav [data-filtro]").forEach(b =>
    b.classList.toggle("ativo", b.dataset.filtro === cat));
}

async function iniciar() {
  document.title = NOME_LOJA;
  const resposta = await fetch("catalogo.json");
  produtos = await resposta.json();
  document.querySelectorAll("[data-filtro]").forEach(b =>
    b.addEventListener("click", () => {
      mostrar(b.dataset.filtro);
      document.getElementById("catalogo").scrollIntoView({ behavior: "smooth" });
    }));
  mostrar("todos");
}

iniciar();
