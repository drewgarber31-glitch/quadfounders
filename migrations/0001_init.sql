-- Quad Founders schema. Stores business info only. No logins, no personal IDs.

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  idea TEXT NOT NULL,
  questions TEXT,          -- JSON array of follow-up questions
  answers TEXT,            -- JSON object of answers
  plan TEXT,               -- JSON business plan (4 quadrants + tasks)
  site TEXT                -- JSON website content
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id TEXT NOT NULL,
  task_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id)
);
CREATE INDEX IF NOT EXISTS idx_messages_task ON messages (project_id, task_id, id);

-- Daily AI usage counters for cost protection. key is a hashed visitor id or 'total'.
CREATE TABLE IF NOT EXISTS usage (
  key TEXT NOT NULL,
  day TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (key, day)
);
