
// VIVA — Consulta e filtragem dos serviços de apoio

(() => {
  "use strict";

  const CATEGORIAS = {
    policial: {
      rotulo: "Atendimento policial",
      icone: "i-predio"
    },
    psicossocial: {
      rotulo: "Apoio psicológico e social",
      icone: "i-telefone"
    },
    acolhimento: {
      rotulo: "Orientação e acolhimento",
      icone: "i-pin"
    },
    juridico: {
      rotulo: "Assistência jurídica",
      icone: "i-balanca"
    },
    infantojuvenil: {
      rotulo: "Crianças e adolescentes",
      icone: "i-predio"
    }
  };

  const ABRANGENCIAS = {
    municipal: "Recife",
    estadual: "Pernambuco",
    nacional: "Nacional"
  };

  const lista = document.getElementById("lista-servicos");
  const busca = document.getElementById("busca-servicos");
  const contador = document.getElementById("contador-servicos");
  const filtros = document.querySelectorAll(".servicos-filtro");
  const limpar = document.getElementById("limpar-filtros");
  const estado = document.getElementById("estado-servicos");
  const mensagem = document.getElementById("mensagem-servicos");
  const tentarNovamente = document.getElementById("tentar-novamente");

  let servicos = [];
  let categoriaAtual = "todos";
  let carregado = false;

  function normalizar(texto) {
    return String(texto ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function criarElemento(tag, classe, texto) {
    const elemento = document.createElement(tag);

    if (classe) {
      elemento.className = classe;
    }

    if (texto !== undefined) {
      elemento.textContent = texto;
    }

    return elemento;
  }

  function criarIcone(nome) {
    const ns = "http://www.w3.org/2000/svg";

    const svg = document.createElementNS(ns, "svg");
    const use = document.createElementNS(ns, "use");

    svg.setAttribute("class", "icone");
    svg.setAttribute("aria-hidden", "true");

    use.setAttribute("href", `#${nome}`);

    svg.appendChild(use);

    return svg;
  }

  function adicionarDado(dados, rotulo, valor) {
    if (!valor) return;

    dados.append(
      criarElemento("dt", "", rotulo),
      criarElemento("dd", "", valor)
    );
  }

  function criarLinkFonte(url) {
    try {
      const destino = new URL(url);

      if (destino.protocol !== "https:") {
        return null;
      }

      const link = criarElemento(
        "a",
        "servico-card__fonte",
        "Consultar fonte oficial"
      );

      link.href = destino.href;
      link.appendChild(criarIcone("i-seta"));

      return link;

    } catch {
      return null;
    }
  }

  function criarCard(servico) {
    const categoria = CATEGORIAS[servico.categoria] ?? {
      rotulo: "Serviço de apoio",
      icone: "i-predio"
    };

    const card = criarElemento("article", "servico-card");

    const topo = criarElemento("div", "servico-card__topo");
    const icone = criarElemento("span", "servico-card__icone");

    icone.appendChild(criarIcone(categoria.icone));

    topo.append(
      icone,
      criarElemento(
        "span",
        "servico-card__categoria",
        categoria.rotulo
      )
    );

    const titulo = criarElemento("h3", "", servico.nome);

    const descricao = criarElemento(
      "p",
      "servico-card__descricao",
      servico.descricao
    );

    const dados = criarElemento("dl", "servico-card__dados");

    adicionarDado(
      dados,
      "Abrangência",
      ABRANGENCIAS[servico.abrangencia]
    );

    adicionarDado(dados, "Bairro", servico.bairro);

    if (servico.endereco) {
      adicionarDado(dados, "Endereço", servico.endereco);
    } else if (servico.abrangencia !== "nacional") {
      adicionarDado(
        dados,
        "Endereço",
        "Consulte a fonte oficial."
      );
    }

    adicionarDado(dados, "Telefone", servico.telefone);
    adicionarDado(dados, "WhatsApp", servico.whatsapp);

    adicionarDado(
      dados,
      "Horário",
      servico.horario || "Consulte a fonte oficial."
    );

    const rodape = criarElemento(
      "div",
      "servico-card__rodape"
    );

    if (servico.fonteUrl) {
      const fonte = criarLinkFonte(servico.fonteUrl);

      if (fonte) {
        rodape.appendChild(fonte);
      }
    }

    card.append(topo, titulo, descricao, dados, rodape);

    return card;
  }

  function mostrarEstado(texto, permitirNovaTentativa = false) {
    mensagem.textContent = texto;
    estado.hidden = false;
    tentarNovamente.hidden = !permitirNovaTentativa;
  }

  function ocultarEstado() {
    estado.hidden = true;
    tentarNovamente.hidden = true;
  }

  function renderizar() {
    if (!carregado) return;

    const termo = normalizar(busca.value);

    const resultados = servicos.filter((servico) => {
      const categoriaCorreta =
        categoriaAtual === "todos" ||
        servico.categoria === categoriaAtual;

      const texto = normalizar([
        servico.nome,
        servico.bairro,
        servico.endereco,
        servico.descricao,
        CATEGORIAS[servico.categoria]?.rotulo,
        ABRANGENCIAS[servico.abrangencia]
      ].join(" "));

      return categoriaCorreta && texto.includes(termo);
    });

    lista.replaceChildren();
    ocultarEstado();

    contador.textContent =
      resultados.length === 1
        ? "1 serviço encontrado"
        : `${resultados.length} serviços encontrados`;

    if (resultados.length === 0) {
      mostrarEstado(
        "Nenhum serviço encontrado. Tente outro termo ou limpe os filtros."
      );

      return;
    }

    const fragmento = document.createDocumentFragment();

    resultados.forEach((servico) => {
      fragmento.appendChild(criarCard(servico));
    });

    lista.appendChild(fragmento);
  }

  function selecionarCategoria(categoria) {
    categoriaAtual = categoria;

    filtros.forEach((botao) => {
      botao.setAttribute(
        "aria-pressed",
        String(botao.dataset.categoria === categoria)
      );
    });

    renderizar();
  }

  async function carregarServicos() {
    carregado = false;

    lista.replaceChildren();
    lista.setAttribute("aria-busy", "true");

    contador.textContent = "Carregando serviços...";

    ocultarEstado();

    try {
      const resposta = await fetch("/api/servicos", {
        cache: "no-store"
      });

      if (!resposta.ok) {
        throw new Error("Falha na consulta.");
      }

      const dados = await resposta.json();

      if (!Array.isArray(dados)) {
        throw new Error("Resposta inválida.");
      }

      servicos = dados;
      carregado = true;

      renderizar();

    } catch {
      contador.textContent = "Serviços indisponíveis";

      mostrarEstado(
        "Não foi possível carregar os serviços. Verifique a conexão e tente novamente.",
        true
      );

    } finally {
      lista.setAttribute("aria-busy", "false");
    }
  }

  busca.addEventListener("input", renderizar);

  filtros.forEach((botao) => {
    botao.addEventListener("click", () => {
      selecionarCategoria(botao.dataset.categoria);
    });
  });

  limpar.addEventListener("click", () => {
    busca.value = "";
    selecionarCategoria("todos");
    busca.focus();
  });

  tentarNovamente.addEventListener("click", carregarServicos);

  carregarServicos();

})();
