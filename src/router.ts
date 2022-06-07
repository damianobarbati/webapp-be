import { Context, Request } from 'koa';
import Router from '@koa/router';
import { HTTP404 } from './errors.js';
import * as user from './controllers/auth.js';

export const VERSION_PREFIX = '/v' + process.env.npm_package_version.split('.')[0];

const router = Router({
  prefix: VERSION_PREFIX,
});

router.all('/healthcheck', (ctx: Context) => (ctx.body = true));

router.all('/auth/sign-up', async (ctx: Context) => (ctx.body = await user.signUp(ctx.request.body)));

router.all('/auth/sign-in', (ctx: Context) => (ctx.body = user.signIn(ctx.request.body)));

router.all('/auth/me', (ctx: Context) => {
  const token = <string>ctx.request.headers['x-token'];
  ctx.body = user.me({ token });
});

router.all('(.*)', () => {
  throw new HTTP404();
});

export default router;