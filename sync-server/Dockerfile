# Imagen oficial de Bun
FROM oven/bun:1-alpine

WORKDIR /app
COPY server.js package.json ./

# Datos persistentes y puerto
ENV PORT=8787
ENV DATA_DIR=/data
VOLUME ["/data"]
EXPOSE 8787

CMD ["bun", "run", "server.js"]
