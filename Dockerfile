FROM node:8

RUN npm install -g yarn webpack

COPY . /usr/src/blog-web
WORKDIR /usr/src/blog-web

RUN yarn install
RUN webpack

RUN apt-get update -qq && apt-get install -y nginx

RUN rm -rf /var/www/html/* && \
    cp -r /usr/src/blog-web/public/* /var/www/html
WORKDIR /var/www/html

CMD ["nginx", "-g", "daemon off;"]
