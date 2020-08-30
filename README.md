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
export $(cat .env | grep -v "^#" | xargs)
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

## Deployment

CI is powered by GitHub actions ([.github](.github) folder):
- PR on `main` branch are tested but not deployed to any environment
- commits on `main` branch are deployed to staging environment
- tags on `main` branch are deployed to production environment