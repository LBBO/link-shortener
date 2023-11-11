create table
    public.shortlinks
(
    id              uuid                     not null default gen_random_uuid(),
    slug_hash       character varying(50)    not null, -- 44 should be enough, but better safe than sorry
    url_iv          character varying(50)    not null, -- 44 should be enough, but better safe than sorry
    url_ciphertext  character varying(1500)  not null, -- chosen arbitrarily by some super long URL + some padding
    url_hmac        character varying(100)   not null, -- 88 should be enough, but better safe than sorry
    created_at      timestamp with time zone not null default now(),
    expiration_date date                     null,
    constraint shortlinks_pkey primary key (id),
    constraint shortlinks_slug_hash_key unique (slug_hash)
) tablespace pg_default;