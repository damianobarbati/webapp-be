import { jest } from '@jest/globals';
import supertest from 'supertest';
import server from '../index.js';
import { VERSION_PREFIX } from '../router.js';

describe('auth', () => {
  let request;

  beforeAll(async () => {
    request = supertest.agent(server);
  });

  afterAll(async () => {
    server.close();
  });

  it('/sign-in success', async () => {
    const { body } = await request.post(`${VERSION_PREFIX}/auth/sign-in`).send({
      email: 'john.doe@gmail.com',
      password: 'password',
    });

    expect(body).toMatchObject({ token: expect.any(String) });
  });

  it('/sign-in failure', async () => {
    const { status, headers, body } = await request.post(`${VERSION_PREFIX}/auth/sign-in`).send({
      email: 'john.doe@gmail.com',
      password: 'blabla',
    });

    expect(status).toEqual(401);
    expect(headers['x-transaction-id']).toEqual(expect.any(String));
    expect(body).toEqual('Unauthorized.');
  });

  it('/me success', async () => {
    const { body } = await request
      .get(`${VERSION_PREFIX}/auth/me`)
      .set(
        'x-token',
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImpvaG4uZG9lQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoicGFzc3dvcmQifQ.dP5J45idSMg-wZxFMkS9RaXFQFnF8YU65BE_y_kRlqY'
      )
      .send();

    expect(body).toMatchObject({ email: 'john.doe@gmail.com' });
  });
});

// describe('auth with mocked database', () => {
//   it('/sign-up success', async () => {
//     await mockModule('../models/user.ts', undefined, {
//       create: (args) => args,
//     });
//
//     const { default: server } = await import('../index.ts');
//
//     const request = supertest.agent(server);
//
//     const { body } = await request.post(`${VERSION_PREFIX}/auth/sign-up`).send({
//       email: 'john.doe@gmail.com',
//       password: 'password',
//     });
//
//     expect(body).toMatchObject({ token: expect.any(String) });
//
//     server.close();
//   });
// });
