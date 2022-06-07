import jwt from 'jwt-simple';
import { HTTP401, HTTP403, HTTP422 } from '../errors.js';
import * as User from '../models/user.js';

export type signUp_fn = (input: signUp_input) => Promise<signUp_output>;

export type signUp_input = {
  email: string;
  password: string;
};

export type signUp_output = {
  token: string;
};

export const signUp: signUp_fn = async (input) => {
  const { email, password } = input;

  if (!email.match(/^.+@.+\..+$/)) throw new HTTP422('Email must be a valid email address.');
  if (password.length < 8) throw new HTTP422('Password must be at least 8 characters long.');

  const user = await User.create({ email, password });

  const token = jwt.encode(user, process.env.JWT_SECRET);
  return { token };
};

export type signIn_fn = (input: signIn_input) => signIn_output;

export type signIn_input = {
  email: string;
  password: string;
};

export type signIn_output = {
  token: string;
};

export const signIn: signIn_fn = ({ email, password }) => {
  if (password !== 'password') throw new HTTP401();

  const user = { email };
  const token = jwt.encode(user, process.env.JWT_SECRET);
  return { token };
};

export type me_fn = (input: me_input) => me_output;

export type me_input = {
  token: string;
};

export type me_output = Record<string, any>;

export const me: me_fn = ({ token }) => {
  try {
    const result = <Record<string, any>>jwt.decode(token, process.env.JWT_SECRET);
    return result;
  } catch (error) {
    throw new HTTP403();
  }
};
