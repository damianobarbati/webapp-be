import crypto from 'crypto';
import { database } from 'pg-database';

export const create = ({ email, password }) => {
  password = crypto.createHash('sha256').update(password).digest('hex');
  const user = database.insert('users', { email, password });
  return user;
};
