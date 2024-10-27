# Etapa de compilación
FROM node:18 AS build
WORKDIR /app

# Copia los archivos de configuración de dependencias y instala las dependencias
COPY package*.json ./
RUN npm install
COPY . .

# Compila el proyecto Angular
RUN npm run build --prod

# Etapa de despliegue
FROM nginx:alpine

# Copia los archivos construidos a la ubicación de Nginx
COPY --from=build /app/dist/arrienda-front /usr/share/nginx/html

# Copia el archivo de configuración de Nginx personalizado
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expone el puerto 80 para el servidor Nginx
EXPOSE 80

# Inicia el servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
