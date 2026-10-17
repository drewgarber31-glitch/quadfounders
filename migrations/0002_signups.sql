-- Test-site sign-up form. Visitors leave a name, email, and an optional answer.
-- Only the student who owns the plan can see or delete them.

-- Public id for the student's live site link (separate from the private plan id,
-- so sharing the site never exposes the plan or its sign-ups).
ALTER TABLE projects ADD COLUMN public_id TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_public ON projects (public_id);

CREATE TABLE IF NOT EXISTS signups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  answer TEXT,
  created_at TEXT NOT NULL,
  UNIQUE (project_id, email),
  FOREIGN KEY (project_id) REFERENCES projects(id)
);
CREATE INDEX IF NOT EXISTS idx_signups_project ON signups (project_id, id);
