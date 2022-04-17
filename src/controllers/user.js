import jwt from 'jwt-simple';
import { HTTP403 } from '../errors.js';

export const signUp = async ({ email, password } = {}) => {
  const user = { email, password };
  const token = jwt.encode(user, process.env.JWT_SECRET);
  return token;
};

export const signIn = async ({ email, password }) => {
  console.log({ email, password });
  return true;
};

export const me = async ({ token }) => {
  try {
    const result = jwt.decode(token, process.env.JWT_SECRET);
    return result;
  } catch (error) {
    throw new HTTP403();
  }
};
