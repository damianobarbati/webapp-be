import { asyncStorage } from '../index.js';
import jwt from 'jwt-simple';
import { validate } from '../models/index.js';

export const signUp = async ({ email, password }) => {
    // await asyncStorageExample();

    validate({ email, password }, ['email', 'password']);

    const user = { email, password };
    const token = jwt.encode(user, process.env.JWT_SECRET);

    return token;
};
// curl -k http://localhost/api/user/signUp -d "email=$RANDOM@gmail.com" -d 'password=p4ssw0rd'

export const signIn = async ({ email, password }) => {
    console.log({ email, password });
    return true;
};

export const me = async ({ token }) => {
    validate({ token }, ['token']);

    try {
        const result = jwt.decode(token, process.env.JWT_SECRET);
        return result;
    }
    catch (error) {
        throw Object.assign(new Error(error.message), { http_code: 403 });
    }
};
// curl -k http://localhost/api/user/me -d 'token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6IjIxNzU3QGdtYWlsLmNvbSIsInBhc3N3b3JkIjoicGFvcmQifQ.YnvyWwnfnxiKfxfnxUsnaKQvAwsRlyVk8uwZmSdm6MY'

export const list = async ({ search } = {}) => {
    console.log(search);
    return [];
};

export const asyncStorageExample = async () => {
    const ctx = asyncStorage.getStore();
    console.log('yo!', ctx.args);
};

export const success = args => args;

export const failure = () => {
    throw Object.assign(new Error('doh!'), { http_code: 422 });
};
