# Etapa de compilación
FROM node:16 AS build
WORKDIR /app

# Instala las dependencias y compila el proyecto Angular
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Etapa de despliegue
FROM nginx:alpine
COPY --from=build /app/dist/tu-nombre-de-proyecto /usr/share/nginx/html

# Expone el puerto 80 para el servidor Nginx
EXPOSE 80

# Inicia el servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
