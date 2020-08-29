# webapp-be

A webapp starter-kit leveraging the best technologies available until 2021 and embracing the KISS principle.  

Stack:
- nodejs v14
- postgres v13
- docker v19

## Requirements
- node v12: `brew install nvm && nvm install 12 && nvm use 12`
- docker v19, docker-compose v1.24: `brew cask install docker`

## Development
Start environment for full-stack development:
```bash
yarn install
NODE_ENV=development yarn docker:compose --build db
NODE_ENV=development yarn serve
```

Access api at: <http://localhost/api/namespace/endpoint>.  

Access database with: 
```bash
PGUSER=root PGPASSWORD=root psql -h 127.0.0.1 webapp
```

To have full staging or production environment locally:
```bash
NODE_ENV=staging IMAGE=webapp PGUSER=root PGPASSWORD=root PGDATABASE=webapp docker-compose up
```

## Deployment

CI deployments are powered by GitHub actions.  
Configure CentOS v7 droplets for staging/production following: <https://gist.github.com/damianobarbati/e299a8a006b357b118fae1d8a12c9c88>.

Generate a deploy key (customize the keypair and secret name accordingly to environment):
- generate a RSA keypair on server: `ssh-keygen -t rsa -b 4096 -q -P "" -C staging.damianobarbati.com`
- allow public key to login: `cat ~/.ssh/id_rsa.pub >> authorized_keys`
- add private key content `cat ~/.ssh/id_rsa` into repository secrets with label `staging_pem` 

"docker:test": "DOCKER_BUILDKIT=1 docker build --tag $npm_package_name --force-rm --build-arg NODE_ENV=production .",
"docker:build": "NAME=$npm_package_name VERSION=$npm_package_version env `cat .env.$NODE_ENV` COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose build --compress --force-rm --no-cache --pull",
"docker:push": "NAME=$npm_package_name VERSION=$npm_package_version env `cat .env.$NODE_ENV` COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose push",
"docker:pull": "NAME=$npm_package_name VERSION=$npm_package_version env `cat .env.$NODE_ENV` COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose pull",
"docker:compose": "NAME=$npm_package_name VERSION=$npm_package_version env `cat .env.$NODE_ENV` COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose up --force-recreate --always-recreate-deps --renew-anon-volumes --remove-orphans"
