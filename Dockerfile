FROM docker.io/library/ubuntu:latest AS nestjs

SHELL ["/usr/bin/bash", "-c"]

RUN mkdir -p /opt/app/

WORKDIR /opt/app

USER root

ARG NODE_ENV
ARG GENERIC_TIMEZONE
ARG TZ
ARG LANG

ENV NODE_ENV=$NODE_ENV
ENV GENERIC_TIMEZONE=$GENERIC_TIMEZONE
ENV TZ=$TZ
ENV LANG=$LANG

RUN apt-get update -y
RUN apt-get upgrade -y
RUN apt-get install -y vim net-tools procps curl

RUN curl -fsSL https://deb.nodesource.com/setup_25.x | bash - && \
        apt-get install -y nodejs

COPY ./dist ./dist
COPY ./config ./config
COPY ./package.json ./
COPY ./startService.sh ./
RUN chmod +x ./*.sh
RUN rm /usr/bin/sh
RUN ln -s /usr/bin/bash /usr/bin/sh
RUN npm install --production

EXPOSE 3000
CMD [ "/usr/bin/bash" , "/opt/app/startService.sh" ]
