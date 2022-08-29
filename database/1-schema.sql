create table users (
  id bigserial primary key,
  created_at timestamptz not null default now()::timestamptz(0),
  updated_at timestamptz not null default now()::timestamptz(0),
  email text unique,
  password text
);

create trigger users_sua after update on users for each row execute procedure sua();
