const CHAVE_CARRINHO = "shopshoes_carrinho";
const QTD_MAX = 10;
const ITENS_MAX = 20;

function lerCarrinho() {
  try {
    const bruto = JSON.parse(localStorage.getItem(CHAVE_CARRINHO));
    if (!Array.isArray(bruto)) return [];
    return bruto
      .filter(i => i && typeof i.id === "string" && /^[a-z]+-\d{2}$/.test(i.id)
        && Number.isInteger(i.tamanho) && Number.isInteger(i.qtd)
        && i.qtd >= 1 && i.qtd <= QTD_MAX)
      .slice(0, ITENS_MAX);
  } catch (e) {
    return [];
  }
}

function salvarCarrinho(itens) {
  try {
    localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(itens));
  } catch (e) {
    return false;
  }
  atualizarContador();
  return true;
}

function adicionarAoCarrinho(id, tamanho) {
  const itens = lerCarrinho();
  const existente = itens.find(i => i.id === id && i.tamanho === tamanho);
  if (existente) {
    existente.qtd = Math.min(existente.qtd + 1, QTD_MAX);
  } else if (itens.length < ITENS_MAX) {
    itens.push({ id, tamanho, qtd: 1 });
  } else {
    return false;
  }
  return salvarCarrinho(itens);
}

function alterarQuantidade(id, tamanho, delta) {
  const itens = lerCarrinho();
  const item = itens.find(i => i.id === id && i.tamanho === tamanho);
  if (!item) return;
  item.qtd = Math.max(1, Math.min(item.qtd + delta, QTD_MAX));
  salvarCarrinho(itens);
}

function removerDoCarrinho(id, tamanho) {
  salvarCarrinho(lerCarrinho().filter(i => !(i.id === id && i.tamanho === tamanho)));
}

function totalItens() {
  return lerCarrinho().reduce((soma, i) => soma + i.qtd, 0);
}

function atualizarContador() {
  const el = document.getElementById("link-carrinho");
  if (el) el.textContent = "Carrinho (" + totalItens() + ")";
}

atualizarContador();
