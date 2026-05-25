-- ================================================================
--  JAMEX GLOBAL MARKETS — COMPLETE DATABASE SCHEMA  v1.0
--  Single source of truth. Safe to re-run (idempotent).
--  Run the full file in Supabase SQL Editor.
-- ================================================================

-- 1. PROFILES (auto-created on signup via trigger)
CREATE TABLE IF NOT EXISTS public.profiles (
  id             UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name      TEXT,
  avatar_url     TEXT,
  referral_code  TEXT UNIQUE,
  account_status TEXT NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'blocked')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. WALLETS
CREATE TABLE IF NOT EXISTS public.wallets (
  id             UUID         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID         NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  main_balance   NUMERIC(18,2) NOT NULL DEFAULT 0.00,
  profit_balance NUMERIC(18,2) NOT NULL DEFAULT 0.00,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- 3. TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.transactions (
  id                  UUID          NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id             UUID          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type                TEXT          NOT NULL CHECK (type IN ('deposit','withdrawal','transfer','profit')),
  amount              NUMERIC(18,2) NOT NULL,
  asset               TEXT          NOT NULL DEFAULT 'USD',
  status              TEXT          NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','completed','failed')),
  destination_address TEXT,
  created_at          TIMESTAMPTZ   NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tx_user   ON public.transactions (user_id);
CREATE INDEX IF NOT EXISTS idx_tx_type   ON public.transactions (type, status);
CREATE INDEX IF NOT EXISTS idx_tx_date   ON public.transactions (created_at DESC);

-- 4. INVESTMENT PLANS (admin-managed)
CREATE TABLE IF NOT EXISTS public.investment_plans (
  id            UUID          NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT          NOT NULL UNIQUE,
  tier          TEXT          NOT NULL DEFAULT 'Standard',
  daily_yield   NUMERIC(8,4)  NOT NULL DEFAULT 0,
  duration_days INTEGER       NOT NULL DEFAULT 30,
  min_amount    NUMERIC(18,2) DEFAULT 0,
  max_amount    NUMERIC(18,2),
  is_active     BOOLEAN       NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- Insert Default Investment Plans
INSERT INTO public.investment_plans (name, tier, daily_yield, duration_days, min_amount, max_amount, is_active)
VALUES 
  ('Starter Plan', 'Starter', 1.5, 30, 100, 999, true),
  ('Professional Plan', 'Professional', 2.5, 60, 1000, 4999, true),
  ('Executive Plan', 'Executive', 4.0, 90, 5000, 19999, true),
  ('VIP Platinum', 'VIP', 6.0, 120, 20000, NULL, true)
ON CONFLICT (name) DO NOTHING;

-- 5. INVESTMENTS
CREATE TABLE IF NOT EXISTS public.investments (
  id               UUID          NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          UUID          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_name        TEXT          NOT NULL,
  amount           NUMERIC(18,2) NOT NULL,
  expected_roi     NUMERIC(8,4)  NOT NULL DEFAULT 0,
  status           TEXT          NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','completed')),
  next_payout_date TIMESTAMPTZ,
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_inv_user   ON public.investments (user_id);
CREATE INDEX IF NOT EXISTS idx_inv_status ON public.investments (status);

-- 6. KYC SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.kyc_submissions (
  id               UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          UUID        NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name       TEXT        NOT NULL,
  last_name        TEXT        NOT NULL,
  date_of_birth    TEXT        NOT NULL,
  country          TEXT        NOT NULL,
  address          TEXT        NOT NULL,
  city             TEXT        NOT NULL,
  postal_code      TEXT        NOT NULL,
  front_id_url     TEXT,
  back_id_url      TEXT,
  selfie_url       TEXT,
  status           TEXT        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  rejection_reason TEXT,
  submitted_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_kyc_status  ON public.kyc_submissions (status);
CREATE INDEX IF NOT EXISTS idx_kyc_country ON public.kyc_submissions (country);

-- 7. LOANS
CREATE TABLE IF NOT EXISTS public.loans (
  id              UUID          NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_name    TEXT          NOT NULL,
  principal       NUMERIC(18,2) NOT NULL,
  duration_months INTEGER       NOT NULL,
  down_payment    NUMERIC(18,2) DEFAULT 0,
  status          TEXT          NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','completed','defaulted')),
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_loans_user ON public.loans (user_id);

-- 8. LOAN REPAYMENTS
CREATE TABLE IF NOT EXISTS public.loan_repayments (
  id               UUID          NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  loan_id          UUID          NOT NULL REFERENCES public.loans(id) ON DELETE CASCADE,
  user_id          UUID          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  due_date         DATE          NOT NULL,
  amount           NUMERIC(18,2) NOT NULL,
  principal_part   NUMERIC(18,2) DEFAULT 0,
  interest_part    NUMERIC(18,2) DEFAULT 0,
  status           TEXT          NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid')),
  auto_pay_enabled BOOLEAN       NOT NULL DEFAULT false
);
CREATE INDEX IF NOT EXISTS idx_rep_loan ON public.loan_repayments (loan_id);
CREATE INDEX IF NOT EXISTS idx_rep_user ON public.loan_repayments (user_id);

-- 9. REFERRALS
CREATE TABLE IF NOT EXISTS public.referrals (
  id          UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id UUID        NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  status      TEXT        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','inactive')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ref_referrer ON public.referrals (referrer_id);

-- 10. REFERRAL ACTIVITY
CREATE TABLE IF NOT EXISTS public.referral_activity (
  id             UUID          NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_user_id UUID          REFERENCES auth.users(id) ON DELETE SET NULL,
  type           TEXT          NOT NULL,
  amount         NUMERIC(10,2) NOT NULL DEFAULT 0,
  status         TEXT          NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processed')),
  created_at     TIMESTAMPTZ   NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_refact_user ON public.referral_activity (user_id);

-- 11. USER SETTINGS
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id                  UUID    PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  two_factor_enabled       BOOLEAN NOT NULL DEFAULT false,
  base_currency            TEXT    DEFAULT 'USD - US Dollar',
  timezone                 TEXT    DEFAULT '(GMT -05:00) Eastern Time',
  date_format              TEXT    DEFAULT 'MM/DD/YYYY',
  notification_preferences JSONB   DEFAULT '{"market_execution_email":true,"market_execution_push":true,"wallet_email":true,"wallet_push":false,"security_email":true,"security_push":true}'::jsonb,
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. SUPPORT TICKETS
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id          UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject     TEXT        NOT NULL,
  message     TEXT        NOT NULL,
  status      TEXT        NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved','closed')),
  priority    TEXT        NOT NULL DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
  category    TEXT        NOT NULL DEFAULT 'general',
  admin_reply TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tickets_user   ON public.support_tickets (user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.support_tickets (status);

-- ================================================================
-- 13. FUNCTIONS & TRIGGERS
-- ================================================================

-- Auto-create profile + wallet + settings on every new signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, referral_code, account_status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)),
    NEW.raw_user_meta_data->>'avatar_url',
    'ref-' || UPPER(SUBSTRING(REPLACE(NEW.id::text,'-',''),1,8)),
    'active'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.wallets (user_id) VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.user_settings (user_id) VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Auto-update updated_at on any UPDATE
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_upd       ON public.profiles;
CREATE TRIGGER trg_profiles_upd       BEFORE UPDATE ON public.profiles          FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
DROP TRIGGER IF EXISTS trg_wallets_upd        ON public.wallets;
CREATE TRIGGER trg_wallets_upd        BEFORE UPDATE ON public.wallets            FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
DROP TRIGGER IF EXISTS trg_kyc_upd            ON public.kyc_submissions;
CREATE TRIGGER trg_kyc_upd            BEFORE UPDATE ON public.kyc_submissions    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
DROP TRIGGER IF EXISTS trg_plans_upd          ON public.investment_plans;
CREATE TRIGGER trg_plans_upd          BEFORE UPDATE ON public.investment_plans   FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
DROP TRIGGER IF EXISTS trg_settings_upd       ON public.user_settings;
CREATE TRIGGER trg_settings_upd       BEFORE UPDATE ON public.user_settings      FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
DROP TRIGGER IF EXISTS trg_tickets_upd        ON public.support_tickets;
CREATE TRIGGER trg_tickets_upd        BEFORE UPDATE ON public.support_tickets    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- ================================================================
-- 14. ROW LEVEL SECURITY
--   Pattern: users see/edit only their own rows.
--   Admin (akugbof@gmail.com) gets a separate FOR ALL policy that
--   matches their JWT email — bypasses all user restrictions.
--   All legacy policy names are dropped first for a clean slate.
-- ================================================================

ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_plans  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_submissions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_repayments   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets   ENABLE ROW LEVEL SECURITY;

-- ── PROFILES ──
DROP POLICY IF EXISTS "profiles_select_own"  ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own"  ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own"  ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_all"   ON public.profiles;
DROP POLICY IF EXISTS "users_read_own_profile"    ON public.profiles;
DROP POLICY IF EXISTS "users_update_own_profile"  ON public.profiles;
DROP POLICY IF EXISTS "admin_all_profiles"         ON public.profiles;
DROP POLICY IF EXISTS "admin_read_all_profiles"    ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_admin_all"  ON public.profiles FOR ALL    TO authenticated USING ((auth.jwt()->>'email') = 'akugbof@gmail.com');

-- ── WALLETS ──
DROP POLICY IF EXISTS "wallets_select_own"   ON public.wallets;
DROP POLICY IF EXISTS "wallets_update_own"   ON public.wallets;
DROP POLICY IF EXISTS "wallets_admin_all"    ON public.wallets;
DROP POLICY IF EXISTS "users_read_own_wallet"   ON public.wallets;
DROP POLICY IF EXISTS "users_update_own_wallet" ON public.wallets;
DROP POLICY IF EXISTS "admin_all_wallets"        ON public.wallets;
DROP POLICY IF EXISTS "admin_read_all_wallets"   ON public.wallets;

CREATE POLICY "wallets_select_own" ON public.wallets FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "wallets_update_own" ON public.wallets FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "wallets_admin_all"  ON public.wallets FOR ALL    TO authenticated USING ((auth.jwt()->>'email') = 'akugbof@gmail.com');

-- ── TRANSACTIONS ──
DROP POLICY IF EXISTS "transactions_select_own"  ON public.transactions;
DROP POLICY IF EXISTS "transactions_insert_own"  ON public.transactions;
DROP POLICY IF EXISTS "transactions_admin_all"   ON public.transactions;
DROP POLICY IF EXISTS "users_read_own_transactions"    ON public.transactions;
DROP POLICY IF EXISTS "users_insert_own_transactions"  ON public.transactions;
DROP POLICY IF EXISTS "admin_all_transactions"          ON public.transactions;
DROP POLICY IF EXISTS "admin_read_all_transactions"     ON public.transactions;

CREATE POLICY "transactions_select_own" ON public.transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "transactions_insert_own" ON public.transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "transactions_admin_all"  ON public.transactions FOR ALL    TO authenticated USING ((auth.jwt()->>'email') = 'akugbof@gmail.com');

-- ── INVESTMENT PLANS ──
DROP POLICY IF EXISTS "plans_select_all" ON public.investment_plans;
DROP POLICY IF EXISTS "plans_admin_all"  ON public.investment_plans;

CREATE POLICY "plans_select_all" ON public.investment_plans FOR SELECT TO authenticated USING (true);
CREATE POLICY "plans_admin_all"  ON public.investment_plans FOR ALL    TO authenticated USING ((auth.jwt()->>'email') = 'akugbof@gmail.com');

-- ── INVESTMENTS ──
DROP POLICY IF EXISTS "investments_select_own"  ON public.investments;
DROP POLICY IF EXISTS "investments_insert_own"  ON public.investments;
DROP POLICY IF EXISTS "investments_admin_all"   ON public.investments;
DROP POLICY IF EXISTS "users_read_own_investments"    ON public.investments;
DROP POLICY IF EXISTS "users_insert_own_investments"  ON public.investments;
DROP POLICY IF EXISTS "admin_all_investments"          ON public.investments;
DROP POLICY IF EXISTS "admin_read_all_investments"     ON public.investments;

CREATE POLICY "investments_select_own" ON public.investments FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "investments_insert_own" ON public.investments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "investments_admin_all"  ON public.investments FOR ALL    TO authenticated USING ((auth.jwt()->>'email') = 'akugbof@gmail.com');

-- ── KYC SUBMISSIONS ──
DROP POLICY IF EXISTS "kyc_select_own"   ON public.kyc_submissions;
DROP POLICY IF EXISTS "kyc_insert_own"   ON public.kyc_submissions;
DROP POLICY IF EXISTS "kyc_update_own"   ON public.kyc_submissions;
DROP POLICY IF EXISTS "kyc_admin_all"    ON public.kyc_submissions;
DROP POLICY IF EXISTS "users_read_own_kyc"    ON public.kyc_submissions;
DROP POLICY IF EXISTS "users_insert_own_kyc"  ON public.kyc_submissions;
DROP POLICY IF EXISTS "users_update_own_kyc"  ON public.kyc_submissions;
DROP POLICY IF EXISTS "admin_all_kyc"          ON public.kyc_submissions;
DROP POLICY IF EXISTS "admin_read_all_kyc"     ON public.kyc_submissions;

CREATE POLICY "kyc_select_own" ON public.kyc_submissions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "kyc_insert_own" ON public.kyc_submissions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "kyc_update_own" ON public.kyc_submissions FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "kyc_admin_all"  ON public.kyc_submissions FOR ALL    TO authenticated USING ((auth.jwt()->>'email') = 'akugbof@gmail.com');

-- ── LOANS ──
DROP POLICY IF EXISTS "loans_select_own"  ON public.loans;
DROP POLICY IF EXISTS "loans_insert_own"  ON public.loans;
DROP POLICY IF EXISTS "loans_admin_all"   ON public.loans;
DROP POLICY IF EXISTS "users_read_own_loans"    ON public.loans;
DROP POLICY IF EXISTS "users_insert_own_loans"  ON public.loans;
DROP POLICY IF EXISTS "admin_all_loans"          ON public.loans;

CREATE POLICY "loans_select_own" ON public.loans FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "loans_insert_own" ON public.loans FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "loans_admin_all"  ON public.loans FOR ALL    TO authenticated USING ((auth.jwt()->>'email') = 'akugbof@gmail.com');

-- ── LOAN REPAYMENTS ──
DROP POLICY IF EXISTS "repayments_select_own"  ON public.loan_repayments;
DROP POLICY IF EXISTS "repayments_insert_own"  ON public.loan_repayments;
DROP POLICY IF EXISTS "repayments_update_own"  ON public.loan_repayments;
DROP POLICY IF EXISTS "repayments_admin_all"   ON public.loan_repayments;
DROP POLICY IF EXISTS "users_read_own_repayments"    ON public.loan_repayments;
DROP POLICY IF EXISTS "users_insert_own_repayments"  ON public.loan_repayments;
DROP POLICY IF EXISTS "users_update_own_repayments"  ON public.loan_repayments;
DROP POLICY IF EXISTS "admin_all_repayments"          ON public.loan_repayments;

CREATE POLICY "repayments_select_own" ON public.loan_repayments FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "repayments_insert_own" ON public.loan_repayments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "repayments_update_own" ON public.loan_repayments FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "repayments_admin_all"  ON public.loan_repayments FOR ALL    TO authenticated USING ((auth.jwt()->>'email') = 'akugbof@gmail.com');

-- ── REFERRALS ──
DROP POLICY IF EXISTS "referrals_select_own"  ON public.referrals;
DROP POLICY IF EXISTS "referrals_insert_own"  ON public.referrals;
DROP POLICY IF EXISTS "referrals_admin_all"   ON public.referrals;
DROP POLICY IF EXISTS "Users can view their own referrals"              ON public.referrals;
DROP POLICY IF EXISTS "Users can insert referrals (when signing up)"    ON public.referrals;
DROP POLICY IF EXISTS "admin_all_referrals"                              ON public.referrals;

CREATE POLICY "referrals_select_own" ON public.referrals FOR SELECT TO authenticated USING (auth.uid() = referrer_id OR auth.uid() = referred_id);
CREATE POLICY "referrals_insert_own" ON public.referrals FOR INSERT TO authenticated WITH CHECK (auth.uid() = referred_id);
CREATE POLICY "referrals_admin_all"  ON public.referrals FOR ALL    TO authenticated USING ((auth.jwt()->>'email') = 'akugbof@gmail.com');

-- ── REFERRAL ACTIVITY ──
DROP POLICY IF EXISTS "refact_select_own"  ON public.referral_activity;
DROP POLICY IF EXISTS "refact_admin_all"   ON public.referral_activity;
DROP POLICY IF EXISTS "Users can view their own referral activities" ON public.referral_activity;
DROP POLICY IF EXISTS "admin_all_activity"                            ON public.referral_activity;

CREATE POLICY "refact_select_own" ON public.referral_activity FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "refact_admin_all"  ON public.referral_activity FOR ALL    TO authenticated USING ((auth.jwt()->>'email') = 'akugbof@gmail.com');

-- ── USER SETTINGS ──
DROP POLICY IF EXISTS "settings_crud_own"   ON public.user_settings;
DROP POLICY IF EXISTS "settings_admin_all"  ON public.user_settings;
DROP POLICY IF EXISTS "Users can view their own settings"   ON public.user_settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can insert their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "admin_all_settings"                   ON public.user_settings;

CREATE POLICY "settings_crud_own"  ON public.user_settings FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "settings_admin_all" ON public.user_settings FOR ALL TO authenticated USING ((auth.jwt()->>'email') = 'akugbof@gmail.com');

-- ── SUPPORT TICKETS ──
DROP POLICY IF EXISTS "tickets_crud_own"   ON public.support_tickets;
DROP POLICY IF EXISTS "tickets_admin_all"  ON public.support_tickets;

CREATE POLICY "tickets_crud_own"  ON public.support_tickets FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "tickets_admin_all" ON public.support_tickets FOR ALL TO authenticated USING ((auth.jwt()->>'email') = 'akugbof@gmail.com');

-- ================================================================
-- 15. STORAGE BUCKET — kyc-documents
-- ================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('kyc-documents', 'kyc-documents', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "kyc_storage_upload" ON storage.objects;
CREATE POLICY "kyc_storage_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'kyc-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "kyc_storage_read" ON storage.objects;
CREATE POLICY "kyc_storage_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'kyc-documents'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR (auth.jwt()->>'email') = 'akugbof@gmail.com'
    )
  );

-- ================================================================
-- 16. REALTIME PUBLICATIONS
-- ================================================================
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.wallets;           EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.investments;       EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.kyc_submissions;   EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.referrals;         EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.referral_activity; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.user_settings;     EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.support_tickets;   EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ================================================================
-- 13b. PLATFORM CONFIG  (single-row admin settings store)
-- ================================================================
CREATE TABLE IF NOT EXISTS public.platform_config (
  id                    INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  withdrawal_fee        NUMERIC(5,2)  NOT NULL DEFAULT 2.50,
  deposit_fee           NUMERIC(5,2)  NOT NULL DEFAULT 0.00,
  roi_cap_standard      NUMERIC(5,2)  NOT NULL DEFAULT 12.5,
  roi_cap_institutional NUMERIC(5,2)  NOT NULL DEFAULT 28.0,
  maintenance_mode      BOOLEAN       NOT NULL DEFAULT false,
  new_registrations     BOOLEAN       NOT NULL DEFAULT true,
  deposit_address_usdt  TEXT          NOT NULL DEFAULT '',
  deposit_address_eth   TEXT          NOT NULL DEFAULT '',
  deposit_address_btc   TEXT          NOT NULL DEFAULT '',
  advanced_config       JSONB         DEFAULT '{}'::jsonb,
  updated_at            TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- Add deposit address columns to existing instances (idempotent)
ALTER TABLE public.platform_config ADD COLUMN IF NOT EXISTS deposit_address_usdt TEXT NOT NULL DEFAULT '';
ALTER TABLE public.platform_config ADD COLUMN IF NOT EXISTS deposit_address_eth  TEXT NOT NULL DEFAULT '';
ALTER TABLE public.platform_config ADD COLUMN IF NOT EXISTS deposit_address_btc  TEXT NOT NULL DEFAULT '';

ALTER TABLE public.platform_config ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "platform_config_admin" ON public.platform_config;
CREATE POLICY "platform_config_admin" ON public.platform_config
  FOR ALL TO authenticated
  USING ((auth.jwt()->>'email') = 'akugbof@gmail.com');
-- Allow all authenticated users to read platform config (deposit addresses, fees)
DROP POLICY IF EXISTS "platform_config_read_all" ON public.platform_config;
CREATE POLICY "platform_config_read_all" ON public.platform_config
  FOR SELECT TO authenticated
  USING (true);

DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.platform_config; EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Ensure the single config row exists
INSERT INTO public.platform_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;


-- ================================================================
-- 17. BACKFILL — create missing rows for users who signed up before
--     this schema was applied (profiles, wallets, settings).
-- ================================================================
INSERT INTO public.profiles (id, full_name, referral_code)
SELECT
  id,
  COALESCE(raw_user_meta_data->>'full_name', split_part(email,'@',1)),
  'ref-' || UPPER(SUBSTRING(REPLACE(id::text,'-',''),1,8))
FROM auth.users
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.wallets (user_id)
SELECT id FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.user_settings (user_id)
SELECT id FROM auth.users
ON CONFLICT (user_id) DO NOTHING;
