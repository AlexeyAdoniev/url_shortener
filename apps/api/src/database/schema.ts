export const CREATE_URLS_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS urls (
    short_id VARCHAR(6) PRIMARY KEY,
    original_url TEXT NOT NULL,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;
