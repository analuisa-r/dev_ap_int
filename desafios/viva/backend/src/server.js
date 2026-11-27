// VIVA — servidor (Express)
const path = require("node:path");
const express = require("express");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
const rotasRegistros = require("./routes/registros");
const rotasServicos = require("./routes/servicos");

const app = express();
const PORTA = process.env.PORT || 3000;
const PASTA_FRONTEND = path.join(__dirname, "..", "..", "frontend");

app.disable("x-powered-by");
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        fontSrc: ["'self'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'", "https://viacep.com.br"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: null
      }
    },
    referrerPolicy: {
      policy: "no-referrer"
    }
  })
);
app.use(express.json({ limit: "10kb" }));

// Respostas da API nunca ficam guardadas no cache do navegador
app.use("/api", (req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.get("/api/saude", (req, res) => {
  res.json({ status: "ok", projeto: "VIVA", hora: new Date().toISOString() });
});

// Limita requisições excessivas nas rotas de registros
const limiteRegistros = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    erro: "Muitas solicitações. Tente novamente em alguns minutos."
  }
});

// Limita a criação excessiva de registros
const limiteCriacao = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    erro: "Limite de registros atingido. Tente novamente mais tarde."
  }
});

app.post("/api/registros", limiteCriacao);
app.use("/api/registros", limiteRegistros, rotasRegistros);
app.use("/api/servicos", rotasServicos);
app.use(express.static(PASTA_FRONTEND));

// Qualquer rota de API que não exista
app.use("/api", (req, res) => {
  res.status(404).json({ erro: "Rota não encontrada." });
});

// Tratamento de erros: nunca devolve detalhes internos nem o conteúdo do pedido
app.use((erro, req, res, next) => {
  if (erro.type === "entity.parse.failed") {
    return res.status(400).json({ erro: "JSON inválido." });
  }

  if (erro.type === "entity.too.large") {
    return res.status(413).json({ erro: "Pedido grande demais." });
  }

  console.error("Erro inesperado:", erro.message);
  res.status(500).json({ erro: "Erro interno do servidor." });
});

app.listen(PORTA, () => {
  console.log(`VIVA rodando em http://localhost:${PORTA}`);
});