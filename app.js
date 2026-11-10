const NOME_LOJA = "Shop Shoes";
const CATEGORIAS = { corrida: "Corrida", casual: "Casual", retro: "Retrô", street: "Street" };
let produtos = [];

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

function atualizarRecomendados() {
  const secao = document.getElementById("recomendados");
  const grade = document.getElementById("grade-recomendados");
  grade.replaceChildren();
  const lista = recomendarParaVoce(produtos, 4);
  lista.forEach(p => grade.append(criarCard(p)));
  secao.hidden = lista.length === 0;
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
  atualizarRecomendados();
  iniciarPrivacidade(atualizarRecomendados);
}

iniciar();
