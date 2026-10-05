-- ============================================================================
-- 0024_bm_projects.sql
-- Projects tab and proposal studio (Bart Mining Admin). Run manually in the
-- Supabase Dashboard, SQL Editor, same as 0014-0023. Safe to re-run.
--
-- Tables use the bm_ prefix because "projects" already belongs to the drill
-- data workbench. Everything here is admin only: every policy calls
-- is_admin() (0015), so managers on the mobile app see none of it.
--
--   bm_parties    clients, suppliers and the companies Bart Mining acts for
--   bm_projects   one row per project; data holds the full planner model,
--                 including supplier costs and commission
--   bm_proposals  each proposal revision as issued, with the PDF that went out
--   bm_rfqs       requests for quotation sent to suppliers, and their quotes
--   bm_proformas  pro formas raised against the payment schedule
--   bm_payments   money received against a pro forma
--   bm_messages   every email sent from a project
--   bm_counters   running numbers: BM-P-2026-001, BM-PF-2026-001, BM-RFQ-...
--
-- The payment schedule itself lives in bm_projects.data (paymentSchedule),
-- so the proposal renders from one document and its snapshot is complete.
-- Pro formas point at a milestone by its id in that schedule.
--
-- Files (sent PDFs, supplier quotes) go in the private bm-files bucket.
-- ============================================================================

CREATE OR REPLACE FUNCTION bm_touch() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END $$;

