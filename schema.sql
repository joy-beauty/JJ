-- Caderneta de Vendas: estrutura do banco (Supabase / PostgreSQL)
-- Cole tudo no SQL Editor do Supabase e clique em Run. Pode rodar de novo sem problema.

-- 1) Tabelas. Cada uma guarda um registro por linha: id + data (json).
create table if not exists public.products (id text primary key, data jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now());
create table if not exists public.sales    (id text primary key, data jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now());
create table if not exists public.wallet   (id text primary key, data jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now());
create table if not exists public.config   (id text primary key, data jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now());

-- 2) Quem pode mexer: somente o seu e-mail, depois de entrar com senha.
create or replace function public.is_owner() returns boolean
language sql stable set search_path = ''
as $$ select coalesce((auth.jwt() ->> 'email') = 'jhonnyguedespereira@gmail.com', false) $$;

alter table public.products enable row level security;
alter table public.sales    enable row level security;
alter table public.wallet   enable row level security;
alter table public.config   enable row level security;

drop policy if exists dono_products on public.products;
drop policy if exists dono_sales    on public.sales;
drop policy if exists dono_wallet   on public.wallet;
drop policy if exists dono_config   on public.config;
create policy dono_products on public.products for all to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));
create policy dono_sales    on public.sales    for all to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));
create policy dono_wallet   on public.wallet   for all to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));
create policy dono_config   on public.config   for all to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));

-- Visitantes (sem login) não enxergam nenhuma tabela.
revoke all on public.products, public.sales, public.wallet, public.config from anon;

-- 3) O que o cliente pode ver: só nome, marca, preço de venda, foto e se tem estoque.
--    Custo, estoque, vendas, clientes e carteira nunca aparecem aqui.
create or replace view public.public_catalog with (security_invoker = false) as
select id,
       (data->>'n')::numeric           as n,
       data->>'name'                   as name,
       data->>'brand'                  as brand,
       (data->>'price')::numeric       as price,
       data->>'img'                    as img,
       coalesce((data->>'stock')::numeric, 0) > 0 as avail
from public.products;

create or replace view public.public_config with (security_invoker = false) as
select data->>'title' as title, data->>'whatsapp' as whatsapp
from public.config where id = 'config';

grant select on public.public_catalog, public.public_config to anon, authenticated;
