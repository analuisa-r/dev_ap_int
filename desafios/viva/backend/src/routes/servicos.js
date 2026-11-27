
// VIVA — API de serviços de apoio

const express = require("express");
const banco = require("../database/banco");

const router = express.Router();

// Lista os serviços ativos e verificados
router.get("/", (req, res) => {
  const servicos = banco.prepare(`
    SELECT
      id,
      nome,
      categoria,
      bairro,
      endereco,
      telefone,
      whatsapp,
      horario,
      descricao,
      abrangencia,
      fonte_url AS fonteUrl,
      verificado_em AS verificadoEm
    FROM servicos
    WHERE ativo = 1
      AND fonte_url IS NOT NULL
      AND verificado_em IS NOT NULL
    ORDER BY categoria, nome
  `).all();

  res.json(servicos);
});

module.exports = router;
