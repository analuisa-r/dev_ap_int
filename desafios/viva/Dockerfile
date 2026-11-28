FROM node:26-slim

WORKDIR /app

# Instala só as dependências (camada reaproveitada enquanto o package.json não mudar)
COPY desafios/viva/backend/package.json desafios/viva/backend/package-lock.json backend/
RUN npm ci --omit=dev --prefix backend

# Copia o servidor e o site
COPY desafios/viva/backend backend
COPY desafios/viva/frontend frontend

ENV NODE_ENV=production

CMD ["node", "backend/src/server.js"]