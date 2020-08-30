FROM alpine:3.15

COPY ./ /opt
WORKDIR /opt

RUN apk add --no-cache --update --upgrade nodejs yarn curl

RUN yarn install --production=false && \
    yarn audit && \
    yarn eslint . && \
    NODE_ENV=development yarn jest && \
    yarn install --production && \
    yarn cache clean

CMD yarn serve
