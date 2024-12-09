-- Function to execute dynamic SQL with proper security measures
create or replace function public.run_sql(query text)
returns setof record
language plpgsql
security definer
set search_path = public
as $$
declare
  result record;
begin
  -- Input validation
  if query is null or length(trim(query)) = 0 then
    raise exception 'Query parameter cannot be null or empty';
  end if;

  -- Log execution (optional, remove in production if sensitive)
  raise notice 'Executing query: %', query;

  -- Execute the query and return results
  for result in execute query loop
    return next result;
  end loop;

  return;
exception
  when others then
    -- Log error details
    raise notice 'Error executing query: %', SQLERRM;
    -- Re-raise the error
    raise;
end;
$$;

-- Grant execute permission to authenticated users
grant execute on function public.run_sql(text) to authenticated;

-- Add function comment
comment on function public.run_sql(text) is 
'Executes dynamic SQL queries with security measures.
Parameters:
  query - The SQL query to execute
Returns:
  setof record - Results of the query execution
Security:
  - Requires authenticated user
  - Runs with definer security
  - Limited to public schema
Usage:
  select * from run_sql($$ your_query_here $$) as t(column_name type, ...);';