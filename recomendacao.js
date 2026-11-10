const CHAVE_PERFIL = "shopshoes_perfil";
const CHAVE_CONSENTIMENTO = "shopshoes_consentimento";
const PESOS = { uso: 3, estilo: 3, cor: 2, marca: 2, faixa_preco: 1 };
const MAX_VISTOS = 20;

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

function valorCampo(p, campo) {
  return campo === "cor" ? String(p.cor).split(" ")[0] : String(p[campo]);
}

function lerConsentimento() {
  try { return localStorage.getItem(CHAVE_CONSENTIMENTO); } catch (e) { return null; }
}

function limparPerfil() {
  try { localStorage.removeItem(CHAVE_PERFIL); } catch (e) {}
}

function salvarConsentimento(valor) {
  try { localStorage.setItem(CHAVE_CONSENTIMENTO, valor); } catch (e) {}
  if (valor !== "sim") limparPerfil();
}

function lerPerfil() {
  const vazio = { vistos: [], afinidade: {} };
  try {
    const bruto = JSON.parse(localStorage.getItem(CHAVE_PERFIL));
    if (!bruto || !Array.isArray(bruto.vistos)) return vazio;
    const vistos = bruto.vistos.filter(v => typeof v === "string").slice(0, MAX_VISTOS);
    const afinidade = {};
    for (const [k, v] of Object.entries(bruto.afinidade || {})) {
      if (Number.isFinite(v) && v > 0) afinidade[k] = v;
    }
    return { vistos, afinidade };
  } catch (e) {
    return vazio;
  }
}

function registrarVisualizacao(p) {
  if (lerConsentimento() !== "sim") return;
  const perfil = lerPerfil();
  perfil.vistos = [p.id, ...perfil.vistos.filter(v => v !== p.id)].slice(0, MAX_VISTOS);
  for (const campo of Object.keys(PESOS)) {
    const chave = campo + ":" + valorCampo(p, campo);
    perfil.afinidade[chave] = (perfil.afinidade[chave] || 0) + 1;
  }
  try { localStorage.setItem(CHAVE_PERFIL, JSON.stringify(perfil)); } catch (e) {}
}

function pontosAfinidade(p, perfil) {
  let total = 0;
  for (const [campo, peso] of Object.entries(PESOS)) {
    total += peso * (perfil.afinidade[campo + ":" + valorCampo(p, campo)] || 0);
  }
  return total;
}

function pontosSimilaridade(p, base) {
  let total = 0;
  for (const [campo, peso] of Object.entries(PESOS)) {
    if (valorCampo(p, campo) === valorCampo(base, campo)) total += peso;
  }
  return total;
}

function ordenar(lista, pontos, limite) {
  return lista
    .map(p => ({ p, s: pontos(p) }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s || a.p.id.localeCompare(b.p.id))
    .slice(0, limite)
    .map(x => x.p);
}

function recomendarParecidos(produtos, base, limite = 4) {
  const perfil = lerConsentimento() === "sim" ? lerPerfil() : { vistos: [], afinidade: {} };
  return ordenar(
    produtos.filter(p => p.id !== base.id),
    p => pontosSimilaridade(p, base) * 10 + pontosAfinidade(p, perfil),
    limite
  );
}

function recomendarParaVoce(produtos, limite = 4) {
  if (lerConsentimento() !== "sim") return [];
  const perfil = lerPerfil();
  if (perfil.vistos.length === 0) return [];
  return ordenar(
    produtos.filter(p => !perfil.vistos.includes(p.id)),
    p => pontosAfinidade(p, perfil),
    limite
  );
}

function criarAviso(aoDecidir) {
  const caixa = document.createElement("div");
  caixa.className = "aviso-privacidade";
  caixa.setAttribute("role", "dialog");
  const texto = document.createElement("p");
  texto.textContent = "Para sugerir tênis parecidos com os que você viu, guardamos essa informação só no seu navegador. Nada é enviado a nenhum servidor. ";
  const link = document.createElement("a");
  link.href = "privacidade.html";
  link.textContent = "Saiba mais";
  texto.append(link);
  const aceitar = document.createElement("button");
  aceitar.className = "botao";
  aceitar.textContent = "Aceitar";
  const recusar = document.createElement("button");
  recusar.className = "filtro";
  recusar.textContent = "Recusar";
  const decidir = valor => {
    salvarConsentimento(valor);
    caixa.remove();
    aoDecidir();
  };
  aceitar.addEventListener("click", () => decidir("sim"));
  recusar.addEventListener("click", () => decidir("nao"));
  caixa.append(texto, aceitar, recusar);
  document.body.append(caixa);
}

function iniciarPrivacidade(aoDecidir) {
  if (lerConsentimento() === null) criarAviso(aoDecidir);
  const rodape = document.querySelector("footer");
  if (rodape) {
    const btn = document.createElement("button");
    btn.className = "link";
    btn.textContent = "Preferências de privacidade";
    btn.addEventListener("click", () => {
      if (!document.querySelector(".aviso-privacidade")) criarAviso(aoDecidir);
    });
    rodape.append(" · ", btn);
  }
}
