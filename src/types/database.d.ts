type obj = Record<string, any>;
type obj_or_array = Array<obj> | obj;

type database = {
  select: (query: string, replacements: Record<string, any>) => Promise<obj_or_array>;
  insert: (table: string, values: Record<string, any>) => Promise<obj_or_array>;
  update: (query: string, replacements: Record<string, any>) => Promise<obj_or_array>;
  delete: (query: string, replacements: Record<string, any>) => Promise<obj_or_array>;
};

declare module 'pg-database' {
  export const database: database;
}
