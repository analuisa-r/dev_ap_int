
-- VIVA — Dados iniciais dos serviços de apoio
-- Consulta às fontes oficiais: 27/11/2026

INSERT INTO servicos (
  nome, categoria, bairro, endereco,
  telefone, whatsapp, horario, descricao,
  abrangencia, fonte_url, verificado_em, ativo
)
VALUES
(
  'Centro de Referência Clarice Lispector',
  'psicossocial',
  'Santo Amaro',
  'Rua Dr. Silva Ferreira, 122',
  '(81) 3355-9495',
  NULL,
  'Todos os dias, 24 horas',
  'Acolhimento e orientação psicológica, social e jurídica para mulheres em situação de violência.',
  'municipal',
  'https://www2.recife.pe.gov.br/pagina/secretaria-da-mulher',
  '2026-11-27',
  1
),
(
  'Centro Sony Santos',
  'psicossocial',
  'Curado',
  'Rodovia BR-101, 485',
  '(81) 2011-0118',
  NULL,
  'Todos os dias, 24 horas',
  'Atendimento multidisciplinar de saúde para pessoas atendidas pelo serviço em situação de violência.',
  'municipal',
  'https://www2.recife.pe.gov.br/pagina/secretaria-da-mulher',
  '2026-11-27',
  1
),
(
  'SER Clarice Lispector - Zona Sul',
  'acolhimento',
  'Areias',
  'Avenida Recife, 700',
  '(81) 3355-9823',
  NULL,
  'Todos os dias, das 7h às 19h',
  'Acolhimento especializado e orientação para mulheres em situação de violência.',
  'municipal',
  'https://www2.recife.pe.gov.br/pagina/secretaria-da-mulher',
  '2026-11-27',
  1
),
(
  'SER Clarice Lispector - Zona Norte',
  'acolhimento',
  'Casa Amarela',
  'Rua Padre Lemos, 675',
  '0800 281 0107',
  NULL,
  'Todos os dias, das 7h às 19h',
  'Atendimento regionalizado às mulheres. Telefone informado corresponde à central Liga Mulher.',
  'municipal',
  'https://www2.recife.pe.gov.br/noticias/31/03/2026/novo-ser-clarice-amplia-atendimento-mulheres-na-zona-norte-do-recife',
  '2026-11-27',
  1
),
(
  'Casa Empodera Mulher',
  'acolhimento',
  'Santo Amaro',
  'Rua Bernardo Guimarães, 470',
  '(81) 3355-3178',
  NULL,
  'Segunda a sexta, das 8h às 17h',
  'Espaço de promoção da autonomia e do fortalecimento das mulheres.',
  'municipal',
  'https://www2.recife.pe.gov.br/pagina/secretaria-da-mulher',
  '2026-11-27',
  1
),
(
  'Ligue 180',
  'acolhimento',
  NULL,
  NULL,
  '180',
  '(61) 9610-0180',
  'Todos os dias, 24 horas',
  'Central gratuita de orientação, informações e encaminhamento de denúncias. Em emergências, ligue 190.',
  'nacional',
  'https://www.gov.br/mulheres/pt-br/ligue180',
  '2026-11-27',
  1
)
ON CONFLICT(nome) DO NOTHING;

-- Complemento da rede de apoio

INSERT INTO servicos (
  nome, categoria, bairro, endereco,
  telefone, whatsapp, horario, descricao,
  abrangencia, fonte_url, verificado_em, ativo
)
VALUES
(
  'Núcleo de Apoio à Mulher - MPPE',
  'acolhimento',
  'Santo Amaro',
  'Av. Visconde de Suassuna, 99, salas B-04/05',
  '(81) 99230-5441',
  NULL,
  NULL,
  'Núcleo de articulação e prevenção da violência doméstica e familiar contra a mulher.',
  'estadual',
  'https://portal.mppe.mp.br/w/n%C3%BAcleo-de-apoio-%C3%A0-mulher-promotora-de-justi%C3%A7a-maria-aparecida-da-silva-clemente-1',
  '2026-11-27',
  1
),
(
  'Conselho Tutelar do Recife - Plantão',
  'infantojuvenil',
  'Boa Vista',
  'Rua Gervásio Pires, 829',
  '(81) 3355-9874 / 3355-9875',
  NULL,
  'Segunda a sexta, das 19h às 7h. Fins de semana e feriados: 24h.',
  'Proteção e garantia dos direitos de crianças e adolescentes.',
  'municipal',
  'https://www2.recife.pe.gov.br/noticias/08/04/2026/conselho-tutelar-do-recife-recebe-novos-aparelhos-de-celular-para-ampliar',
  '2026-11-27',
  1
),
(
  'Disque 100',
  'infantojuvenil',
  NULL,
  NULL,
  '100',
  '(61) 99611-0100',
  'Todos os dias, 24 horas',
  'Canal gratuito de orientação e recebimento de denúncias de violações dos direitos humanos, incluindo crianças e adolescentes.',
  'nacional',
  'https://www.gov.br/mdh/pt-br/assuntos/noticias/2026/defeso-eleitoral/julho/saiba-quando-e-como-acionar-o-disque-100',
  '2026-11-27',
  1
)
ON CONFLICT(nome) DO NOTHING;

-- Complemento final da rede de apoio

INSERT INTO servicos (
  nome, categoria, bairro, endereco,
  telefone, whatsapp, horario, descricao,
  abrangencia, fonte_url, verificado_em, ativo
)
VALUES
(
  '1ª Delegacia Especializada de Atendimento à Mulher - Recife',
  'policial',
  NULL,
  NULL,
  '(81) 3184-3352',
  NULL,
  NULL,
  'Atendimento policial especializado para mulheres em situação de violência. Consulte a fonte oficial para confirmar o endereço antes de se deslocar. Em emergências, ligue 190.',
  'estadual',
  'https://endereco.policiacivil.pe.gov.br/CDT/openform.do?action=openform&formID=21&sys=CDT',
  '2026-11-27',
  1
),
(
  'Ouvidoria da Mulher de Pernambuco',
  'acolhimento',
  NULL,
  NULL,
  '0800 281 8187',
  NULL,
  NULL,
  'Canal de escuta, orientação e encaminhamento de manifestações relacionadas aos direitos das mulheres.',
  'estadual',
  'https://www.ouvidoria.pe.gov.br/?page_id=110',
  '2026-11-27',
  1
),
(
  'NUDEM - Defensoria Pública de Pernambuco',
  'juridico',
  NULL,
  NULL,
  NULL,
  '(81) 99488-3765',
  NULL,
  'Assistência jurídica especializada para mulheres em situação de violência, incluindo orientação sobre medidas protetivas. Atendimento pelo WhatsApp exclusivamente por mensagens.',
  'estadual',
  'https://www.defensoria.pe.def.br/noticias/detalhe/4300/',
  '2026-11-27',
  1
)
ON CONFLICT(nome) DO NOTHING;
