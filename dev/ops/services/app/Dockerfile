FROM node:18-alpine3.17

ENV DEBIAN_FRONTEND noninteractive

RUN apk update -q && apk add --no-cache \
    curl git nano openssh bash

WORKDIR /var/www

CMD ["bash"]
