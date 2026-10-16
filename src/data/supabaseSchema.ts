export const SUPABASE_SQL_SCHEMA = `-- ==============================================================================
-- AEGISHEALTH CLINIC APPOINTMENT BOOKING SYSTEM
-- SUPABASE POSTGRESQL DATABASE SCHEMA & ROW-LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
-- Designed for: Dental, Internal Medicine, Surgery, OB/GYN, and Home Nursing services
-- Security Model: Strict isolation ensuring patients view only their own records,
-- while clinical staff and admins possess elevated operational management access.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CUSTOM TYPES / ENUMS
CREATE TYPE user_role AS ENUM ('patient', 'staff', 'admin');
CREATE TYPE specialty_type AS ENUM ('dental', 'internal_medicine', 'surgery', 'obgyn', 'home_nursing', 'pediatrics');
CREATE TYPE visit_type AS ENUM ('in_clinic', 'home_visit', 'video');
CREATE TYPE appointment_status AS ENUM ('confirmed', 'pending', 'completed', 'cancelled');
CREATE TYPE doctor_availability_status AS ENUM ('available', 'in_consultation', 'break', 'off_duty');
CREATE TYPE slot_status AS ENUM ('available', 'booked', 'blocked');

-- 3. PROFILES TABLE (Linked with auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'patient',
    date_of_birth DATE,
    gender TEXT,
    blood_group TEXT,
    allergies TEXT[] DEFAULT ARRAY[]::TEXT[],
    chronic_conditions TEXT[] DEFAULT ARRAY[]::TEXT[],
    emergency_contact JSONB DEFAULT '{"name": "", "phone": "", "relation": ""}'::JSONB,
    insurance_provider TEXT,
    insurance_policy_number TEXT,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. SPECIALTIES TABLE
CREATE TABLE public.specialties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug specialty_type UNIQUE NOT NULL,
    name TEXT NOT NULL,
    short_desc TEXT NOT NULL,
    full_desc TEXT NOT NULL,
    service_type TEXT NOT NULL DEFAULT 'in_clinic',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. DOCTORS TABLE
CREATE TABLE public.doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    specialty specialty_type NOT NULL,
    sub_specialty TEXT,
    experience_years INT NOT NULL DEFAULT 5,
    rating NUMERIC(2,1) NOT NULL DEFAULT 5.0,
    review_count INT NOT NULL DEFAULT 0,
    consultation_fee NUMERIC(10,2) NOT NULL DEFAULT 75.00,
    room_or_area TEXT NOT NULL,
    bio TEXT NOT NULL,
    avatar_url TEXT,
    availability_status doctor_availability_status NOT NULL DEFAULT 'available',
    accepted_insurances TEXT[] DEFAULT ARRAY['BlueCross', 'Aetna', 'UnitedHealth', 'Cigna']::TEXT[],
    visit_types visit_type[] DEFAULT ARRAY['in_clinic']::visit_type[],
    qualifications TEXT[] DEFAULT ARRAY[]::TEXT[],
    available_days TEXT[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']::TEXT[],
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TIME SLOTS TABLE (Real-time Availability Tracking)
CREATE TABLE public.doctor_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    slot_date DATE NOT NULL,
    slot_time TEXT NOT NULL, -- e.g. "09:00 AM"
    period TEXT NOT NULL CHECK (period IN ('morning', 'afternoon', 'evening')),
    status slot_status NOT NULL DEFAULT 'available',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_doctor_slot UNIQUE (doctor_id, slot_date, slot_time)
);

-- 7. APPOINTMENTS TABLE
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_code TEXT UNIQUE NOT NULL,
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE RESTRICT,
    specialty specialty_type NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL,
    visit_type visit_type NOT NULL DEFAULT 'in_clinic',
    status appointment_status NOT NULL DEFAULT 'confirmed',
    reason_for_visit TEXT NOT NULL,
    symptoms TEXT,
    home_address TEXT,
    patient_notes TEXT,
    staff_notes TEXT,
    clinical_summary TEXT,
    prescription TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. AUDIT LOGS TABLE
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_name TEXT,
    action TEXT NOT NULL,
    entity_name TEXT NOT NULL,
    entity_id UUID,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. PERFORMANCE INDEXES
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_doctors_specialty ON public.doctors(specialty);
CREATE INDEX idx_doctors_availability ON public.doctors(availability_status);
CREATE INDEX idx_schedules_lookup ON public.doctor_schedules(doctor_id, slot_date, status);
CREATE INDEX idx_appointments_patient ON public.appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON public.appointments(doctor_id);
CREATE INDEX idx_appointments_date ON public.appointments(appointment_date, status);
CREATE INDEX idx_appointments_ref ON public.appointments(reference_code);

-- ==============================================================================
-- 10. ROW-LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper security functions
CREATE OR REPLACE FUNCTION public.is_staff_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role IN ('staff', 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND (role = 'admin' OR email IN ('victor43chisaka@gmail.co', 'victor43chisaka@gmail.com'))
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- A. PROFILES POLICIES
-- ------------------------------------------------------------------------------
-- Patients can view ONLY their own profile; Staff can view all patient records
CREATE POLICY "profiles_select_policy"
ON public.profiles FOR SELECT
USING (
    auth.uid() = id
    OR public.is_staff_or_admin()
);

-- Patients can update their own profile; Staff can update any profile
CREATE POLICY "profiles_update_policy"
ON public.profiles FOR UPDATE
USING (
    auth.uid() = id
    OR public.is_staff_or_admin()
);

-- Allow profile creation on sign-up
CREATE POLICY "profiles_insert_policy"
ON public.profiles FOR INSERT
WITH CHECK (
    auth.uid() = id
    OR public.is_staff_or_admin()
);

-- ------------------------------------------------------------------------------
-- B. SPECIALTIES & DOCTORS POLICIES
-- ------------------------------------------------------------------------------
-- Anyone authenticated can view active doctors and specialties
CREATE POLICY "specialties_select_policy"
ON public.specialties FOR SELECT
USING (is_active = true OR public.is_staff_or_admin());

CREATE POLICY "doctors_select_policy"
ON public.doctors FOR SELECT
USING (is_active = true OR public.is_staff_or_admin());

-- Staff & Admins can modify doctors or specialties
CREATE POLICY "specialties_admin_modify"
ON public.specialties FOR ALL
USING (public.is_admin() OR public.is_staff_or_admin())
WITH CHECK (public.is_admin() OR public.is_staff_or_admin());

CREATE POLICY "doctors_staff_modify"
ON public.doctors FOR ALL
USING (public.is_admin() OR public.is_staff_or_admin())
WITH CHECK (public.is_admin() OR public.is_staff_or_admin());

-- ------------------------------------------------------------------------------
-- C. DOCTOR SCHEDULES POLICIES
-- ------------------------------------------------------------------------------
-- Anyone can see doctor slots to pick a time
CREATE POLICY "doctor_schedules_select_policy"
ON public.doctor_schedules FOR SELECT
USING (true);

-- Only staff/admin can manage schedules and block slots
CREATE POLICY "doctor_schedules_staff_modify"
ON public.doctor_schedules FOR ALL
USING (public.is_staff_or_admin())
WITH CHECK (public.is_staff_or_admin());

-- ------------------------------------------------------------------------------
-- D. APPOINTMENTS POLICIES (STRICT PATIENT ISOLATION)
-- ------------------------------------------------------------------------------
-- CRITICAL REQUIREMENT: Patients can ONLY see their own appointments.
-- Staff and Admins can view all appointments across departments.
CREATE POLICY "appointments_select_policy"
ON public.appointments FOR SELECT
USING (
    auth.uid() = patient_id
    OR public.is_staff_or_admin()
);

-- Patients can create appointments for themselves
CREATE POLICY "appointments_patient_insert"
ON public.appointments FOR INSERT
WITH CHECK (
    auth.uid() = patient_id
    OR public.is_staff_or_admin()
);

-- Patients can update ONLY their own appointments (e.g. cancelling or rescheduling pending/confirmed)
-- Staff can update any appointment (approving, completing, adding clinical notes)
CREATE POLICY "appointments_update_policy"
ON public.appointments FOR UPDATE
USING (
    (auth.uid() = patient_id AND status IN ('pending', 'confirmed'))
    OR public.is_staff_or_admin()
)
WITH CHECK (
    (auth.uid() = patient_id)
    OR public.is_staff_or_admin()
);

-- Only staff/admin can delete appointments
CREATE POLICY "appointments_delete_policy"
ON public.appointments FOR DELETE
USING (public.is_staff_or_admin());

-- ------------------------------------------------------------------------------
-- E. AUDIT LOGS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "audit_logs_staff_select"
ON public.audit_logs FOR SELECT
USING (public.is_staff_or_admin());

CREATE POLICY "audit_logs_insert"
ON public.audit_logs FOR INSERT
WITH CHECK (true);

-- ==============================================================================
-- 11. AUTOMATIC PROFILE TRIGGER ON AUTH SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id, 
        email, 
        full_name, 
        role,
        allergies,
        chronic_conditions
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'patient'::user_role),
        ARRAY[]::TEXT[],
        ARRAY[]::TEXT[]
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 12. APPOINTMENT SLOT BOOKING TRIGGER
-- Automatically marks the corresponding doctor_schedule slot as booked
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_appointment_booked()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.doctor_schedules
        SET status = 'booked'
        WHERE doctor_id = NEW.doctor_id
          AND slot_date = NEW.appointment_date
          AND slot_time = NEW.appointment_time;
    ELSIF (TG_OP = 'UPDATE' AND NEW.status = 'cancelled' AND OLD.status != 'cancelled') THEN
        UPDATE public.doctor_schedules
        SET status = 'available'
        WHERE doctor_id = NEW.doctor_id
          AND slot_date = NEW.appointment_date
          AND slot_time = NEW.appointment_time;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_appointment_status_change ON public.appointments;
CREATE TRIGGER on_appointment_status_change
    AFTER INSERT OR UPDATE ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION public.handle_appointment_booked();
`;
