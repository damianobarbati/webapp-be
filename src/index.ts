import http from 'http';
import koa from 'koa';
import cors from '@koa/cors';
import noTrailingSlash from 'koa-no-trailing-slash';
import body from 'koa-body';
import json from 'koa-better-json';
import accesslog from 'koa-accesslog';
import { nanoid } from 'nanoid';
import asyncStorage from './asyncStorage.js';
import router from './router.js';
import HTTP_Error from './errors.js';

const app = new koa({ proxy: true });

app.use(cors({ exposeHeaders: ['x-api-version'] }));
app.use(noTrailingSlash());
app.use(body());
app.use(accesslog());
app.use(json());

app.use(async (ctx: koa.Context, next) => {
  try {
    const id_transaction = nanoid(10);
    ctx.set({ 'x-version': process.env.npm_package_version, 'x-transaction-id': id_transaction });
    const store = { id_transaction };
    await asyncStorage.run(store, next);
  } catch (error: unknown) {
    // if error was not handled return http info to the client
    if (error instanceof HTTP_Error) {
      ctx.set({ 'Content-type': 'application/json; charset=utf-8' });
      ctx.status = error.http_code;
      ctx.body = error.message;
    }
    // otherwise do no leak info to the client but log the stacktrace
    else {
      console.error(error);
      ctx.status = 500;
      ctx.body = 'Internal server error.';
    }
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

const server = http.createServer(app.callback());

if (process.env.NODE_ENV !== 'test') {
  server.listen(process.env.PORT, () => console.info(`Listening on port ${process.env.PORT}`));
}

export default server;
