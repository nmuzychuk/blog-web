# Blog Web
[![Node.js CI](https://github.com/nmuzychuk/blog-web/actions/workflows/node.js.yml/badge.svg)](https://github.com/nmuzychuk/blog-web/actions/workflows/node.js.yml)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/8ac2e162b92f4f61b952c02df288dc8c)](https://www.codacy.com/app/nmuzychuk/blog-web)

## Overview
AngularJS client app for [Blog REST API](https://github.com/nmuzychuk/blog-api)

## Docker
Run blog-web
```
docker build -t blog-web .
docker run -p 8080:80 blog-web
```

## Compose
Run blog-web and blog-api
```
docker-compose up
```

## License
This project is released under the [MIT License](LICENSE.txt)
