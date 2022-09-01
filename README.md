# webapp-be

Starter kit for backend of web applications.

## Development

Set variables in [.env](.env) file then start development environment:
```sh
nvm install
yarn install
yarn serve
```

**Development database**

Load environment variables:
```sh
source .env
```

Start database:
```sh
docker run --name ${PG_DATABASE:?}-db \
  --restart=always -d \
  -e POSTGRES_USER=${PG_USER:?} \
  -e POSTGRES_PASSWORD=${PG_PASSWORD:?} \
  -e POSTGRES_DB=${PG_DATABASE:?} \
  -e POSTGRES_OPTIONS="-c log_statement=all" \
  -p 5432:5432 \
  postgres:14-alpine
```

Connect to database:
```sh
docker exec -ti ${PG_DATABASE:?}-db psql ${DB_URI:?}
```

Import schema:
```sh
cat database/0-funcs.sql database/1-schema.sql | docker exec -i ${PG_DATABASE:?}-db psql ${DB_URI:?}
```

Dump database:
```sh
docker exec -ti \
  -e POSTGRES_USER=${PG_USER:?} \
  -e POSTGRES_PASSWORD=${PG_PASSWORD:?} \
  -e POSTGRES_DB=${PG_DATABASE:?} \
  ${PG_DATABASE:?}-db \
  pg_dump --clean -U ${PG_USER:?} ${PG_DATABASE:?} > database/dump.sql # schema and data
```

## Deployment

CI is powered by GitHub actions ([.github](.github) folder):
- PR on `main` branch are tested but not deployed to any environment
- commits on `main` branch are deployed to staging environment
- tags on `main` branch are deployed to production environment