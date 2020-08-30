import http from 'http';
import koa from 'koa';
import cors from '@koa/cors';
import noTrailingSlash from 'koa-no-trailing-slash';
import body from 'koa-body';
import json from 'koa-better-json';
import log from 'koa-better-log';
import nanoid from 'nano-id';
import asyncStorage from './asyncStorage.js';
import router from './router.js';

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
    // if error was not properly handled do no leak the error to client but log the stacktrace
    if (!error.http_code) {
      console.error(error);
      ctx.status = error.http_code || 500;
      ctx.body = 'Internal server error.';
    } else {
      ctx.set({ 'Content-type': 'application/json; charset=utf-8' });
      ctx.status = error.http_code;
      ctx.body = error.message;
    }
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

const server = http.createServer(app.callback());

if (process.env.NODE_ENV !== 'test')
  server.listen(process.env.PORT, (error) => (error ? console.error(error) : console.info(`Listening on port ${process.env.PORT}`)));

export default server;
