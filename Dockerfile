FROM alpine:3.16

COPY ./ /opt
WORKDIR /opt

RUN apk add --no-cache --update --upgrade nodejs yarn curl

RUN yarn install --production=false && \
    yarn eslint . && \
    yarn test && \
    yarn install --production && \
    yarn cache clean

CMD yarn serve