-- ── Parties ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bm_parties (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- self = Bart Mining's own record (bank details for its pro formas)
  kind          TEXT NOT NULL CHECK (kind IN ('client', 'supplier', 'principal', 'self')),
  name          TEXT NOT NULL,
  contact_name  TEXT,
  email         TEXT,
  phone         TEXT,
  country       TEXT,
  address       TEXT,
  tax_id        TEXT,
  bank_details  TEXT,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS bm_parties_kind_idx ON bm_parties (kind, name);
DROP TRIGGER IF EXISTS bm_parties_touch ON bm_parties;
CREATE TRIGGER bm_parties_touch BEFORE UPDATE ON bm_parties FOR EACH ROW EXECUTE FUNCTION bm_touch();

INSERT INTO bm_parties (kind, name, email, phone, country, address)
SELECT 'self', 'Bart Mining', 'hello@bartmining.com', '+255 759 141 705', 'Tanzania', 'Dar es Salaam'
WHERE NOT EXISTS (SELECT 1 FROM bm_parties WHERE kind = 'self');

-- ── Projects ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bm_projects (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  stage         TEXT NOT NULL DEFAULT 'lead'
                CHECK (stage IN ('lead', 'proposal', 'negotiation', 'won', 'delivery', 'completed', 'lost')),
  -- direct = Bart Mining sells; agent = acts for another company; mixed = both
  deal_type     TEXT NOT NULL DEFAULT 'direct' CHECK (deal_type IN ('direct', 'agent', 'mixed')),
  client_id     UUID REFERENCES bm_parties(id) ON DELETE SET NULL,
  principal_id  UUID REFERENCES bm_parties(id) ON DELETE SET NULL,
  -- Client contract value of the chosen option, kept in step with data for the board and tracking.
  value_usd     NUMERIC(14, 2) NOT NULL DEFAULT 0,
  data          JSONB NOT NULL,
  -- Bumped on every save; a save that carries an old version is refused (edited elsewhere).
  version       INTEGER NOT NULL DEFAULT 1,
  archived      BOOLEAN NOT NULL DEFAULT false,
  lost_reason   TEXT,
  created_by    UUID DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS bm_projects_stage_idx ON bm_projects (archived, stage);
DROP TRIGGER IF EXISTS bm_projects_touch ON bm_projects;
CREATE TRIGGER bm_projects_touch BEFORE UPDATE ON bm_projects FOR EACH ROW EXECUTE FUNCTION bm_touch();

-- ── Proposals as issued ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bm_proposals (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID NOT NULL REFERENCES bm_projects(id) ON DELETE CASCADE,
  number        TEXT NOT NULL,
  revision      TEXT NOT NULL DEFAULT 'A',
  status        TEXT NOT NULL DEFAULT 'sent'
                CHECK (status IN ('sent', 'accepted', 'declined', 'superseded', 'expired')),
  title         TEXT,
  total_usd     NUMERIC(14, 2),
  valid_until   DATE,
  snapshot      JSONB,
  pdf_path      TEXT,
  sent_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  decided_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (number, revision)
);
CREATE INDEX IF NOT EXISTS bm_proposals_project_idx ON bm_proposals (project_id, sent_at DESC);
DROP TRIGGER IF EXISTS bm_proposals_touch ON bm_proposals;
CREATE TRIGGER bm_proposals_touch BEFORE UPDATE ON bm_proposals FOR EACH ROW EXECUTE FUNCTION bm_touch();

-- ── Supplier requests for quotation ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bm_rfqs (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id         UUID NOT NULL REFERENCES bm_projects(id) ON DELETE CASCADE,
  supplier_id        UUID REFERENCES bm_parties(id) ON DELETE SET NULL,
  -- Which option's equipment list was sent (a package id in bm_projects.data).
  package_key        TEXT,
  number             TEXT,
  subject            TEXT,
  status             TEXT NOT NULL DEFAULT 'draft'
                     CHECK (status IN ('draft', 'sent', 'quoted', 'declined', 'accepted')),
  quote_amount       NUMERIC(14, 2),
  quote_currency     TEXT NOT NULL DEFAULT 'USD',
  quote_ref          TEXT,
  quote_valid_until  DATE,
  quote_path         TEXT,
  notes              TEXT,
  sent_at            TIMESTAMPTZ,
  quoted_at          TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS bm_rfqs_project_idx ON bm_rfqs (project_id);
DROP TRIGGER IF EXISTS bm_rfqs_touch ON bm_rfqs;
CREATE TRIGGER bm_rfqs_touch BEFORE UPDATE ON bm_rfqs FOR EACH ROW EXECUTE FUNCTION bm_touch();

-- ── Pro formas and payments ─────────────────────────────────────────────────
-- Stored status is the paperwork state only. Part paid, paid and overdue
-- are worked out from bm_payments and due_date when read, so they can't drift.
CREATE TABLE IF NOT EXISTS bm_proformas (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id     UUID NOT NULL REFERENCES bm_projects(id) ON DELETE CASCADE,
  milestone_key  TEXT,
  number         TEXT NOT NULL UNIQUE,
  -- NULL = Bart Mining; otherwise the company the client pays directly.
  payee_id       UUID REFERENCES bm_parties(id) ON DELETE SET NULL,
  description    TEXT NOT NULL,
  amount         NUMERIC(14, 2) NOT NULL CHECK (amount >= 0),
  currency       TEXT NOT NULL DEFAULT 'USD',
  issued_on      DATE NOT NULL DEFAULT current_date,
  due_date       DATE,
  status         TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'confirmed', 'cancelled')),
  sent_at        TIMESTAMPTZ,
  confirmed_at   TIMESTAMPTZ,
  pdf_path       TEXT,
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS bm_proformas_project_idx ON bm_proformas (project_id);
DROP TRIGGER IF EXISTS bm_proformas_touch ON bm_proformas;
CREATE TRIGGER bm_proformas_touch BEFORE UPDATE ON bm_proformas FOR EACH ROW EXECUTE FUNCTION bm_touch();

CREATE TABLE IF NOT EXISTS bm_payments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID NOT NULL REFERENCES bm_projects(id) ON DELETE CASCADE,
  proforma_id  UUID REFERENCES bm_proformas(id) ON DELETE SET NULL,
  amount       NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  currency     TEXT NOT NULL DEFAULT 'USD',
  received_on  DATE NOT NULL DEFAULT current_date,
  method       TEXT,
  reference    TEXT,
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS bm_payments_project_idx ON bm_payments (project_id);
CREATE INDEX IF NOT EXISTS bm_payments_proforma_idx ON bm_payments (proforma_id);

-- ── Sent email ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bm_messages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID REFERENCES bm_projects(id) ON DELETE CASCADE,
  kind         TEXT NOT NULL CHECK (kind IN ('proposal', 'rfq', 'proforma', 'reminder', 'general')),
  related_id   UUID,
  from_email   TEXT NOT NULL,
  reply_to     TEXT,
  to_emails    TEXT[] NOT NULL,
  cc_emails    TEXT[] NOT NULL DEFAULT '{}',
  bcc_emails   TEXT[] NOT NULL DEFAULT '{}',
  subject      TEXT NOT NULL,
  body         TEXT NOT NULL,
  attachments  JSONB NOT NULL DEFAULT '[]',
  status       TEXT NOT NULL CHECK (status IN ('sent', 'failed')),
  provider_id  TEXT,
  error        TEXT,
  sent_by      UUID DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  sent_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS bm_messages_project_idx ON bm_messages (project_id, sent_at DESC);

-- ── Running numbers ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bm_counters (
  key    TEXT PRIMARY KEY,
  value  INTEGER NOT NULL DEFAULT 0
);

-- bm_next_number('P') -> 'BM-P-2026-001'. Atomic: two admins can't get the same number.
CREATE OR REPLACE FUNCTION bm_next_number(prefix TEXT) RETURNS TEXT
  LANGUAGE plpgsql AS $$
DECLARE
  yr TEXT := to_char(now() AT TIME ZONE 'Africa/Dar_es_Salaam', 'YYYY');
  n  INTEGER;
BEGIN
  IF NOT is_admin() THEN RAISE EXCEPTION 'Admins only'; END IF;
  INSERT INTO bm_counters (key, value) VALUES (prefix || '-' || yr, 1)
  ON CONFLICT (key) DO UPDATE SET value = bm_counters.value + 1
  RETURNING value INTO n;
  RETURN 'BM-' || prefix || '-' || yr || '-' || lpad(n::TEXT, 3, '0');
END $$;

-- Records a number given outside the counter (an imported planner file), so
-- the counter never hands it out again.
CREATE OR REPLACE FUNCTION bm_note_number(num TEXT) RETURNS VOID
  LANGUAGE plpgsql AS $$
DECLARE
  m TEXT[] := regexp_match(num, '^BM-([A-Z]+)-(\d{4})-(\d+)$');
BEGIN
  IF NOT is_admin() THEN RAISE EXCEPTION 'Admins only'; END IF;
  IF m IS NULL THEN RETURN; END IF;
  INSERT INTO bm_counters (key, value) VALUES (m[1] || '-' || m[2], m[3]::INTEGER)
  ON CONFLICT (key) DO UPDATE SET value = GREATEST(bm_counters.value, EXCLUDED.value);
END $$;

GRANT EXECUTE ON FUNCTION bm_next_number(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION bm_note_number(TEXT) TO authenticated;

-- ── Access: admins only ─────────────────────────────────────────────────────
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['bm_parties', 'bm_projects', 'bm_proposals', 'bm_rfqs', 'bm_proformas', 'bm_payments', 'bm_messages', 'bm_counters']
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', t || '_admin', t);
    EXECUTE format('CREATE POLICY %I ON %I FOR ALL USING (is_admin()) WITH CHECK (is_admin())', t || '_admin', t);
  END LOOP;
END $$;

-- ── Private file bucket ─────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('bm-files', 'bm-files', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "bm_files_admin" ON storage.objects;
CREATE POLICY "bm_files_admin" ON storage.objects FOR ALL
  USING (bucket_id = 'bm-files' AND is_admin())
  WITH CHECK (bucket_id = 'bm-files' AND is_admin());
