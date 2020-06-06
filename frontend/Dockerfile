FROM node:alpine AS build
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build --prod

FROM nginx:alpine
COPY --from=build /usr/src/app/dist/MovieBase /usr/share/nginx/html
COPY --from=build /usr/src/app/nginx-custom.config /etc/nginx/conf.d/default.conf
EXPOSE 4200