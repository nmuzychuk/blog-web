#!/bin/bash

curl localhost:8090 | grep "methods" && \
curl localhost:8080 | grep 'ng-app="blog"'
