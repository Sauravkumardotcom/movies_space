import dotenv from 'dotenv';
import { connectDB, disconnectDB, query } from './connection.js';

dotenv.config();

const schemaStatements = [`
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar TEXT,
  bio TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  is_verified BOOLEAN NOT NULL DEFAULT false,
  last_login TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`, `
CREATE TABLE IF NOT EXISTS videos (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  thumbnail TEXT,
  poster TEXT,
  duration INT,
  genre TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  rating NUMERIC(3,1),
  release_date DATE,
  director TEXT,
  cast TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  language TEXT NOT NULL DEFAULT 'en',
  subtitle BOOLEAN NOT NULL DEFAULT false,
  quality TEXT NOT NULL DEFAULT '720p',
  uploaded_by INT REFERENCES users(id) ON DELETE SET NULL,
  views BIGINT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_public BOOLEAN NOT NULL DEFAULT true,
  tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`, `
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  video_id INT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);
`, `
CREATE TABLE IF NOT EXISTS watch_history (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  video_id INT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  watched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  duration INT NOT NULL DEFAULT 0,
  total_duration INT NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  quality TEXT NOT NULL DEFAULT '720p',
  device_type TEXT NOT NULL DEFAULT 'desktop',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`, `
CREATE TABLE IF NOT EXISTS movie_requests (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'movie',
  description TEXT,
  requested_by TEXT NOT NULL,
  requested_by_user INT REFERENCES users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  additional_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  votes INT NOT NULL DEFAULT 1,
  voters INT[] NOT NULL DEFAULT ARRAY[]::INT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`, `
CREATE INDEX IF NOT EXISTS idx_videos_genre ON videos USING GIN (genre);
`, `
CREATE INDEX IF NOT EXISTS idx_videos_tags ON videos USING GIN (tags);
`, `
CREATE INDEX IF NOT EXISTS idx_videos_status ON videos (status);
`, `
CREATE INDEX IF NOT EXISTS idx_videos_is_public ON videos (is_public);
`, `
CREATE INDEX IF NOT EXISTS idx_videos_release_date ON videos (release_date);
`, `
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos (created_at DESC);
`, `
CREATE INDEX IF NOT EXISTS idx_users_email ON users (LOWER(email));
`, `
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites (user_id);
`, `
CREATE INDEX IF NOT EXISTS idx_watch_history_user ON watch_history (user_id);
`, `
CREATE INDEX IF NOT EXISTS idx_movie_requests_status ON movie_requests (status);
`
];

async function runMigrations() {
  try {
    await connectDB();
    console.log('🛠️ Applying PostgreSQL schema migrations...');

    for (const statement of schemaStatements) {
      await query(statement);
    }

    console.log('✅ PostgreSQL schema created or verified successfully.');
  } catch (error) {
    console.error('❌ Failed to initialize database schema:', error.message);
    process.exitCode = 1;
  } finally {
    await disconnectDB();
  }
}

if (process.argv[1].endsWith('init.js')) {
  runMigrations();
}
