/*
# Create Formula Battle progress storage

1. New Tables
- `formula_battle_progress`
- `device_id` (text, primary key): anonymous browser identifier used to restore one device's progress.
- `language` (text): selected interface language, either Dutch or English.
- `records` (jsonb): best scores grouped by exercise section.
- `updated_at` (timestamptz): last saved time.

2. Modified Tables
- None.

3. Security
- Row-level security is enabled.
- Anonymous and signed-in clients may use the table because this version has no sign-in screen.
- Four separate CRUD policies are provided for the anon and authenticated roles.

4. Important Notes
- This table stores only anonymous learning progress and language preference.
- The browser-generated device identifier is not an account identity or a security boundary.
*/

CREATE TABLE IF NOT EXISTS public.formula_battle_progress (
  device_id text PRIMARY KEY,
  language text NOT NULL DEFAULT 'nl' CHECK (language IN ('nl', 'en')),
  records jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.formula_battle_progress ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.formula_battle_progress TO anon, authenticated;

DROP POLICY IF EXISTS "formula_progress_select" ON public.formula_battle_progress;
CREATE POLICY "formula_progress_select"
  ON public.formula_battle_progress FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "formula_progress_insert" ON public.formula_battle_progress;
CREATE POLICY "formula_progress_insert"
  ON public.formula_battle_progress FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "formula_progress_update" ON public.formula_battle_progress;
CREATE POLICY "formula_progress_update"
  ON public.formula_battle_progress FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "formula_progress_delete" ON public.formula_battle_progress;
CREATE POLICY "formula_progress_delete"
  ON public.formula_battle_progress FOR DELETE
  TO anon, authenticated
  USING (true);
