# Imagen oficial de Playwright que incluye todas las dependencias
FROM mcr.microsoft.com/playwright:v1.44.0-jammy

# Creamos carpeta de trabajo
WORKDIR /app

# Copiamos e instalamos dependencias
COPY package*.json ./
RUN npm install

# Copiamos el resto del código
COPY . .

# Definimos el puerto que expondrá el contenedor
ENV PORT=8080
EXPOSE 8080

# Comando para iniciar el servidor
CMD ["node", "index.js"]
