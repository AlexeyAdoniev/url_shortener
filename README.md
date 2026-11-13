# URL shortener

Start the apps, PostgreSQL, Redis, and Kafka:

```sh
docker compose up --build -d
```

Compose runs database migrations and creates the `urls.create` Kafka topic before starting the apps. The API listens on port 3000; the generator only consumes Kafka tasks and has no HTTP port.

```sh
curl -i -X POST http://localhost:3000/urls \
  -H 'Content-Type: application/json' \
  -d '{"original":"https://example.com","alias":"demo","expireMs":60000}'
docker compose logs -f generator
curl -i http://localhost:3000/demo
```

`POST /urls` validates the request and returns an empty `202 Accepted` after Kafka acknowledges publication. `alias` and `expireMs` are optional. The generator saves the URL and logs its short ID. Once processed, `GET /:shortId` redirects to the original URL, or returns 404 for missing or expired URLs. Expiration starts when the generator processes the task.

Creation failures happen asynchronously: an alias conflict is logged and skipped; unexpected failures are retried. Kafka delivery is at least once, so a replay can generate another short ID for a task without an alias.

For local apps, set `DATABASE_URL=postgresql://url_shortener:url_shortener@localhost:5433/url_shortener` and optionally `KAFKA_BROKERS=localhost:9092` (the default). Run `yarn nx run api:serve` and `yarn nx run generator:serve` separately with the Compose infrastructure running.
