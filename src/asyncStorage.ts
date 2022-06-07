import { AsyncLocalStorage } from 'async_hooks';

export type asyncStorage = {
  id_transaction: string;
};

const asyncStorage: AsyncLocalStorage<asyncStorage> = new AsyncLocalStorage();

export default asyncStorage;
