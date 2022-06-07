import crypto from 'crypto';
import { database } from 'pg-database';

export type create_fn = (input: create_input) => Promise<create_output>;

export type create_input = {
  email: string;
  password: string;
};

export type create_output = User;

export type User = {
  id: number;
};

export const create: create_fn = async ({ email, password }) => {
  const encrypted_password = crypto.createHash('sha256').update(password).digest('hex');
  const user: User = (await database.insert('users', { email, password: encrypted_password })) as User;
  return user;
};
