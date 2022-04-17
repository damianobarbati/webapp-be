import Router from '@koa/router';
import { HTTP404 } from './errors.js';
import * as user from './controllers/auth.js';

export const VERSION_PREFIX = '/v' + process.env.npm_package_version.split('.')[0];

const router = new Router({
  prefix: VERSION_PREFIX,
});

router.all('/healthcheck', (ctx) => (ctx.body = true));

router.all('/auth/sign-up', async (ctx) => (ctx.body = await user.signUp(ctx.request.body)));
router.all('/auth/sign-in', async (ctx) => (ctx.body = await user.signIn(ctx.request.body)));
router.all('/auth/me', async (ctx) => (ctx.body = await user.me({ token: ctx.request.headers['x-token'] })));

router.all('(.*)', () => {
  throw new HTTP404();
});

export default router;
