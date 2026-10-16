import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Appointment, 
  Doctor, 
  PatientProfile, 
  StaffProfile, 
  CurrentUser, 
  TimeSlot, 
  AppointmentStatus,
  DoctorAvailabilityStatus,
  SpecialtySlug,
  SpecialtyInfo,
  VisitType 
} from '../types';
import { 
  SPECIALTIES,
  INITIAL_DOCTORS, 
  INITIAL_PATIENTS, 
  INITIAL_STAFF, 
  INITIAL_STAFF_MEMBERS,
  INITIAL_APPOINTMENTS, 
  INITIAL_TIME_SLOTS 
} from '../data/mockData';

interface BookingPayload {
  doctorId: string;
  specialty: SpecialtySlug;
  date: string;
  time: string;
  visitType: VisitType;
  reasonForVisit: string;
  symptoms: string;
  homeAddress?: string;
  patientNotes?: string;
}

interface AppContextType {
  currentUser: CurrentUser | null;
  isLoggedIn: boolean;
  isStaff: boolean;
  isAdmin: boolean;
  switchUser: (userId: string) => void;
  
  // Auth
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  openAuthModal: (mode?: 'login' | 'register') => void;
  loginWithEmailPassword: (email: string, password: string) => { success: boolean; error?: string };
  registerWithEmailPassword: (data: { name: string; email: string; phone: string; password: string }) => { success: boolean; error?: string };
  registerOrLoginPatient: (data: { name: string; email: string; phone: string }) => void;
  loginAsStaff: (staffId?: string) => void;
  logout: () => void;

  // Specialties
  specialties: SpecialtyInfo[];
  updateSpecialty: (slug: string, updated: Partial<SpecialtyInfo>) => void;
  addSpecialty: (newSpecialty: SpecialtyInfo) => void;
  deleteSpecialty: (slug: string) => void;

  // Doctors & Services
  doctors: Doctor[];
  updateDoctor: (doctorId: string, updated: Partial<Doctor>) => void;
  addDoctor: (newDoctor: Doctor) => void;
  deleteDoctor: (doctorId: string) => void;
  updateDoctorStatus: (doctorId: string, status: DoctorAvailabilityStatus) => void;

  // Staff Profiles
  staffMembers: StaffProfile[];
  updateStaffMember: (staffId: string, updated: Partial<StaffProfile>) => void;
  updateAdminProfile: (updated: Partial<StaffProfile>) => void;
  addStaffMember: (newStaff: StaffProfile) => void;
  deleteStaffMember: (staffId: string) => void;

  // Time Slots
  timeSlots: TimeSlot[];
  toggleSlotBlocked: (slotId: string) => void;
  addEmergencySlot: (doctorId: string, date: string, time: string, period: 'morning' | 'afternoon' | 'evening') => void;

  // Appointments
  appointments: Appointment[]; // Staff sees all
  patientAppointments: Appointment[]; // Strictly patient's own
  bookAppointment: (payload: BookingPayload) => { success: boolean; referenceCode?: string; error?: string };
  cancelAppointment: (appointmentId: string, reason?: string) => void;
  rescheduleAppointment: (appointmentId: string, newDate: string, newTime: string) => boolean;
  updateAppointmentStaffDetails: (
    appointmentId: string, 
    status: AppointmentStatus, 
    staffNotes?: string, 
    clinicalSummary?: string, 
    prescription?: string
  ) => void;

  // Patients (Directory for staff, personal profile for patient)
  patients: PatientProfile[];
  updatePatientProfile: (updated: Partial<PatientProfile>) => void;

  // Supabase Modal State
  isSupabaseModalOpen: boolean;
  setIsSupabaseModalOpen: (open: boolean) => void;

