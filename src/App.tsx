import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { SupabaseModal } from './components/SupabaseModal';
import { AuthModal } from './components/auth/AuthModal';
import { HospitalLogo } from './components/common/HospitalLogo';
import { LoadingSplash } from './components/common/LoadingSplash';
import { HospitalLandingPage } from './components/patient/HospitalLandingPage';
import { BookAppointmentFlow } from './components/patient/BookAppointmentFlow';
import { MyAppointmentsView } from './components/patient/MyAppointmentsView';
import { PatientProfileView } from './components/patient/PatientProfileView';
import { SpecialtiesView } from './components/patient/SpecialtiesView';
import { AdminOverview } from './components/admin/AdminOverview';
import { AdminBookingsView } from './components/admin/AdminBookingsView';
import { DoctorAvailabilityMonitor } from './components/admin/DoctorAvailabilityMonitor';
import { PatientRecordsView } from './components/admin/PatientRecordsView';
import { AdminManagementView } from './components/admin/AdminManagementView';
import { SpecialtySlug } from './types';
import { 
  Database, 
  RotateCcw, 
  ShieldCheck, 
  Heart, 
  PhoneCall, 
  Stethoscope 
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, isStaff, setIsSupabaseModalOpen, resetData, currentUser } = useApp();
  const [selectedSpecialtyForBooking, setSelectedSpecialtyForBooking] = useState<SpecialtySlug>('dental');
  
  // Initial loading splash state
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    return !sessionStorage.getItem('dr_salim_splash_shown');
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('dr_salim_splash_shown', 'true');
    setShowSplash(false);
  };

  const handleSelectSpecialtyFromGrid = (slug: SpecialtySlug) => {
    setSelectedSpecialtyForBooking(slug);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      
      {/* Loading Intro Splash Screen */}
      {showSplash && (
        <LoadingSplash onComplete={handleSplashComplete} durationMs={1600} />
      )}

      <Header />

      <main className="flex-1 pb-16">
        {/* Patient Views */}
        {!isStaff && (
          <>
            {activeTab === 'landing' && (
              <HospitalLandingPage onSelectSpecialty={handleSelectSpecialtyFromGrid} />
            )}
            {activeTab === 'book' && (
              <BookAppointmentFlow initialSpecialty={selectedSpecialtyForBooking} />
            )}
            {activeTab === 'specialties' && (
              <SpecialtiesView onSelectSpecialty={handleSelectSpecialtyFromGrid} />
            )}
            {activeTab === 'my-appointments' && (
              <MyAppointmentsView />
            )}
            {activeTab === 'profile' && (
              <PatientProfileView />
            )}
          </>
        )}

        {/* Staff & Admin Views */}
        {isStaff && (
          <>
            {activeTab === 'admin-overview' && (
              <AdminOverview />
            )}
            {activeTab === 'admin-bookings' && (
              <AdminBookingsView />
            )}
            {activeTab === 'admin-availability' && (
              <DoctorAvailabilityMonitor />
            )}
            {activeTab === 'admin-patients' && (
              <PatientRecordsView />
            )}
            {activeTab === 'admin-management' && (
              <AdminManagementView />
            )}
            {activeTab === 'admin-profile' && (
              <AdminManagementView initialTab="admin-profile" />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <HospitalLogo size="sm" showTagline={false} variant="horizontal" />
              <span aria-hidden="true" className="text-slate-300">|</span>
              <span className="font-semibold text-[#0A335C] tracking-wide text-[11px]">
                COMPASSION · CARE · COMMUNITY
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSupabaseModalOpen(true)}
                className="hover:text-[#008CA5] transition-colors flex items-center gap-1.5 font-medium"
              >
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Supabase PostgreSQL Schema & RLS</span>
              </button>
              <button
                onClick={resetData}
                className="hover:text-slate-800 transition-colors flex items-center gap-1"
                title="Reset application local storage to initial mock state"
              >
                <RotateCcw className="w-3 h-3 text-slate-400" />
                <span>Reset Demo</span>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <p>
              Dr. Salim Hospital 2.0 · Session: <span className="font-medium text-slate-700">{currentUser ? currentUser.name : 'Guest Visitor'}</span> ({isStaff ? 'Staff / Admin' : currentUser ? 'Patient Isolated View' : 'Public Access'})
            </p>
            <p className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Compliant with database Row Level Security isolation policies</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal (Login & Registration) */}
      <AuthModal />

      {/* Supabase Schema Modal */}
      <SupabaseModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
