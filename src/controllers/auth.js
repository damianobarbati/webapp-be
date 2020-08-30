import jwt from 'jwt-simple';
import { HTTP401, HTTP403, HTTP422 } from '../errors.js';
import * as User from '../models/user.js';

export const signUp = async ({ email, password } = {}) => {
  if (!email.match(/^.+@.+\..+$/)) throw new HTTP422('Email must be a valid email address.');
  if (password.length < 8) throw new HTTP422('Password must be at least 8 characters long.');

  const user = User.create({ email, password });

  const token = jwt.encode(user, process.env.JWT_SECRET);
  return { token };
};

export const signIn = async ({ email, password }) => {
  if (password !== 'password') throw new HTTP401();

  const user = { email };
  const token = jwt.encode(user, process.env.JWT_SECRET);
  return { token };
};

export const me = async ({ token }) => {
  try {
    const result = jwt.decode(token, process.env.JWT_SECRET);
    return result;
  } catch (error) {
    throw new HTTP403();
  }
};
