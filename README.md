# webapp-be

A webapp starter-kit leveraging the best technologies available until 2021 and embracing the KISS principle.  

## Development

Start development environment:
```sh
nvm install
yarn install
yarn serve
```

Before running any command listed down here:
```sh
export $(cat .env.development | grep -v "^#" | xargs)
```

Start database:
```sh
docker run --name box696-db --restart=always -d -e POSTGRES_USER=${PGUSER:?} -e POSTGRES_PASSWORD=${PGPASSWORD:?} -e POSTGRES_DB=${PGDATABASE:?} -p 5432:5432 postgres:13-alpine
```

Import db:
```sh
docker run --rm -it -e PGPASSWORD='box696!' postgres:13-alpine pg_dump --clean -h box696.app -U root box696 > dump.sql # schema and data
docker run --rm -it -e PGPASSWORD='box696!' postgres:13-alpine pg_dump --column-inserts -h box696.app -U root box696 > dump.sql # only data
cat dump.sql | docker exec -i -e PGPASSWORD='box696!' box696-db psql -U root box696
```

Development db:
```sh
pgcli -h 127.0.0.1 box696 -uroot
```

Production db:
```sh
PGPASSWORD='box696!' pgcli -h box696.app box696 -uroot
```

Query from CLI to local db:
```sh
export FINGERPRINT=a40c828b
docker exec -ti -e PGPASSWORD=$PGPASSWORD box696-db psql -h 127.0.0.1 box696 root -c "select 1"
```

## Deployment

Deploy image:
```sh
sh deploy.sh
```

Start database (one time setup):
```sh
docker rm -f box696-db
rm -rf /var/lib/postgresql/data
mkdir -p /var/lib/postgresql/data
chmod -R 0777 ./database
docker rm -f box696-db
env $(cat .env.development | grep -v "^#" | xargs) docker run --name box696-db --restart=always -d -e POSTGRES_USER=${PGUSER:?} -e POSTGRES_PASSWORD=${PGPASSWORD:?} -e POSTGRES_DB=${PGDATABASE:?} -v $(pwd)/database:/docker-entrypoint-initdb.d -v /var/lib/postgresql/data:/var/lib/postgresql/data -p 5432:5432 postgres:13-alpine
```