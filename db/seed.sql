INSERT INTO urls (short_id, original_url)
VALUES ('nest', 'https://nestjs.com/')
ON CONFLICT (short_id) DO NOTHING;
