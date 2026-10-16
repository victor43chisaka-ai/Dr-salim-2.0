import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HospitalLogo } from './common/HospitalLogo';
import { 
  Database, 
  UserCheck, 
  ChevronDown, 
  LogOut, 
  ShieldCheck, 
  PlusCircle, 
  Stethoscope, 
  Check,
  CalendarCheck
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    isLoggedIn,
    isStaff, 
    isAdmin,
    switchUser, 
    openAuthModal,
    logout,
    patients, 
    staffMembers,
    activeTab, 
    setActiveTab, 
    setIsSupabaseModalOpen,
    patientAppointments,
    registerOrLoginPatient
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', phone: '' });

  const upcomingCount = patientAppointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.name || !registerForm.email) return;
    registerOrLoginPatient(registerForm);
    setRegisterForm({ name: '', email: '', phone: '' });
    setIsRegisterOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Zone 1: Wordmark Brand Title (Strictly one single element in display face) */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab(isStaff ? 'admin-overview' : 'landing')}
              className="flex items-center text-left group focus:outline-none"
              title="Dr. Salim Hospital 2.0 - Home"
            >
              <HospitalLogo size="sm" showTagline={false} variant="horizontal" />
            </button>

            {/* Department Indicator Text */}
            <span className="hidden lg:inline-block text-xs font-medium text-slate-500 border-l border-slate-200 pl-3">
              {isStaff ? 'Operations Portal' : 'Compassion · Care · Community'}
            </span>
          </div>

          {/* Zone 2: 4-6 Clean Text Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            {!isStaff ? (
              <>
                <button
                  onClick={() => setActiveTab('landing')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'landing'
                      ? 'text-[#008CA5] bg-sky-50 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => setActiveTab('book')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'book'
                      ? 'text-[#008CA5] bg-sky-50 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Book Appointment
                </button>
                <button
                  onClick={() => setActiveTab('specialties')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'specialties'
                      ? 'text-[#008CA5] bg-sky-50 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Departments
                </button>
                <button
                  onClick={() => setActiveTab('my-appointments')}
                  className={`relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'my-appointments'
                      ? 'text-teal-700 bg-teal-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  My Appointments
                  {upcomingCount > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center px-1.5 py-0.2 text-[11px] font-semibold text-white bg-teal-600 rounded-full">
                      {upcomingCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'profile'
                      ? 'text-teal-700 bg-teal-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Health Profile
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('admin-overview')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'admin-overview'
                      ? 'text-teal-700 bg-teal-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('admin-bookings')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'admin-bookings'
                      ? 'text-teal-700 bg-teal-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  All Bookings
                </button>
                <button
                  onClick={() => setActiveTab('admin-availability')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'admin-availability'
                      ? 'text-teal-700 bg-teal-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Doctor Availability
                </button>
                <button
                  onClick={() => setActiveTab('admin-patients')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'admin-patients'
                      ? 'text-teal-700 bg-teal-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Patient Records
                </button>
                <button
                  onClick={() => setActiveTab('admin-management')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'admin-management'
                      ? 'text-indigo-700 bg-indigo-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Manage Clinic
                </button>
                {isAdmin && (
                  <button
                    onClick={() => setActiveTab('admin-profile')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                      activeTab === 'admin-profile'
                        ? 'text-indigo-700 bg-indigo-50 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Admin Profile</span>
                  </button>
                )}
              </>
            )}
          </nav>

          {/* Zone 3: 1-2 Primary Actions (Single-line controls) */}
          <div className="flex items-center gap-2.5">
            
            {/* Supabase Schema Modal Trigger Button */}
            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/80 rounded-md hover:bg-emerald-100/70 transition-colors whitespace-nowrap"
              title="Inspect Supabase PostgreSQL Database Schema & RLS Security Policies"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Supabase Schema & RLS</span>
            </button>

            {/* Role & Switch User Dropdown OR Login/Register Buttons */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="inline-flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors border border-slate-200 whitespace-nowrap shadow-2xs"
                >
                  {isStaff && 'avatarUrl' in currentUser && currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      referrerPolicy="no-referrer"
                      className="w-5 h-5 rounded-full object-cover border border-indigo-300"
                    />
                  ) : isStaff ? (
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  ) : (
                    <UserCheck className="w-4 h-4 text-teal-600" />
                  )}
                  <div className="text-left max-w-[120px] truncate hidden sm:block">
                    <span className="font-semibold text-slate-900 block truncate">{currentUser.name}</span>
                    <span className="text-[10px] text-slate-500 block -mt-0.5 capitalize">
                      {currentUser.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>

                {isUserMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsUserMenuOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                      
                      {/* Active User Card */}
                      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                        <div className="min-w-0 pr-2">
                          <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                          <p className="text-[11px] text-slate-500 font-mono truncate">{currentUser.email}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                          isAdmin ? 'bg-indigo-600 text-white' :
                          isStaff ? 'bg-indigo-100 text-indigo-800' :
                          'bg-teal-100 text-teal-800'
                        }`}>
                          {isAdmin ? 'Super Admin' : isStaff ? 'Staff' : 'Patient'}
                        </span>
                      </div>

                      {/* Quick Profile Link */}
                      <div className="px-2 pt-1.5 pb-1 space-y-0.5">
                        <button
                          onClick={() => {
                            setActiveTab(isStaff ? 'admin-management' : 'profile');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 rounded-md text-xs text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-between"
                        >
                          <span>{isStaff ? 'Clinic Administration Console' : 'My Health Profile & Insurance'}</span>
                          <span className="text-slate-400">→</span>
                        </button>

                        {isAdmin && (
                          <button
                            onClick={() => {
                              setActiveTab('admin-profile');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-3 py-1.5 rounded-md text-xs text-indigo-700 hover:bg-indigo-50 font-medium transition-colors flex items-center justify-between"
                          >
                            <span className="flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Admin Profile & Credentials</span>
                            </span>
                            <span className="text-indigo-400">→</span>
                          </button>
                        )}
                      </div>

                      {/* Staff & Admin Demo options */}
                      <div className="px-3 pt-2 pb-1 border-t border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        SWITCH DEMO ACCOUNT
                      </div>

                      <div className="p-1 space-y-0.5 max-h-48 overflow-y-auto">
                        {staffMembers.map(staff => {
                          const isCurrent = currentUser.id === staff.id;
                          const isVictor = staff.email.toLowerCase().includes('victor43chisaka');
                          return (
                            <button
                              key={staff.id}
                              onClick={() => {
                                switchUser(staff.id);
                                setIsUserMenuOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-1.5 text-left rounded-md text-xs transition-colors ${
                                isCurrent ? 'bg-indigo-50 text-indigo-900 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {staff.avatarUrl ? (
                                  <img
                                    src={staff.avatarUrl}
                                    alt={staff.name}
                                    referrerPolicy="no-referrer"
                                    className="w-5 h-5 rounded-full object-cover border border-slate-200 shrink-0"
                                  />
                                ) : (
                                  <ShieldCheck className={`w-3.5 h-3.5 ${isVictor ? 'text-indigo-600' : 'text-slate-500'}`} />
                                )}
                                <div className="truncate max-w-[160px]">
                                  <div className="font-medium truncate">{staff.name}</div>
                                  <div className="text-[10px] text-slate-400 truncate">{staff.email}</div>
                                </div>
                              </div>
                              {isCurrent && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                            </button>
                          );
                        })}

                        {patients.slice(0, 2).map(p => {
                          const isCurrent = currentUser.id === p.id;
                          return (
                            <button
                              key={p.id}
                              onClick={() => {
                                switchUser(p.id);
                                setIsUserMenuOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-1.5 text-left rounded-md text-xs transition-colors ${
                                isCurrent ? 'bg-teal-50 text-teal-900 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-semibold flex items-center justify-center text-[10px]">
                                  {p.name.charAt(0)}
                                </div>
                                <div className="truncate max-w-[160px]">
                                  <div className="font-medium text-slate-900 truncate">{p.name}</div>
                                  <div className="text-[10px] text-slate-400 truncate">{p.email}</div>
                                </div>
                              </div>
                              {isCurrent && <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Log Out Button */}
                      <div className="p-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
                        >
                          <LogOut className="w-3.5 h-3.5 text-red-500" />
                          <span>Log Out of Portal</span>
                        </button>
                      </div>

                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3 py-1.5 text-xs font-bold text-[#0A335C] hover:bg-sky-50 rounded-lg transition-colors whitespace-nowrap"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#008CA5] hover:bg-[#007a90] rounded-lg shadow-2xs transition-colors whitespace-nowrap"
                >
                  Sign Up
                </button>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden border-t border-slate-200/80 bg-slate-50 px-4 py-2 flex items-center justify-around text-xs">
        {!isStaff ? (
          <>
            <button
              onClick={() => setActiveTab('landing')}
              className={`py-1 px-2 rounded font-medium ${activeTab === 'landing' ? 'text-[#008CA5] font-bold' : 'text-slate-600'}`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('book')}
              className={`py-1 px-2 rounded font-medium ${activeTab === 'book' ? 'text-teal-700 font-semibold' : 'text-slate-600'}`}
            >
              Book
            </button>
            <button
              onClick={() => setActiveTab('specialties')}
              className={`py-1 px-2 rounded font-medium ${activeTab === 'specialties' ? 'text-teal-700 font-semibold' : 'text-slate-600'}`}
            >
              Specialties
            </button>
            <button
              onClick={() => setActiveTab('my-appointments')}
              className={`py-1 px-2 rounded font-medium ${activeTab === 'my-appointments' ? 'text-teal-700 font-semibold' : 'text-slate-600'}`}
            >
              Appointments ({upcomingCount})
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-1 px-2 rounded font-medium ${activeTab === 'profile' ? 'text-teal-700 font-semibold' : 'text-slate-600'}`}
            >
              Profile
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab('admin-overview')}
              className={`py-1 px-2 rounded font-medium ${activeTab === 'admin-overview' ? 'text-teal-700 font-semibold' : 'text-slate-600'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('admin-bookings')}
              className={`py-1 px-2 rounded font-medium ${activeTab === 'admin-bookings' ? 'text-teal-700 font-semibold' : 'text-slate-600'}`}
            >
              Bookings
            </button>
            <button
              onClick={() => setActiveTab('admin-availability')}
              className={`py-1 px-2 rounded font-medium ${activeTab === 'admin-availability' ? 'text-teal-700 font-semibold' : 'text-slate-600'}`}
            >
              Availability
            </button>
            <button
              onClick={() => setActiveTab('admin-patients')}
              className={`py-1 px-2 rounded font-medium ${activeTab === 'admin-patients' ? 'text-teal-700 font-semibold' : 'text-slate-600'}`}
            >
              Patients
            </button>
            <button
              onClick={() => setActiveTab('admin-management')}
              className={`py-1 px-2 rounded font-medium ${activeTab === 'admin-management' ? 'text-indigo-700 font-semibold' : 'text-slate-600'}`}
            >
              Manage
            </button>
            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin-profile')}
                className={`py-1 px-2 rounded font-medium ${activeTab === 'admin-profile' ? 'text-indigo-700 font-semibold' : 'text-slate-600'}`}
              >
                Profile
              </button>
            )}
          </>
        )}
      </div>

      {/* Register New Patient Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Register New Patient</h3>
                <p className="text-xs text-slate-500">Create a secure profile with dedicated health records.</p>
              </div>
              <button 
                onClick={() => setIsRegisterOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleRegister} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clara Oswald"
                  value={registerForm.name}
                  onChange={e => setRegisterForm({ ...registerForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="clara@example.com"
                  value={registerForm.email}
                  onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={registerForm.phone}
                  onChange={e => setRegisterForm({ ...registerForm, phone: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md shadow-xs transition-colors"
                >
                  Create & Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
