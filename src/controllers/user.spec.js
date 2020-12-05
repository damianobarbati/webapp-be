import { jest } from '@jest/globals';
import { signUp } from './user.js';
import asyncStorage from '../asyncStorage.js';

asyncStorage.getStore = jest.fn(() => ({ args: { hello: 'world' } }));

test('sign-up', async () => {
    const result = await signUp({ email: 'john.doe@gmail.com', password: 'p455w0rd' });

    expect(result).toEqual(expect.any(String));
    expect(result.length).toBeGreaterThanOrEqual(100);
    expect(result).toMatch(/^.+\..+$/);
});
