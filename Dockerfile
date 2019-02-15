FROM node:10

COPY . /usr/src/blog-web
WORKDIR /usr/src/blog-web

RUN npm install
RUN npx webpack -p

CMD ["node", "server.js"]
