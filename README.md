# The most private link shortener

A link shortener that allows you to choose a custom slug (so your link would be `https://my-domain.com/#<slug>`) while
maintaining maximum privacy. Not even the maintainer for the database can (easily) see what links there are and where
they lead to.

## Features

- Choose your own slug (`https://my-link-shortener.com/#<slug>`)
- Not even the database admin can see what the link is or where it leads
- Add a `?` anywhere after the `#` of a short link (e.g. turn `htps://.../#foo` into `https://.../#foo?`
  or `https://.../#?foo`) to see the target before being redirected
- Anyone can create their own deployment

## FAQ

#### Why the weird \# before the slug?

In short, it improves your privacy. When the browser loads the content of a URL (e.g. `https://google.com/some/path`),
it asks the server at `google.com` "Hey, what's the content of `/some/path`?". However, Browsers don't include anything
after a `#` in that question. This means that the server logs won't reflect a shortlink that you just opened, which is
important to maintain the cryptographic benefits of this link shortener.

#### Why does it take so long to open a short link?

Again, that's to improve privacy. The slug isn't just stored in the databse (because then the admin could just look at
the slugs and open the short links). Instead, they are obfuscated (hashed) beforehand. This process is intentionally
designed to take some time so that even with full database access, it would take an attacker very long to undo the
obfuscation.

### Can I choose any slug?

Mostly, yes. You may only use alphanumeric characters (A-Z and 0-9) as well as `_` and `-`. However, the slug serves as
a kind of password. If you want nobody to be able to guess your slug and therefore reach your link, then all the same
rules apply as for passwords (i.e. you should choose a long one that isn't in the dictionary).

## Technical details

IMAGE HERE

In order to not be able to see the target URLs in the database, they are encrypted using a key derived from the slug.
Since storing the slug as cleartext would make this utterly useless, only a hash of the slug is stored in the database.

Therefore, the general lookup flow is to take the slug, hash it and send the hash to the server, who will return the
encrypted URL. The client then derives the key from the slug and uses it to first verify the ciphertext's integrity and
then decipher it to obtain the target URL.

In order to hide the slugs even from the server logs, they are "hidden" by a `#` in the URL. Browsers omit everything
after a `#` in the URLs of HTTP requests.

To further protect users, upon decryption, the URL is always checked against validity and, if desired, the user is not
redirected immediately but is only displayed the target URL (see Features section above).
