# simple link shortener

## First run

To create database

```py
node init.js
```

## Running

```sh
node index.js
```

## Using

### Creating short link

```sh
curl -X "POST" localhost:3000 -d "dest=https://ref.snehit.dev/packaging/what-is-packaging.html"
```

This returns the shortcode and id.

```json
{
  "id": 13030177,
  "shortcode": "jwZd",
  "dest": "https://ref.snehit.dev/packaging/what-is-packaging.html"
}
```

- `id` is required to later delete the short url
- `shortcode` is the actual route
  - eg. in this case, `http://127.0.0.1:3000/jwZd` will take you to `https://ref.snehit.dev/packaging/what-is-packaging.html`

### Deleting short link

With the id you get for short links you create, run this.

```sh
curl -X "DELETE" 127.0.0.1:3000 -d "id=13030177"
```

```
{"msg":"success"}
```
