export const email = {
    type: 'string',
    pattern: '^[^\\s]+@[^\\s]+$',
    minLength: 8,
    maxLength: 60,
};

export const password = {
    type: 'string',
    pattern: '^[^\\s]{8,32}$',
    minLength: 8,
    maxLength: 32,
};

export const token = {
    type: 'string',
};
