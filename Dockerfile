#Stage 1
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json .
COPY yarn*.lock .
RUN yarn install
COPY . .

ARG REVISION
ENV REACT_APP_REVISION $REVISION

RUN yarn build

#Stage 2
FROM nginx:1.19.0

COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*
COPY --from=builder /app/build .
ENTRYPOINT ["nginx", "-g", "daemon off;"]