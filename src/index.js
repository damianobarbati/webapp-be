import http from 'http';
import koa from 'koa';
import cors from '@koa/cors';
import noTrailingSlash from 'koa-no-trailing-slash';
import body from 'koa-body';
import json from 'koa-better-json';
import log from 'koa-better-log';
import nanoid from 'nano-id';
import asyncStorage from './asyncStorage.js';
import router, { VERSION_PREFIX } from './router.js';

const app = new koa({ proxy: true });

app.use(cors({ exposeHeaders: ['x-api-version'] }));
app.use(noTrailingSlash());
app.use(body());
app.use(
  log({
    exclude: (ctx) => ctx.path.endsWith('healthcheck'),
  })
);
app.use(json());

app.use(async (ctx, next) => {
  try {
    const id_transaction = nanoid(10);
    ctx.set({ 'x-version': process.env.npm_package_version, 'x-transaction-id': id_transaction });
    const store = { id_transaction };
    await asyncStorage.run(store, next);
  } catch (error) {
    console.error(error);
    ctx.status = error.http_code || 500;
    ctx.body = error.http_code ? error.message : 'Internal server error.';
  }
});

// always redirect to proper prefix if landing here
app.use(async (ctx, next) => {
  if (ctx.path === '/') {
    ctx.redirect(VERSION_PREFIX);
    return;
  }

  await next();
});

app.use(router.routes());
app.use(router.allowedMethods());

http.createServer(app.callback()).listen(process.env.PORT, (error) => (error ? console.error(error) : console.info(`listening on port ${process.env.PORT}`)));
