import http from 'http';
import asyncStorage from './asyncStorage.js';
import koa from 'koa';
import cors from '@koa/cors';
import body from 'koa-body';
import json from 'koa-better-json';
import log from 'koa-better-log';
import Router from '@koa/router';
import * as controllers from './controllers/index.js';

const app = new koa();
const router = Router();

app.use(cors({ exposeHeaders: ['x-version'] }));
app.use(body());
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
        console.error(error);
        ctx.status = error.http_code || 500; // eslint-disable-line
        ctx.body = error.http_message || 'Internal server error.'; // eslint-disable-line
    }
});

const routeToFunction = func => async ctx => ctx.body = await func(ctx.args);

router.all(`/api/user/signUp`, routeToFunction(controllers.user.signUp));
router.all(`/api/user/signIn`, routeToFunction(controllers.user.signIn));
router.all(`/api/user/success`, routeToFunction(controllers.user.success));
router.all(`/api/user/failure`, routeToFunction(controllers.user.failure));

app.use(router.routes());

const webServer = http.createServer(app.callback()).listen(process.env.PORT, error => error ? console.error(error) : console.info(`http serving on port ${process.env.PORT}`));

export default webServer;
