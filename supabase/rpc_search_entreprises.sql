-- Fonction RPC pour une pagination et un filtrage 100% cote base,
-- incluant un calcul de distance exact via PostGIS.
--
-- A executer une seule fois dans le SQL Editor du projet Supabase.

-- 1) Extension PostGIS (calcul geo precis + indexable)
create extension if not exists postgis;

-- 2) Colonne geographique derivee de latitude/longitude
alter table entreprises add column if not exists geo geography(point, 4326);

update entreprises
set geo = ST_SetSRID(ST_MakePoint(longitude::float, latitude::float), 4326)::geography
where latitude is not null
  and longitude is not null
  and geo is null;

-- Garder la colonne geo synchronisee automatiquement
create or replace function entreprises_sync_geo()
returns trigger language plpgsql as $$
begin
  if new.latitude is not null and new.longitude is not null then
    new.geo := ST_SetSRID(ST_MakePoint(new.longitude::float, new.latitude::float), 4326)::geography;
  else
    new.geo := null;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_entreprises_sync_geo on entreprises;
create trigger trg_entreprises_sync_geo
  before insert or update of latitude, longitude on entreprises
  for each row execute function entreprises_sync_geo();

create index if not exists entreprises_geo_idx on entreprises using gist (geo);

-- 3) Fonction RPC de recherche paginee, filtree et triee cote base
create or replace function search_entreprises(
  ref_lat float,
  ref_lon float,
  distance_max_km float default null,
  q text default null,
  p_departement text default null,
  p_activite text default null,
  p_statut text default null,
  sort_by text default 'nom',
  page_num int default 1,
  page_size int default 20
)
returns table (
  siren text,
  nom_complet text,
  nom_raison_sociale text,
  sigle text,
  activite_principale text,
  code_postal text,
  commune text,
  departement text,
  latitude numeric,
  longitude numeric,
  statut_prospection text,
  raw_data jsonb,
  imported_at timestamptz,
  updated_at timestamptz,
  distance_km float,
  total_count bigint
)
language sql stable as $$
  with filtered as (
    select
      e.siren,
      e.nom_complet,
      e.nom_raison_sociale,
      e.sigle,
      e.activite_principale,
      e.code_postal,
      e.commune,
      e.departement,
      e.latitude,
      e.longitude,
      e.statut_prospection,
      e.raw_data,
      e.imported_at,
      e.updated_at,
      case
        when e.geo is not null then
          ST_Distance(e.geo, ST_SetSRID(ST_MakePoint(ref_lon, ref_lat), 4326)::geography) / 1000.0
        else null
      end as distance_km
    from entreprises e
    where
      (q is null or q = '' or (
        e.nom_complet ilike '%' || q || '%'
        or e.nom_raison_sociale ilike '%' || q || '%'
        or e.sigle ilike '%' || q || '%'
        or e.siren ilike '%' || q || '%'
        or e.commune ilike '%' || q || '%'
        or e.code_postal ilike '%' || q || '%'
      ))
      and (p_departement is null or p_departement = '' or e.departement = p_departement)
      and (p_activite is null or p_activite = '' or e.activite_principale = p_activite)
      and (p_statut is null or p_statut = '' or e.statut_prospection = p_statut)
  ),
  ranked as (
    select *, count(*) over() as total_count
    from filtered
    where distance_max_km is null or (distance_km is not null and distance_km <= distance_max_km)
  )
  select
    siren, nom_complet, nom_raison_sociale, sigle, activite_principale,
    code_postal, commune, departement, latitude, longitude,
    statut_prospection, raw_data, imported_at, updated_at,
    distance_km, total_count
  from ranked
  order by
    case when sort_by = 'distance' then distance_km end asc nulls last,
    case when sort_by = 'nom' then nom_complet end asc
  limit page_size offset (page_num - 1) * page_size;
$$;

grant execute on function search_entreprises to authenticated;
