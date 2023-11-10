create table
    public.shortlinks
(
    id              uuid                     not null default gen_random_uuid(),
    slug_hash       character varying        not null,
    url_iv          character varying        not null,
    url_ciphertext  character varying        not null,
    url_hmac        character varying        not null,
    created_at      timestamp with time zone not null default now(),
    expiration_date date                     null,
    constraint shortlinks_pkey primary key (id),
    constraint shortlinks_slug_hash_key unique (slug_hash)
) tablespace pg_default;