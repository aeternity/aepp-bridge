# Stage 1
FROM node:18-alpine as react-build
WORKDIR /app
COPY . ./
RUN yarn
RUN yarn build

ARG REVISION
ENV REACT_APP_REVISION $REVISION

# Stage 2 - the production environment
FROM nginx:1.19.0
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=react-build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]