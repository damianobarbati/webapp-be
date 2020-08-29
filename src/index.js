import http from 'http';
import koa from 'koa';
import cors from '@koa/cors';
import compress from 'koa-compress';
import noTrailingSlash from 'koa-no-trailing-slash';
import body from 'koa-body';
import json from 'koa-better-json';
import log from 'koa-better-log';
import Router from 'koa-router';
import * as api from './api.js';

const app = new koa();
const router = Router();

app.use(cors({ exposeHeaders: ['x-api-version'] }));
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
        await next();
    }
    catch (error) {
        ctx.status = error.http_code || 500; // eslint-disable-line
        ctx.body = error.message || 'Internal server error.'; // eslint-disable-line
    }
});

router.all(`/api/:service/:action`, async ctx => {
    const { service, action } = ctx.params;
    const args = { ...ctx.request.query, ...ctx.request.body };
    ctx.body = await api[service][action](args);
});

app.use(router.routes());

http.createServer(app.callback()).listen(process.env.PORT, error => error ? console.error(error) : console.info(`http serving on port ${process.env.PORT}`));