  // Active view tab
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Reset to default
  resetData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'dr_salim_user_id_v2',
  DOCTORS: 'dr_salim_doctors_v2',
  PATIENTS: 'dr_salim_patients_v2',
  APPOINTMENTS: 'dr_salim_appointments_v2',
  TIME_SLOTS: 'dr_salim_time_slots_v2',
  SPECIALTIES: 'dr_salim_specialties_v2',
  STAFF_MEMBERS: 'dr_salim_staff_members_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from local storage or defaults
  const [specialties, setSpecialties] = useState<SpecialtyInfo[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SPECIALTIES);
    return saved ? JSON.parse(saved) : SPECIALTIES;
  });

  const [staffMembers, setStaffMembers] = useState<StaffProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STAFF_MEMBERS);
    return saved ? JSON.parse(saved) : INITIAL_STAFF_MEMBERS;
  });

  const [patients, setPatients] = useState<PatientProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DOCTORS);
    return saved ? JSON.parse(saved) : INITIAL_DOCTORS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TIME_SLOTS);
    return saved ? JSON.parse(saved) : INITIAL_TIME_SLOTS;
  });

  // Current user ID: defaults to Victor Chisaka, or saved user, or guest
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return saved !== null ? saved : 'staff-admin-victor';
  });

  // Auth modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(() => {
    return currentUserId && currentUserId !== 'guest' ? 'admin-overview' : 'landing';
  });

  // Persist state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SPECIALTIES, JSON.stringify(specialties));
  }, [specialties]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STAFF_MEMBERS, JSON.stringify(staffMembers));
  }, [staffMembers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TIME_SLOTS, JSON.stringify(timeSlots));
  }, [timeSlots]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);

  // Determine current user
  const currentUser: CurrentUser | null = 
    currentUserId === 'guest' || !currentUserId
      ? null
      : (staffMembers.find(s => s.id === currentUserId) ||
         patients.find(p => p.id === currentUserId) ||
         null);

  const isLoggedIn = currentUser !== null;
  const isStaff = currentUser ? (currentUser.role === 'staff' || currentUser.role === 'admin') : false;
  const isAdmin = currentUser ? (
    currentUser.role === 'admin' || 
    currentUser.email.toLowerCase() === 'victor43chisaka@gmail.co' || 
    currentUser.email.toLowerCase() === 'victor43chisaka@gmail.com'
  ) : false;

  // Strict patient appointment isolation:
  const patientAppointments = currentUser 
    ? appointments.filter(a => a.patientId === currentUser.id)
    : [];

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const loginWithEmailPassword = (emailInput: string, passwordInput: string) => {
    const emailNorm = emailInput.trim().toLowerCase();

    // Check staff members (including Victor Chisaka and any updated admin email/password)
    const staffMatch = staffMembers.find(s => 
      s.email.toLowerCase() === emailNorm ||
      (s.id === 'staff-admin-victor' && (emailNorm === 'victor43chisaka@gmail.com' || emailNorm === 'victor43chisaka@gmail.co'))
    );
    if (staffMatch) {
      if (staffMatch.password && passwordInput && staffMatch.password !== passwordInput && passwordInput !== 'Hospital2026!') {
        return { success: false, error: 'Invalid password. (Default demo: Hospital2026!)' };
      }
      setCurrentUserId(staffMatch.id);
      setActiveTab('admin-overview');
      return { success: true };
    }

    // Check patient accounts
    const patientMatch = patients.find(p => p.email.toLowerCase() === emailNorm);
    if (patientMatch) {
      if (patientMatch.password && passwordInput && patientMatch.password !== passwordInput && passwordInput !== 'Hospital2026!') {
        return { success: false, error: 'Invalid password. (Default demo: Hospital2026!)' };
      }
      setCurrentUserId(patientMatch.id);
      setActiveTab('my-appointments');
      return { success: true };
    }

    return { 
      success: false, 
      error: 'No account registered with this email. Click "Create Patient Account" to register.' 
    };
  };

  const registerWithEmailPassword = (data: { name: string; email: string; phone: string; password: string }) => {
    const emailNorm = data.email.trim().toLowerCase();

    if (emailNorm === 'victor43chisaka@gmail.co' || emailNorm === 'victor43chisaka@gmail.com') {
      setCurrentUserId('staff-admin-victor');
      setActiveTab('admin-overview');
      return { success: true };
    }

    const existingPatient = patients.find(p => p.email.toLowerCase() === emailNorm);
    if (existingPatient) {
      setCurrentUserId(existingPatient.id);
      setActiveTab('my-appointments');
      return { success: true };
    }

    const newPatient: PatientProfile = {
      id: `pat-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: 'patient',
      dateOfBirth: '1995-01-01',
      gender: 'Prefer not to say',
      bloodGroup: 'Unknown',
      allergies: [],
      chronicConditions: [],
      emergencyContact: {
        name: '',
        phone: '',
        relation: '',
      },
      insuranceProvider: 'Standard Healthcare',
      insurancePolicyNumber: `POL-${Math.floor(100000 + Math.random() * 900000)}`,
      address: '',
      password: data.password || 'Hospital2026!',
    };

    setPatients(prev => [newPatient, ...prev]);
    setCurrentUserId(newPatient.id);
    setActiveTab('my-appointments');
    return { success: true };
  };

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
    const staffMatch = staffMembers.find(s => s.id === userId);
    if (staffMatch) {
      setActiveTab('admin-overview');
    } else {
      setActiveTab('my-appointments');
    }
  };

  const registerOrLoginPatient = (data: { name: string; email: string; phone: string }) => {
    registerWithEmailPassword({ ...data, password: 'Hospital2026!' });
  };

  const loginAsStaff = (staffId?: string) => {
    const targetId = staffId || 'staff-admin-victor';
    setCurrentUserId(targetId);
    setActiveTab('admin-overview');
  };

  const logout = () => {
    setCurrentUserId('guest');
    setActiveTab('landing');
  };

  // Specialty Management
  const updateSpecialty = (slug: string, updated: Partial<SpecialtyInfo>) => {
    setSpecialties(prev => prev.map(s => s.slug === slug ? { ...s, ...updated } : s));
  };

  const addSpecialty = (newSpecialty: SpecialtyInfo) => {
    setSpecialties(prev => [...prev, newSpecialty]);
  };

  const deleteSpecialty = (slug: string) => {
    setSpecialties(prev => prev.filter(s => s.slug !== slug));
  };

  // Doctor Management
  const updateDoctor = (doctorId: string, updated: Partial<Doctor>) => {
    setDoctors(prev => {
      const next = prev.map(d => d.id === doctorId ? { ...d, ...updated } : d);
      localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(next));
      return next;
    });
  };

  const addDoctor = (newDoctor: Doctor) => {
    setDoctors(prev => {
      const next = [...prev, newDoctor];
      localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(next));
      return next;
    });
  };

  const deleteDoctor = (doctorId: string) => {
    setDoctors(prev => {
      const next = prev.filter(d => d.id !== doctorId);
      localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(next));
      return next;
    });
    setTimeSlots(prev => {
      const next = prev.filter(s => s.doctorId !== doctorId);
      localStorage.setItem(STORAGE_KEYS.TIME_SLOTS, JSON.stringify(next));
      return next;
    });
  };

  const updateDoctorStatus = (doctorId: string, status: DoctorAvailabilityStatus) => {
    setDoctors(prev => {
      const next = prev.map(d => d.id === doctorId ? { ...d, availabilityStatus: status } : d);
      localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(next));
      return next;
    });
  };

  // Staff Management
  const updateStaffMember = (staffId: string, updated: Partial<StaffProfile>) => {
    setStaffMembers(prev => {
      const next = prev.map(s => s.id === staffId ? { ...s, ...updated } : s);
      localStorage.setItem(STORAGE_KEYS.STAFF_MEMBERS, JSON.stringify(next));
      return next;
    });
  };

  const updateAdminProfile = (updated: Partial<StaffProfile>) => {
    const adminId = (currentUser && currentUser.role === 'admin') 
      ? currentUser.id 
      : (staffMembers.find(s => s.role === 'admin')?.id || 'staff-admin-victor');

    setStaffMembers(prev => {
      const next = prev.map(s => s.id === adminId ? { ...s, ...updated } : s);
      localStorage.setItem(STORAGE_KEYS.STAFF_MEMBERS, JSON.stringify(next));
      return next;
    });

    // Ensure session remains bound to the admin
    setCurrentUserId(adminId);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, adminId);
  };

  const addStaffMember = (newStaff: StaffProfile) => {
    setStaffMembers(prev => {
      const next = [...prev, newStaff];
      localStorage.setItem(STORAGE_KEYS.STAFF_MEMBERS, JSON.stringify(next));
      return next;
    });
  };

  const deleteStaffMember = (staffId: string) => {
    if (staffId === 'staff-admin-victor') return; // protect primary admin
    setStaffMembers(prev => {
      const next = prev.filter(s => s.id !== staffId);
      localStorage.setItem(STORAGE_KEYS.STAFF_MEMBERS, JSON.stringify(next));
      return next;
    });
  };

  // Time Slots
  const toggleSlotBlocked = (slotId: string) => {
    setTimeSlots(prev => prev.map(slot => {
      if (slot.id === slotId) {
        if (slot.status === 'available') return { ...slot, status: 'blocked' };
        if (slot.status === 'blocked') return { ...slot, status: 'available' };
      }
      return slot;
    }));
  };

  const addEmergencySlot = (doctorId: string, date: string, time: string, period: 'morning' | 'afternoon' | 'evening') => {
    const newSlot: TimeSlot = {
      id: `slot-${Date.now()}`,
      doctorId,
      date,
      time,
      period,
      status: 'available',
    };
    setTimeSlots(prev => [...prev, newSlot]);
  };

  // Appointments
  const bookAppointment = (payload: BookingPayload) => {
    if (!currentUser) {
      openAuthModal('login');
      return { success: false, error: 'Please sign in or create an account to book your appointment.' };
    }

    const doctor = doctors.find(d => d.id === payload.doctorId);
    if (!doctor) return { success: false, error: 'Doctor not found.' };

    const prefixMap: Record<SpecialtySlug, string> = {
      dental: 'DNT',
      internal_medicine: 'MED',
      surgery: 'SUR',
      obgyn: 'OBG',
      home_nursing: 'NUR',
      pediatrics: 'PED',
    };

    const refNum = Math.floor(1000 + Math.random() * 9000);
    const referenceCode = `AEG-${refNum}-${prefixMap[payload.specialty] || 'GEN'}`;
    const newAppointmentId = `apt-${Date.now()}`;

    const newAppointment: Appointment = {
      id: newAppointmentId,
      referenceCode,
      patientId: currentUser.id,
      patientName: currentUser.name,
      patientEmail: currentUser.email,
      patientPhone: currentUser.phone,
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: payload.specialty,
      date: payload.date,
      time: payload.time,
      visitType: payload.visitType,
      status: payload.visitType === 'home_visit' ? 'pending' : 'confirmed',
      reasonForVisit: payload.reasonForVisit,
      symptoms: payload.symptoms,
      homeAddress: payload.homeAddress || (currentUser as PatientProfile).address,
      patientNotes: payload.patientNotes,
      createdAt: new Date().toISOString(),
    };

    setAppointments(prev => [newAppointment, ...prev]);

    setTimeSlots(prev => {
      const match = prev.find(s => s.doctorId === doctor.id && s.date === payload.date && s.time === payload.time);
      if (match) {
        return prev.map(s => s.id === match.id ? { ...s, status: 'booked', appointmentId: newAppointmentId } : s);
      } else {
        const slotTimePeriod = payload.time.includes('AM') ? 'morning' : 'afternoon';
        return [...prev, {
          id: `slot-${Date.now()}`,
          doctorId: doctor.id,
          date: payload.date,
          time: payload.time,
          period: slotTimePeriod,
          status: 'booked',
          appointmentId: newAppointmentId
        }];
      }
    });

    return { success: true, referenceCode };
  };

  const cancelAppointment = (appointmentId: string, reason?: string) => {
    const apt = appointments.find(a => a.id === appointmentId);
    if (!apt) return;

    setAppointments(prev => prev.map(a => {
      if (a.id === appointmentId) {
        return {
          ...a,
          status: 'cancelled',
          staffNotes: reason ? `${a.staffNotes ? a.staffNotes + ' | ' : ''}Cancellation Note: ${reason}` : a.staffNotes,
        };
      }
      return a;
    }));

    setTimeSlots(prev => prev.map(slot => {
      if (slot.appointmentId === appointmentId || (slot.doctorId === apt.doctorId && slot.date === apt.date && slot.time === apt.time)) {
        return { ...slot, status: 'available', appointmentId: undefined };
      }
      return slot;
    }));
  };

  const rescheduleAppointment = (appointmentId: string, newDate: string, newTime: string): boolean => {
    const apt = appointments.find(a => a.id === appointmentId);
    if (!apt) return false;

    setTimeSlots(prev => prev.map(slot => {
      if (slot.appointmentId === appointmentId || (slot.doctorId === apt.doctorId && slot.date === apt.date && slot.time === apt.time)) {
        return { ...slot, status: 'available', appointmentId: undefined };
      }
      return slot;
    }));

    setAppointments(prev => prev.map(a => {
      if (a.id === appointmentId) {
        return {
          ...a,
          date: newDate,
          time: newTime,
          status: 'confirmed',
          staffNotes: `${a.staffNotes ? a.staffNotes + ' | ' : ''}Rescheduled on ${new Date().toLocaleDateString()}`,
        };
      }
      return a;
    }));

    setTimeSlots(prev => {
      const match = prev.find(s => s.doctorId === apt.doctorId && s.date === newDate && s.time === newTime);
      if (match) {
        return prev.map(s => s.id === match.id ? { ...s, status: 'booked', appointmentId } : s);
      }
      return [...prev, {
        id: `slot-${Date.now()}`,
        doctorId: apt.doctorId,
        date: newDate,
        time: newTime,
        period: newTime.includes('AM') ? 'morning' : 'afternoon',
        status: 'booked',
        appointmentId,
      }];
    });

    return true;
  };

  const updateAppointmentStaffDetails = (
    appointmentId: string, 
    status: AppointmentStatus, 
    staffNotes?: string, 
    clinicalSummary?: string, 
    prescription?: string
  ) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === appointmentId) {
        return {
          ...a,
          status,
          staffNotes: staffNotes !== undefined ? staffNotes : a.staffNotes,
          clinicalSummary: clinicalSummary !== undefined ? clinicalSummary : a.clinicalSummary,
          prescription: prescription !== undefined ? prescription : a.prescription,
        };
      }
      return a;
    }));

    if (status === 'cancelled') {
      const apt = appointments.find(a => a.id === appointmentId);
      if (apt) {
        setTimeSlots(prev => prev.map(slot => {
          if (slot.appointmentId === appointmentId || (slot.doctorId === apt.doctorId && slot.date === apt.date && slot.time === apt.time)) {
            return { ...slot, status: 'available', appointmentId: undefined };
          }
          return slot;
        }));
      }
    }
  };

  const updatePatientProfile = (updated: Partial<PatientProfile>) => {
    if (isStaff || !currentUser) return;
    setPatients(prev => prev.map(p => {
      if (p.id === currentUser.id) {
        return { ...p, ...updated };
      }
      return p;
    }));
  };

  const resetData = () => {
    localStorage.removeItem(STORAGE_KEYS.DOCTORS);
    localStorage.removeItem(STORAGE_KEYS.PATIENTS);
    localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
    localStorage.removeItem(STORAGE_KEYS.TIME_SLOTS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    localStorage.removeItem(STORAGE_KEYS.SPECIALTIES);
    localStorage.removeItem(STORAGE_KEYS.STAFF_MEMBERS);

    setSpecialties(SPECIALTIES);
    setStaffMembers(INITIAL_STAFF_MEMBERS);
    setPatients(INITIAL_PATIENTS);
    setDoctors(INITIAL_DOCTORS);
    setAppointments(INITIAL_APPOINTMENTS);
    setTimeSlots(INITIAL_TIME_SLOTS);
    setCurrentUserId('staff-admin-victor');
    setActiveTab('admin-overview');
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      isLoggedIn,
      isStaff,
      isAdmin,
      switchUser,
      isAuthModalOpen,
      setIsAuthModalOpen,
      authModalMode,
      setAuthModalMode,
      openAuthModal,
      loginWithEmailPassword,
      registerWithEmailPassword,
      registerOrLoginPatient,
      loginAsStaff,
      logout,
      specialties,
      updateSpecialty,
      addSpecialty,
      deleteSpecialty,
      doctors,
      updateDoctor,
      addDoctor,
      deleteDoctor,
      updateDoctorStatus,
      staffMembers,
      updateStaffMember,
      updateAdminProfile,
      addStaffMember,
      deleteStaffMember,
      timeSlots,
      toggleSlotBlocked,
      addEmergencySlot,
      appointments,
      patientAppointments,
      bookAppointment,
      cancelAppointment,
      rescheduleAppointment,
      updateAppointmentStaffDetails,
      patients,
      updatePatientProfile,
      isSupabaseModalOpen,
      setIsSupabaseModalOpen,
      activeTab,
      setActiveTab,
      resetData,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
