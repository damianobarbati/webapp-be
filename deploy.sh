#!/bin/sh
set -e
set -x

# args provided
export NODE_ENV=$1
export SKIP_BUILD=$2

# args inferred
export NAME=$(jq -r .name package.json)
export VERSION=$(jq -r .version package.json)
export HASH=$(git rev-parse --short HEAD)
export DOCKERHUB_NS=$(jq -r .dockerhub_namespace package.json)
export DOCKER_HOST_STAGING=$(jq -r .docker_host_staging package.json)
export DOCKER_HOST_PRODUCTION=$(jq -r .docker_host_production package.json)

ssh-keyscan -p 22 -H "$DOCKER_HOST_STAGING" >> ~/.ssh/known_hosts
ssh-keyscan -p 22 -H "$DOCKER_HOST_PRODUCTION" >> ~/.ssh/known_hosts

if [ -z "$SKIP_BUILD" ]; then
    DOCKER_BUILDKIT=1 docker build --force-rm --no-cache --tag "$NAME" .
fi;

if [ -z "$NODE_ENV" ] || [ "$NODE_ENV" = "staging" ]; then
    IMAGE="$DOCKERHUB_NS/$NAME:$VERSION-$HASH"
    docker tag "$NAME" "$IMAGE"
    docker push "$IMAGE"
    DOCKER_HOST="$DOCKER_HOST_STAGING" IMAGE="$IMAGE" NODE_ENV="$NODE_ENV" docker stack deploy --with-registry-auth -c docker-compose."$NODE_ENV".yml "$NAME"
fi;

if [ -z "$NODE_ENV" ] || [ "$NODE_ENV" = "production" ]; then
    IMAGE="$DOCKERHUB_NS/$NAME:$VERSION"
    docker tag "$NAME" "$IMAGE"
    docker push "$IMAGE"
    DOCKER_HOST="$DOCKER_HOST_PRODUCTION" IMAGE="$IMAGE" NODE_ENV="$NODE_ENV" docker stack deploy --with-registry-auth -c docker-compose."$NODE_ENV".yml "$NAME"
fi;
