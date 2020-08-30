import { signUp } from './user.js';

test('sign-up', async () => {
  const result = await signUp({ email: 'john.doe@gmail.com', password: 'p455w0rd' });

  expect(result).toEqual(expect.any(String));
  expect(result.length).toBeGreaterThanOrEqual(100);
  expect(result).toMatch(/^.+\..+$/);
});
