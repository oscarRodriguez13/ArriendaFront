# Etapa de compilación
FROM node:18 AS build
WORKDIR /app

# Copia los archivos de dependencias y las instala
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Etapa de despliegue
FROM nginx:alpine
# Cambia la ruta de la copia para que se ajuste a donde se genera el index.html
COPY --from=build /app/dist/arrienda-front /usr/share/nginx/html

# Expone el puerto 80 para el servidor Nginx
EXPOSE 80

# Inicia el servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
