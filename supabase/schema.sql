-- ==============================================================================
-- CareerFlow: Production Database Schema & Row-Level Security (RLS)
-- ==============================================================================
-- Target: Supabase PostgreSQL (Postgres 15+)
-- Target Audience: Final-year students & early career applicants
-- Description: Per-user isolated job application tracking schema with automated
-- timestamp maintenance and optimized indices for date-filtering and status pipelines.

-- 1. Enable UUID Extension (standard in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Custom ENUM or CHECK constraint for Application Status
-- Values: Saved, Applied, Assessment, Interview, Offer, Rejected, Withdrawn
DO $$ BEGIN
    CREATE TYPE application_status AS ENUM (
        'Saved',
        'Applied',
        'Assessment',
        'Interview',
        'Offer',
        'Rejected',
        'Withdrawn'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Create Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    job_url TEXT,
    salary VARCHAR(100),
    employment_type VARCHAR(50) DEFAULT 'Full-time',
    status application_status NOT NULL DEFAULT 'Applied',
    source VARCHAR(100) DEFAULT 'Direct / Other',
    application_date DATE NOT NULL DEFAULT CURRENT_DATE,
    assessment_date TIMESTAMPTZ,
    interview_date TIMESTAMPTZ,
    follow_up_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
-- Crucial Requirement: Every tenant only has visibility and mutation rights on their own rows.
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- 5. Define Strict RLS Policies for CRUD
DROP POLICY IF EXISTS "Users can view own applications" ON public.applications;
CREATE POLICY "Users can view own applications"
    ON public.applications
    FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own applications" ON public.applications;
CREATE POLICY "Users can insert own applications"
    ON public.applications
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own applications" ON public.applications;
CREATE POLICY "Users can update own applications"
    ON public.applications
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own applications" ON public.applications;
CREATE POLICY "Users can delete own applications"
    ON public.applications
    FOR DELETE
    USING (auth.uid() = user_id);

-- 6. High-Performance Indices for Search, Filter, Sort and Upcoming Deadlines
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(user_id, status);
CREATE INDEX IF NOT EXISTS idx_applications_application_date ON public.applications(user_id, application_date DESC);
CREATE INDEX IF NOT EXISTS idx_applications_assessment_date ON public.applications(user_id, assessment_date ASC) WHERE assessment_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_applications_interview_date ON public.applications(user_id, interview_date ASC) WHERE interview_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_applications_follow_up_date ON public.applications(user_id, follow_up_date ASC) WHERE follow_up_date IS NOT NULL;

-- 7. Trigger to Automatically Update 'updated_at' Timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_applications_updated_at ON public.applications;
CREATE TRIGGER set_applications_updated_at
    BEFORE UPDATE ON public.applications
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

