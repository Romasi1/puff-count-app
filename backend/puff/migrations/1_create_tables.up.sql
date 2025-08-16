CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  nicotine_per_puff DOUBLE PRECISION DEFAULT 0.5,
  daily_goal INTEGER DEFAULT 0
);

CREATE TABLE puffs (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  nicotine_amount DOUBLE PRECISION NOT NULL
);

CREATE TABLE goals (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  date DATE NOT NULL,
  target_puffs INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_puffs_user_timestamp ON puffs(user_id, timestamp);
CREATE INDEX idx_goals_user_date ON goals(user_id, date);
