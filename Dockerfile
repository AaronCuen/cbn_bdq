# Stage 1: Build Vite App
FROM node:22 as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with NGINX
FROM nginx:alpine  # Aquí sí alpine porque NGINX no da problemas.

COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
