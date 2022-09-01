import knex, { Knex } from 'knex';

const database = knex(<Knex.Config>{ client: 'pg', connection: process.env.DB_URI, debug: !!process.env.DB_LOG });

export default database;
