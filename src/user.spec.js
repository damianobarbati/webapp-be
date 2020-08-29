import { signUp } from './user.js';

describe('', () => {
    it('', async () => {
        const result = await signUp({ email: 'john.doe@gmail.com', password: 'p455w0rd' });

        expect(result).toEqual(jasmine.any(String));
        expect(result.length).toBeGreaterThanOrEqual(100);
        expect(result).toMatch(/^.+\..+$/);
    });
});
