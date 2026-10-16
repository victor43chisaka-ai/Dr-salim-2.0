export type UserRole = 'patient' | 'staff' | 'admin';

export type SpecialtySlug = 
  | 'dental' 
  | 'internal_medicine' 
  | 'surgery' 
  | 'obgyn' 
  | 'home_nursing'
  | 'pediatrics';

export type VisitType = 'in_clinic' | 'home_visit' | 'video';

export type AppointmentStatus = 
  | 'confirmed' 
  | 'pending' 
  | 'completed' 
  | 'cancelled';

export type DoctorAvailabilityStatus = 
  | 'available' 
  | 'in_consultation' 
  | 'break' 
  | 'off_duty';

export interface SpecialtyInfo {
  slug: SpecialtySlug;
  name: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  commonServices: string[];
  serviceType: 'in_clinic' | 'home_nursing' | 'both';
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: SpecialtySlug;
  subSpecialty: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  roomOrArea: string;
  bio: string;
  avatarUrl: string;
  availabilityStatus: DoctorAvailabilityStatus;
  acceptedInsurances: string[];
  visitTypes: VisitType[];
  qualifications: string[];
  availableDays: string[]; // e.g. ['Monday', 'Tuesday', 'Wednesday']
}

export interface TimeSlot {
  id: string;
  doctorId: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "09:00 AM"
  period: 'morning' | 'afternoon' | 'evening';
  status: 'available' | 'booked' | 'blocked';
  appointmentId?: string;
}

export interface Appointment {
  id: string;
  referenceCode: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  specialty: SpecialtySlug;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:30 AM"
  visitType: VisitType;
  status: AppointmentStatus;
  reasonForVisit: string;
  symptoms: string;
  homeAddress?: string;
  patientNotes?: string;
  staffNotes?: string;
  clinicalSummary?: string;
  prescription?: string;
  createdAt: string;
}

export interface PatientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'patient';
  dateOfBirth: string;
  gender: 'Female' | 'Male' | 'Other' | 'Prefer not to say';
  bloodGroup: string;
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  insuranceProvider: string;
  insurancePolicyNumber: string;
  address: string;
  password?: string;
}

export interface StaffProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'staff' | 'admin';
  department: string;
  title: string;
  avatarUrl?: string;
  password?: string;
}

export type CurrentUser = PatientProfile | StaffProfile;
