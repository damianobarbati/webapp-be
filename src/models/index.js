import Ajv from 'ajv';

import * as user from './user.js';
export { user };

const validators = { ...user };

export const validate = (args, required, http_code = 422) => {
    const ajv = new Ajv({ allErrors: true });

    const validation = ajv.validate({ properties: validators, required }, args);

    if (!validation) {
        const errors = ajv.errors;
        console.error(errors);

        const error = new Error();
        error.http_code = http_code;
        error.message = errors.map(error => `${error.dataPath.slice(1)} ${error.message.toLowerCase()}`);

        throw error;
    }
};

// const myFunc = ({ email, password }) => {
//     validate({ email, password }, userValidators, ['email', 'password']);
//     return true;
// };
//
// myFunc({ email: 'ciao@gmail.com', password: 'p4ssw0rd' });
// myFunc({ email: 'ciao', password: 'p4ssw0rd' });
// myFunc({ email: 'ciao@gmail.com', password: null });
// myFunc({ email: 'ciao', password: 'bla' });
//
