import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUPABASE_SQL_SCHEMA } from '../data/supabaseSchema';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Database, 
  ShieldAlert, 
  Lock, 
  FileCode, 
  Layers, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const SupabaseModal: React.FC = () => {
  const { isSupabaseModalOpen, setIsSupabaseModalOpen } = useApp();
  const [activeTab, setActiveTab] = useState<'sql' | 'architecture' | 'rls'>('sql');
  const [copied, setCopied] = useState(false);

  if (!isSupabaseModalOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownload = () => {
    const blob = new Blob([SUPABASE_SQL_SCHEMA], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dr_salim_hospital_supabase_schema.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Supabase Database Schema & RLS Policies</h2>
                <span className="text-[11px] font-medium text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                  PostgreSQL 15+ Compatible
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Ready-to-deploy schema and policies enforcing patient privacy isolation & staff administrative operations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 shadow-2xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 rounded-md hover:bg-emerald-800 shadow-2xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .sql</span>
            </button>
            <button
              onClick={() => setIsSupabaseModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors ml-2"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-navigation tabs */}
        <div className="px-6 py-2 border-b border-slate-200 bg-white flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors inline-flex items-center gap-1.5 ${
              activeTab === 'sql'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Complete SQL Script</span>
          </button>
          <button
            onClick={() => setActiveTab('rls')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors inline-flex items-center gap-1.5 ${
              activeTab === 'rls'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>RLS Policies & Patient Isolation</span>
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors inline-flex items-center gap-1.5 ${
              activeTab === 'architecture'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Schema Architecture & Triggers</span>
          </button>
        </div>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 font-sans">
          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Copy and paste this script directly into your Supabase Dashboard SQL Editor:</span>
                <span className="font-mono text-[11px] text-slate-400">Total lines: ~240</span>
              </div>
              <div className="relative rounded-lg border border-slate-800 bg-slate-950 overflow-hidden shadow-inner">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/90 text-slate-400 text-xs">
                  <span className="font-mono text-emerald-400">supabase_schema.sql</span>
                  <button
                    onClick={handleCopy}
                    className="text-xs text-slate-300 hover:text-white flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-[58vh]">
                  <code>{SUPABASE_SQL_SCHEMA}</code>
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'rls' && (
            <div className="space-y-6 max-w-4xl">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 space-y-1">
                  <p className="font-bold">Database-Level Patient Isolation Guarantee</p>
                  <p className="leading-relaxed">
                    Under Supabase Row Level Security (RLS), access control is not implemented on the client—it is enforced directly by PostgreSQL. 
                    Even if a malicious user inspects network calls or attempts direct REST calls via the Supabase client, the database guarantees they can NEVER read or write another patient's data.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Policy 1 */}
                <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900">1. Appointments Isolation</span>
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">SELECT</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">
                    Patients can only retrieve records where <code className="text-teal-700 bg-teal-50 px-1 py-0.5 rounded">auth.uid() = patient_id</code>. Staff & admins have full operational visibility.
                  </p>
                  <pre className="bg-slate-900 text-slate-200 p-2.5 rounded text-[11px] font-mono overflow-x-auto">
{`CREATE POLICY "appointments_select_policy"
ON public.appointments FOR SELECT
USING (
  auth.uid() = patient_id
  OR public.is_staff_or_admin()
);`}
                  </pre>
                </div>

                {/* Policy 2 */}
                <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900">2. Profile Privacy & HIPAA Compliance</span>
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">SELECT / UPDATE</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">
                    A patient’s medical history, blood group, allergies, and contact information can only be queried by themselves or verified clinic staff.
                  </p>
                  <pre className="bg-slate-900 text-slate-200 p-2.5 rounded text-[11px] font-mono overflow-x-auto">
{`CREATE POLICY "profiles_select_policy"
ON public.profiles FOR SELECT
USING (
  auth.uid() = id
  OR public.is_staff_or_admin()
);`}
                  </pre>
                </div>

                {/* Policy 3 */}
                <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900">3. Booking Creation Protection</span>
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">INSERT</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">
                    Prevents spoofing patient IDs. The <code className="text-teal-700 bg-teal-50 px-1 py-0.5 rounded">WITH CHECK</code> constraint ensures patients can only insert an appointment if their token matches the patient_id.
                  </p>
                  <pre className="bg-slate-900 text-slate-200 p-2.5 rounded text-[11px] font-mono overflow-x-auto">
{`CREATE POLICY "appointments_patient_insert"
ON public.appointments FOR INSERT
WITH CHECK (
  auth.uid() = patient_id
  OR public.is_staff_or_admin()
);`}
                  </pre>
                </div>

                {/* Policy 4 */}
                <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900">4. Doctor Schedule Management</span>
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">ALL</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">
                    Patients can read active doctor schedules to pick slots, but only verified staff can block slots, add emergency capacity, or modify hours.
                  </p>
                  <pre className="bg-slate-900 text-slate-200 p-2.5 rounded text-[11px] font-mono overflow-x-auto">
{`CREATE POLICY "doctor_schedules_staff_modify"
ON public.doctor_schedules FOR ALL
USING (public.is_staff_or_admin())
WITH CHECK (public.is_staff_or_admin());`}
                  </pre>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-6 max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                    <span>1. Core Schema Tables</span>
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-2">
                    <li><strong className="text-slate-800">public.profiles</strong>: Auth user profiles, role (patient/staff/admin), medical alerts.</li>
                    <li><strong className="text-slate-800">public.specialties</strong>: Dental, Internal Medicine, Surgery, OB/GYN, Home Nursing.</li>
                    <li><strong className="text-slate-800">public.doctors</strong>: Credentials, consultation fees, rooms, availability status.</li>
                    <li><strong className="text-slate-800">public.doctor_schedules</strong>: Slot date, time, and real-time status.</li>
                    <li><strong className="text-slate-800">public.appointments</strong>: Full appointment lifecycle and clinical notes.</li>
                  </ul>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    <span>2. PostgreSQL Enums</span>
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-2">
                    <li><code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">user_role</code>: patient, staff, admin</li>
                    <li><code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">specialty_type</code>: dental, internal_medicine, surgery, obgyn, home_nursing</li>
                    <li><code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">visit_type</code>: in_clinic, home_visit, video</li>
                    <li><code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">appointment_status</code>: confirmed, pending, completed, cancelled</li>
                    <li><code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">doctor_availability_status</code>: available, in_consultation, break, off_duty</li>
                  </ul>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                    <span>3. Automated Triggers</span>
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-2">
                    <li><strong className="text-slate-800">handle_new_user()</strong>: Automatically inserts a row into <code className="text-teal-700 bg-teal-50 px-1 py-0.5 rounded text-[10px]">profiles</code> when an auth signup occurs in Supabase.</li>
                    <li><strong className="text-slate-800">handle_appointment_booked()</strong>: Automatically sets schedule slot status to 'booked' upon reservation, and frees it to 'available' if cancelled.</li>
                  </ul>
                </div>

              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <h4 className="text-xs font-bold text-slate-900 mb-2">Supabase Client Connection Pattern (TypeScript)</h4>
                <pre className="bg-slate-900 text-slate-200 p-3 rounded text-xs font-mono overflow-x-auto leading-relaxed">
{`import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Example: Fetch appointments. Because of RLS, this automatically only returns
// appointments owned by the authenticated patient!
export async function getMyAppointments() {
  const { data, error } = await supabase
    .from('appointments')
    .select('*, doctors(name, specialty, room_or_area)')
    .order('appointment_date', { ascending: true });
    
  return { data, error };
}`}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between shrink-0 text-xs text-slate-500">
          <span>Dr. Salim Hospital 2.0 · Clinical Database Engine</span>
          <button
            onClick={() => setIsSupabaseModalOpen(false)}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors font-medium"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
