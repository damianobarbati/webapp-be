import Router from '@koa/router';
import { HTTP404 } from './errors.js';
import * as user from './controllers/user.js';

export const VERSION_PREFIX = '/v' + process.env.npm_package_version.split('.')[0];

const router = new Router({
  prefix: VERSION_PREFIX,
});

router.all('/healthcheck', (ctx) => (ctx.body = true));

router.all('/auth/sign-up', (ctx) => (ctx.body = user.signIn(ctx.body)));
router.all('/auth/sign-in', (ctx) => (ctx.body = user.signIn(ctx.body)));
router.all('/auth/me', (ctx) => (ctx.body = user.signIn(ctx.body)));

router.all('(.*)', () => {
  throw new HTTP404();
});

export default router;
