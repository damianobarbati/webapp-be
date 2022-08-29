-- sua (set updated at): set updated_at = now() when updating row
create or replace function sua() returns trigger language plpgsql as $$
  begin
    new.updated_at = now()::timestamptz(0);
    return new;
  end;
$$;

-- asu (array sort unique): keep array values sorted and unique
create or replace function asu (anyarray) returns anyarray language sql as $$
  select array(
    select distinct $1[s.i]
    from generate_series(array_lower($1,1), array_upper($1,1)) as s(i)
    order by 1
  );
$$;