FROM alpine:3.12

COPY ./ /opt
WORKDIR /opt

RUN apk add --no-cache --update --upgrade nodejs-current yarn curl

RUN yarn install --production=false && \
    yarn audit && \
    yarn eslint . && \
    yarn test && \
    yarn build && \
    yarn install --production && \
    yarn cache clean

CMD yarn serve
