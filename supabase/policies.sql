-- Policies RLS pour l'accès direct front -> Supabase (Data API / PostgREST)
-- via la clé "anon". Sans ces policies, RLS bloque tout accès par défaut.
--
-- Modèle retenu : accès complet (SELECT/INSERT/UPDATE/DELETE) réservé aux
-- utilisateurs authentifiés (role "authenticated"), aucun accès pour le rôle
-- "anon" non connecté. Adapte selon tes besoins (ex : lecture publique).
--
-- À exécuter dans Supabase (SQL Editor) après les migrations
-- 001/002/003/004 du projet mse-fle-prospection-api-mongo.

alter table entreprises enable row level security;
alter table contacts enable row level security;
alter table notes enable row level security;

-- entreprises
create policy "entreprises_select_authenticated"
  on entreprises for select
  to authenticated
  using (true);

create policy "entreprises_insert_authenticated"
  on entreprises for insert
  to authenticated
  with check (true);

create policy "entreprises_update_authenticated"
  on entreprises for update
  to authenticated
  using (true)
  with check (true);

create policy "entreprises_delete_authenticated"
  on entreprises for delete
  to authenticated
  using (true);

-- contacts
create policy "contacts_select_authenticated"
  on contacts for select
  to authenticated
  using (true);

create policy "contacts_insert_authenticated"
  on contacts for insert
  to authenticated
  with check (true);

create policy "contacts_update_authenticated"
  on contacts for update
  to authenticated
  using (true)
  with check (true);

create policy "contacts_delete_authenticated"
  on contacts for delete
  to authenticated
  using (true);

-- notes
create policy "notes_select_authenticated"
  on notes for select
  to authenticated
  using (true);

create policy "notes_insert_authenticated"
  on notes for insert
  to authenticated
  with check (true);

create policy "notes_delete_authenticated"
  on notes for delete
  to authenticated
  using (true);
