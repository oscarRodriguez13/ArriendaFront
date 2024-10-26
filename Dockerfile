# Etapa de construcción
FROM node:18.19.0 AS builder

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de la aplicación al contenedor
COPY ./ /app

# Instala las dependencias y construye la aplicación
RUN npm install --legacy-peer-deps \
    && npm install -g @angular/cli \
    && ng build --prod

# Etapa de producción
FROM httpd:2.4

# Copia los archivos construidos de la aplicación
COPY --from=builder /app/dist/adminpro /usr/local/apache2/htdocs/gescon

# Expone el puerto 80 para acceder a la aplicación
EXPOSE 80

# Comando para iniciar Apache
CMD ["httpd", "-D", "FOREGROUND"]
