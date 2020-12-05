# webapp-be

A webapp backend starter-kit leveraging nodejs, postgres and docker.  

## Requirements
- node: `brew install nvm && nvm install < .nvmrc && nvm use < .nvmrc`
- docker, docker-compose: `brew cask install docker`

## Development
Start development environment:
```bash
yarn install
NODE_ENV=development yarn docker:compose --build db
NODE_ENV=development yarn serve
```

Routes defined in `src/index.js`:
```bash
curl -v -k http://localhost/api/user/signUp -d "email=$RANDOM@gmail.com" -d 'password=p4ssw0rd'
curl -v -k http://localhost/api/user/success -d 'hello=world'
curl -v -k http://localhost/api/user/failure
```

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
