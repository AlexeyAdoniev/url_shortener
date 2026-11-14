# URL shortener

Start the apps, PostgreSQL, Redis, and Kafka:

```sh
docker compose up --build -d
```

Compose runs database migrations and creates the `urls.create` and `urls.create.reply` Kafka topics before starting the apps. The API listens on port 3000; the generator only consumes Kafka tasks and has no HTTP port.

```sh
curl -i -X POST http://localhost:3000/urls \
  -H 'Content-Type: application/json' \
  -d '{"original":"https://example.com","alias":"demo","expireMs":60000}'
docker compose logs -f generator
curl -i http://localhost:3000/demo
```

`POST /urls` validates the request, sends it through Kafka, and waits for the generator's Kafka reply before returning `200 {"shortId":"..."}`. Nest handles correlation IDs and reply routing. The generator saves the URL before replying. `alias` and `expireMs` are optional; expiration starts when the task is processed. `GET /:shortId` redirects or returns 404 for missing or expired URLs.

Alias conflicts return HTTP 409. The API waits up to 10 seconds before returning 504; other Kafka failures return 503. A timeout does not cancel generation. Kafka delivery is at least once, so replay can create another short ID for a task without an alias.

The reply topic currently has one partition, supporting one API instance. Add reply partitions before running more API instances. Pending requests use Nest's built-in in-memory correlation tracking; an API restart loses those pending HTTP requests.

For local apps, set `DATABASE_URL=postgresql://url_shortener:url_shortener@localhost:5433/url_shortener` and optionally `KAFKA_BROKERS=localhost:9092` (the default). Run `yarn nx run api:serve` and `yarn nx run generator:serve` separately with the Compose infrastructure running.
