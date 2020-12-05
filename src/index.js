import http from 'http';
import { AsyncLocalStorage } from 'async_hooks';
import koa from 'koa';
import cors from '@koa/cors';
import compress from 'koa-compress';
import noTrailingSlash from 'koa-no-trailing-slash';
import body from 'koa-body';
import json from 'koa-better-json';
import log from 'koa-better-log';
import Router from 'koa-router';
import * as controllers from './controllers/index.js';

const app = new koa();
const router = Router();
export const asyncStorage = new AsyncLocalStorage();

app.use(cors({ exposeHeaders: ['x-src-version'] }));
app.use(noTrailingSlash());
app.use(body());
app.use(compress({ filter: content_type => ['application/json'].includes(content_type) }));
app.use(log({
    logWith: ctx => ({ fingerprint: ctx.request.query.fingerprint }),
    exclude: ctx => ctx.path.includes('healthcheck'),
}));
app.use(json());

app.use(async (ctx, next) => {
    try {
        ctx.set({ 'x-version': process.env.npm_package_version });
        ctx.args = { ...ctx.request.query, ...ctx.request.body };
        await asyncStorage.run(ctx, next);
    }
    catch (error) {
        ctx.status = error.http_code || 500; // eslint-disable-line
        ctx.body = error.message || 'Internal server error.'; // eslint-disable-line
    }
});

/** user routes **/
router.all(`/api/user/signUp`, async ctx => ctx.body = await controllers.user.signUp({ ...ctx.params, ...ctx.args }));
router.all(`/api/user/signIn`, async ctx => ctx.body = await controllers.user.signIn({ ...ctx.params, ...ctx.args }));

router.all(`/api/user/success`, async ctx => ctx.body = await controllers.user.success({ ...ctx.params, ...ctx.args }));
router.all(`/api/user/failure`, async ctx => ctx.body = await controllers.user.failure({ ...ctx.params, ...ctx.args }));

app.use(router.routes());

http.createServer(app.callback()).listen(process.env.PORT, error => error ? console.error(error) : console.info(`http serving on port ${process.env.PORT}`));
