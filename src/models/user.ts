import crypto from 'crypto';
import database from '../connectors/database.js';
import User from '../types/User.js';

export type insert_fn = (input: insert_input) => Promise<insert_output>;

export type insert_input = {
  email: string;
  password: string;
};

export type insert_output = User;

const insert: insert_fn = async ({ email, password }) => {
  const encrypted_password = crypto.createHash('sha256').update(password).digest('hex');

  const [user] = await database<User>('users')
    .insert(<User>{ email, password: encrypted_password })
    .returning('*');

  return user;
};

export default { insert };
