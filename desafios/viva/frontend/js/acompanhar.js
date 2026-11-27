
// VIVA — Consulta e acompanhamento de registros urbanos

"use strict";

// 1. Elementos da página

const formulario = document.getElementById("form-consulta");
const campoProtocolo = document.getElementById("protocolo");
const botaoConsultar = document.getElementById("btn-consultar");
const mensagem = document.getElementById("consulta-mensagem");
const resultado = document.getElementById("resultado-registro");

const resultadoTitulo = document.getElementById("resultado-titulo");
const resultadoStatus = document.getElementById("resultado-status");
const resultadoData = document.getElementById("resultado-data");
const resultadoDemo = document.getElementById("resultado-demo");
const resultadoCategoria = document.getElementById("resultado-categoria");
const resultadoBairro = document.getElementById("resultado-bairro");
const resultadoDescricao = document.getElementById("resultado-descricao");

const etapas = document.querySelectorAll(".andamento__etapa");

// 2. Configurações

const PADRAO_PROTOCOLO = /^VIVA-\d{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/;

const CATEGORIAS = {
  iluminacao: "Iluminação pública",
  abandono: "Local abandonado",
  policiamento: "Falta de policiamento",
  transporte: "Transporte público",
  mato: "Mato alto",
  outro: "Outro problema urbano"
};

const STATUS = {
  recebido: "Recebido",
  em_analise: "Em análise",
  encaminhado: "Encaminhado",
  concluido: "Concluído"
};

const ORDEM_STATUS = [
  "recebido",
  "em_analise",
  "encaminhado",
  "concluido"
];

let consultando = false;

// 3. Mensagens de retorno

function exibirMensagem(texto, tipo = "") {
  mensagem.textContent = texto;
  mensagem.className = "consulta__mensagem";

  if (tipo) {
    mensagem.classList.add(`consulta__mensagem--${tipo}`);
  }
}

// 4. Estado de carregamento

function definirCarregamento(ativo) {
  consultando = ativo;

  botaoConsultar.disabled = ativo;
  campoProtocolo.readOnly = ativo;

  botaoConsultar.textContent = ativo
    ? "Consultando..."
    : "Consultar";

  formulario.setAttribute("aria-busy", String(ativo));
}

// 5. Formatação da data

function formatarData(valor) {
  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return "Data indisponível";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Recife"
  }).format(data);
}

// 6. Atualização da linha de andamento

function atualizarAndamento(status) {
  const indiceAtual = ORDEM_STATUS.indexOf(status);

  etapas.forEach((etapa) => {
    const indiceEtapa = ORDEM_STATUS.indexOf(
      etapa.dataset.status
    );

    etapa.classList.remove(
      "andamento__etapa--concluida",
      "andamento__etapa--atual"
    );

    etapa.removeAttribute("aria-current");

    if (indiceAtual === -1 || indiceEtapa === -1) {
      return;
    }

    if (indiceEtapa < indiceAtual) {
      etapa.classList.add(
        "andamento__etapa--concluida"
      );
    }

    if (indiceEtapa === indiceAtual) {
      etapa.classList.add(
        "andamento__etapa--atual"
      );

      etapa.setAttribute("aria-current", "step");
    }
  });
}

// 7. Exibição dos dados retornados pela API

function exibirRegistro(registro) {
  resultadoTitulo.textContent = registro.protocolo;

  resultadoStatus.textContent =
    STATUS[registro.status] || "Status indisponível";

  resultadoStatus.dataset.status = registro.status;

  resultadoCategoria.textContent =
    CATEGORIAS[registro.categoria] || "Categoria indisponível";

  resultadoBairro.textContent =
    `${registro.bairro}, Recife — PE`;

  resultadoDescricao.textContent = registro.descricao;

  resultadoData.textContent = formatarData(
    registro.criadoEm
  );

  if (!Number.isNaN(new Date(registro.criadoEm).getTime())) {
    resultadoData.dateTime = registro.criadoEm;
  } else {
    resultadoData.removeAttribute("datetime");
  }

  resultadoDemo.hidden = registro.demonstrativo !== true;

  atualizarAndamento(registro.status);

  resultado.hidden = false;
  resultadoTitulo.focus();
}

// 8. Consulta à API

async function consultarRegistro(evento) {
  evento.preventDefault();

  if (consultando) {
    return;
  }

  const protocolo = campoProtocolo.value
    .trim()
    .toUpperCase();

  campoProtocolo.value = protocolo;

  resultado.hidden = true;
  campoProtocolo.removeAttribute("aria-invalid");

  if (!PADRAO_PROTOCOLO.test(protocolo)) {
    exibirMensagem(
      "Informe um protocolo válido. Exemplo: VIVA-2026-ABCD-2345.",
      "erro"
    );

    campoProtocolo.setAttribute("aria-invalid", "true");
    campoProtocolo.focus();

    return;
  }

  definirCarregamento(true);

  exibirMensagem(
    "Consultando seu registro...",
    "carregando"
  );

  try {
    const resposta = await fetch(
      `/api/registros/${encodeURIComponent(protocolo)}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json"
        },
        signal: AbortSignal.timeout(10000)
      }
    );

    if (resposta.status === 404) {
      exibirMensagem(
        "Protocolo não encontrado. Confira o código e tente novamente.",
        "erro"
      );

      return;
    }

    if (resposta.status === 400) {
      exibirMensagem(
        "O formato do protocolo é inválido.",
        "erro"
      );

      campoProtocolo.setAttribute("aria-invalid", "true");

      return;
    }

    if (!resposta.ok) {
      throw new Error("Falha na consulta.");
    }

    const registro = await resposta.json();

    if (!registro || registro.protocolo !== protocolo) {
      throw new Error("Resposta inválida da API.");
    }

    exibirRegistro(registro);

    exibirMensagem(
      "Registro localizado com sucesso.",
      "sucesso"
    );

  } catch (erro) {
    resultado.hidden = true;

    exibirMensagem(
      "Não foi possível consultar o registro. Verifique sua conexão e tente novamente.",
      "erro"
    );

  } finally {
    definirCarregamento(false);
  }
}

// 9. Eventos da página

formulario.addEventListener(
  "submit",
  consultarRegistro
);

campoProtocolo.addEventListener("input", () => {
  campoProtocolo.value =
    campoProtocolo.value.toUpperCase();

  campoProtocolo.removeAttribute("aria-invalid");

  resultado.hidden = true;

  exibirMensagem("");
});

// Evita manter o resultado visível ao sair da página
window.addEventListener("pagehide", () => {
  resultado.hidden = true;
  campoProtocolo.value = "";
  exibirMensagem("");
});
