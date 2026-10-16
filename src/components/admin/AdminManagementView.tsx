import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SpecialtyInfo, Doctor, StaffProfile, SpecialtySlug, DoctorAvailabilityStatus } from '../../types';
import { 
  Building2, 
  Stethoscope, 
  UserCheck, 
  ShieldCheck, 
  Edit3, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Star, 
  Smile, 
  HeartPulse, 
  Activity, 
  Baby, 
  Home, 
  Sparkles,
  Camera,
  Image as ImageIcon,
  DollarSign,
  MapPin,
  Clock,
  UserPlus,
  Upload,
  Save,
  Key,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

const compressAndReadImage = (
  file: File, 
  callback: (dataUrl: string) => void,
  onError?: (msg: string) => void
) => {
  if (!file || !file.type.startsWith('image/')) {
    if (onError) {
      onError('Please select a valid image file (PNG, JPG, JPEG, or WEBP).');
    }
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const maxDim = 600;
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        callback(dataUrl);
      } else {
        callback(e.target?.result as string);
      }
    };
    img.src = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

const PRESET_DOCTOR_AVATARS = [
  { label: 'Physician (Female 1)', url: '/src/assets/images/doctor_internal_med_1790972755037.jpg' },
  { label: 'Dentist (Male)', url: '/src/assets/images/doctor_dental_1790972767606.jpg' },
  { label: 'OB/GYN (Female)', url: '/src/assets/images/doctor_obgyn_1790972778414.jpg' },
  { label: 'Home Nurse (Female)', url: '/src/assets/images/doctor_nursing_1790972788355.jpg' },
  { label: 'Pediatrician (Female)', url: '/src/assets/images/doctor_pediatrics_1791022000982.jpg' },
  { label: 'Surgeon (Male)', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400' },
  { label: 'Dentist (Male 2)', url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400' },
  { label: 'Nurse (Male)', url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=400' },
];

const PRESET_STAFF_AVATARS = [
  { label: 'Victor Chisaka (Executive)', url: '/src/assets/images/avatar_victor_admin_1791022976948.jpg' },
  { label: 'Clinical Director (Female)', url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400' },
  { label: 'Operations Lead (Male)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400' },
  { label: 'Triage Specialist (Female)', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400' },
  { label: 'Admin Coordinator (Female)', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400' },
];

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface AdminManagementViewProps {
  initialTab?: 'specialties' | 'doctors' | 'staff' | 'admin-profile';
}

export const AdminManagementView: React.FC<AdminManagementViewProps> = ({ initialTab }) => {
  const { 
    specialties, 
    updateSpecialty, 
    addSpecialty, 
    deleteSpecialty,
    doctors, 
    updateDoctor, 
    addDoctor, 
    deleteDoctor,
    staffMembers, 
    updateStaffMember, 
    updateAdminProfile,
    addStaffMember, 
    deleteStaffMember,
    currentUser,
    isAdmin
  } = useApp();

  const [activeTab, setActiveTab] = useState<'specialties' | 'doctors' | 'staff' | 'admin-profile'>(initialTab || 'doctors');

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [doctorViewMode, setDoctorViewMode] = useState<'cards' | 'table'>('cards');

  // Deletion modals state (in-app confirmation, bypasses iframe window.confirm blocks)
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);
  const [staffToDelete, setStaffToDelete] = useState<StaffProfile | null>(null);
  const [specialtyToDelete, setSpecialtyToDelete] = useState<SpecialtyInfo | null>(null);
  const [deleteNotice, setDeleteNotice] = useState<string | null>(null);
  const [staffPhotoNotice, setStaffPhotoNotice] = useState<string | null>(null);

  // Admin Profile Editor state
  const adminStaff = staffMembers.find(s => s.id === currentUser?.id) || 
                     staffMembers.find(s => s.role === 'admin') || 
                     staffMembers[0];

  const [adminProfileForm, setAdminProfileForm] = useState({
    name: adminStaff?.name || '',
    email: adminStaff?.email || '',
    phone: adminStaff?.phone || '',
    department: adminStaff?.department || '',
    title: adminStaff?.title || '',
    avatarUrl: adminStaff?.avatarUrl || '',
    password: adminStaff?.password || 'Hospital2026!',
  });
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminSaveMessage, setAdminSaveMessage] = useState<string | null>(null);

  // Keep admin profile form in sync if adminStaff updates
  React.useEffect(() => {
    if (adminStaff) {
      setAdminProfileForm({
        name: adminStaff.name,
        email: adminStaff.email,
        phone: adminStaff.phone,
        department: adminStaff.department,
        title: adminStaff.title,
        avatarUrl: adminStaff.avatarUrl || '',
        password: adminStaff.password || 'Hospital2026!',
      });
    }
  }, [adminStaff?.id, adminStaff?.name, adminStaff?.email, adminStaff?.avatarUrl, adminStaff?.phone, adminStaff?.title, adminStaff?.department, adminStaff?.password]);

  const handleSaveAdminProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      name: adminProfileForm.name.trim(),
      email: adminProfileForm.email.trim(),
      phone: adminProfileForm.phone.trim(),
      department: adminProfileForm.department.trim(),
      title: adminProfileForm.title.trim(),
      avatarUrl: adminProfileForm.avatarUrl,
      password: adminProfileForm.password,
    };
    if (adminStaff) {
      updateStaffMember(adminStaff.id, updated);
    }
    updateAdminProfile(updated);
    setAdminSaveMessage('Administrator profile updated successfully! All changes are permanently saved and active across the clinic portal.');
    setTimeout(() => setAdminSaveMessage(null), 5000);
  };

  // Modal states
  const [editingSpecialty, setEditingSpecialty] = useState<SpecialtyInfo | null>(null);
  const [isNewSpecialty, setIsNewSpecialty] = useState(false);
  const [procedureInput, setProcedureInput] = useState('');

  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [isNewDoctor, setIsNewDoctor] = useState(false);
  const [qualificationInput, setQualificationInput] = useState('');
  const [insuranceInput, setInsuranceInput] = useState('');

  const [editingStaff, setEditingStaff] = useState<StaffProfile | null>(null);
  const [isNewStaff, setIsNewStaff] = useState(false);
  const [showStaffPassword, setShowStaffPassword] = useState(false);

  // Specialty handlers
  const handleSaveSpecialty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpecialty) return;

    if (isNewSpecialty) {
      addSpecialty(editingSpecialty);
    } else {
      updateSpecialty(editingSpecialty.slug, editingSpecialty);
    }
    setEditingSpecialty(null);
    setIsNewSpecialty(false);
  };

  const handleAddProcedure = () => {
    if (!procedureInput.trim() || !editingSpecialty) return;
    setEditingSpecialty({
      ...editingSpecialty,
      commonServices: [...editingSpecialty.commonServices, procedureInput.trim()]
    });
    setProcedureInput('');
  };

  const handleRemoveProcedure = (idx: number) => {
    if (!editingSpecialty) return;
    setEditingSpecialty({
      ...editingSpecialty,
      commonServices: editingSpecialty.commonServices.filter((_, i) => i !== idx)
    });
  };

  // Doctor handlers
  const handleSaveDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoctor) return;

    if (isNewDoctor) {
      addDoctor(editingDoctor);
    } else {
      updateDoctor(editingDoctor.id, editingDoctor);
    }
    setEditingDoctor(null);
    setIsNewDoctor(false);
  };

  const handleAddQualification = () => {
    if (!qualificationInput.trim() || !editingDoctor) return;
    setEditingDoctor({
      ...editingDoctor,
      qualifications: [...editingDoctor.qualifications, qualificationInput.trim()]
    });
    setQualificationInput('');
  };

  const handleRemoveQualification = (idx: number) => {
    if (!editingDoctor) return;
    setEditingDoctor({
      ...editingDoctor,
      qualifications: editingDoctor.qualifications.filter((_, i) => i !== idx)
    });
  };

  const handleAddInsurance = () => {
    if (!insuranceInput.trim() || !editingDoctor) return;
    setEditingDoctor({
      ...editingDoctor,
      acceptedInsurances: [...editingDoctor.acceptedInsurances, insuranceInput.trim()]
    });
    setInsuranceInput('');
  };

  const handleRemoveInsurance = (idx: number) => {
    if (!editingDoctor) return;
    setEditingDoctor({
      ...editingDoctor,
      acceptedInsurances: editingDoctor.acceptedInsurances.filter((_, i) => i !== idx)
    });
  };

  const toggleDayAvailable = (day: string) => {
    if (!editingDoctor) return;
    const exists = editingDoctor.availableDays.includes(day);
    const updated = exists
      ? editingDoctor.availableDays.filter(d => d !== day)
      : [...editingDoctor.availableDays, day];
    setEditingDoctor({ ...editingDoctor, availableDays: updated });
  };

  // Staff handlers
  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    if (isNewStaff) {
      addStaffMember(editingStaff);
    } else {
      updateStaffMember(editingStaff.id, editingStaff);
    }
    setEditingStaff(null);
    setIsNewStaff(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Clinic Administration Console</h1>
            <span className="text-[11px] font-semibold text-indigo-800 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Executive Admin Privileges</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as <strong className="text-slate-800">{currentUser?.name || 'Administrator'}</strong> ({currentUser?.email || ''}). Manage clinical departments, doctor credentials, and staff accounts with custom profile pictures.
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('doctors')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'doctors'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Doctors ({doctors.length})
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'staff'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Staff & Admins ({staffMembers.length})
          </button>
          <button
            onClick={() => setActiveTab('specialties')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'specialties'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Specialties ({specialties.length})
          </button>
          <button
            onClick={() => setActiveTab('admin-profile')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'admin-profile'
                ? 'bg-[#0A335C] text-white shadow-2xs'
                : 'text-indigo-700 hover:bg-indigo-50 font-medium'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Admin Profile</span>
          </button>
        </div>
      </div>

      {/* Global Alerts for Deletion, Photo Uploads, and Profile Saves */}
      {deleteNotice && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-2.5 text-xs font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
          <span>{deleteNotice}</span>
        </div>
      )}

      {staffPhotoNotice && (
        <div className="p-3 bg-teal-50 border border-teal-200 text-teal-800 rounded-xl flex items-center gap-2.5 text-xs font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{staffPhotoNotice}</span>
        </div>
      )}

      {adminSaveMessage && activeTab !== 'admin-profile' && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2.5 text-xs font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{adminSaveMessage}</span>
        </div>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* 1. DOCTORS TAB */}
      {/* -------------------------------------------------------------------------- */}
      {activeTab === 'doctors' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Physicians & Healthcare Specialists ({doctors.length})</h2>
              <p className="text-xs text-slate-500">Edit physician credentials, upload photos from device, update consultation fees, or delete physicians from the roster.</p>
            </div>
            
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {/* View mode toggle */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setDoctorViewMode('cards')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                    doctorViewMode === 'cards' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Cards View
                </button>
                <button
                  type="button"
                  onClick={() => setDoctorViewMode('table')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                    doctorViewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Table View
                </button>
              </div>

              <button
                onClick={() => {
                  setEditingDoctor({
                    id: `doc-${Date.now()}`,
                    name: '',
                    title: '',
                    specialty: 'internal_medicine',
                    subSpecialty: '',
                    experienceYears: 6,
                    rating: 5.0,
                    reviewCount: 0,
                    consultationFee: 120,
                    roomOrArea: 'Suite 204, East Wing',
                    bio: '',
                    avatarUrl: PRESET_DOCTOR_AVATARS[0].url,
                    availabilityStatus: 'available',
                    acceptedInsurances: ['Blue Cross Blue Shield', 'Aetna', 'UnitedHealthcare'],
                    visitTypes: ['in_clinic'],
                    qualifications: ['Board Certified Physician'],
                    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                  });
                  setIsNewDoctor(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Doctor</span>
              </button>
            </div>
          </div>

          {/* Card View Mode */}
          {doctorViewMode === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map(doc => (
                <div
                  key={doc.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-3.5 mb-3">
                      <div className="relative group/docavatar shrink-0">
                        <img
                          src={doc.avatarUrl}
                          alt={doc.name}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200 bg-slate-100 shadow-2xs"
                        />
                        <label
                          className="absolute -bottom-1 -right-1 bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-700 p-1.5 rounded-full border border-slate-200 shadow-xs cursor-pointer transition-colors"
                          title="Upload new photo for this doctor from device"
                        >
                          <Camera className="w-3.5 h-3.5 text-teal-600" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) {
                                compressAndReadImage(file, dataUrl => {
                                  updateDoctor(doc.id, { avatarUrl: dataUrl });
                                  setStaffPhotoNotice(`Photo updated for ${doc.name}`);
                                  setTimeout(() => setStaffPhotoNotice(null), 4000);
                                });
                              }
                            }}
                          />
                        </label>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                            doc.availabilityStatus === 'available' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            doc.availabilityStatus === 'in_consultation' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            doc.availabilityStatus === 'break' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {doc.availabilityStatus.replace('_', ' ')}
                          </span>
                          <span className="font-mono font-bold text-slate-900 text-xs">${doc.consultationFee}.00</span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm mt-1 truncate">{doc.name}</h3>
                        <p className="text-[11px] text-teal-700 font-semibold truncate">{doc.title}</p>
                        <p className="text-[11px] text-slate-500 capitalize">{doc.specialty.replace('_', ' ')} · {doc.roomOrArea}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs py-2 px-3 bg-slate-50 rounded-lg border border-slate-100 mb-3">
                      <div className="flex items-center gap-1 font-mono text-slate-700">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-semibold">{doc.rating}</span>
                        <span className="text-slate-400 text-[10px]">({doc.reviewCount} reviews)</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 font-medium">{doc.experienceYears} yrs experience</span>
                    </div>

                    {doc.bio && (
                      <p className="text-[11px] text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                        {doc.bio}
                      </p>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingDoctor(doc);
                        setIsNewDoctor(false);
                      }}
                      className="flex-1 py-1.5 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center justify-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                      <span>Edit Profile</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDoctorToDelete(doc)}
                      className="py-1.5 px-3 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-2xs"
                      title={`Delete ${doc.name} from medical roster`}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-600" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Table View Mode */}
          {doctorViewMode === 'table' && (
            <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Physician & Profile Photo</th>
                      <th className="py-3 px-4">Department / Sub-Specialty</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Fee ($)</th>
                      <th className="py-3 px-4">Experience & Rating</th>
                      <th className="py-3 px-4">Duty Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {doctors.map(doc => (
                      <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative group/tableavatar shrink-0">
                              <img
                                src={doc.avatarUrl}
                                alt={doc.name}
                                referrerPolicy="no-referrer"
                                className="w-12 h-12 rounded-lg object-cover border border-slate-200 bg-slate-100 shadow-2xs"
                              />
                              <label
                                className="absolute -bottom-1 -right-1 bg-white hover:bg-teal-50 text-slate-700 p-1 rounded-full border border-slate-200 shadow-xs cursor-pointer transition-colors"
                                title="Upload photo from device"
                              >
                                <Camera className="w-3 h-3 text-teal-600" />
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      compressAndReadImage(file, dataUrl => {
                                        updateDoctor(doc.id, { avatarUrl: dataUrl });
                                        setStaffPhotoNotice(`Photo updated for ${doc.name}`);
                                        setTimeout(() => setStaffPhotoNotice(null), 4000);
                                      });
                                    }
                                  }}
                                />
                              </label>
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 truncate">{doc.name}</div>
                              <div className="text-[11px] text-teal-700 font-medium truncate">{doc.title}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800 capitalize">{doc.specialty.replace('_', ' ')}</div>
                          <div className="text-[11px] text-slate-500 truncate">{doc.subSpecialty || 'General Practice'}</div>
                        </td>

                        <td className="py-3 px-4 font-medium text-slate-700">
                          {doc.roomOrArea}
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          ${doc.consultationFee}.00
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 font-mono text-slate-700">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="font-semibold">{doc.rating}</span>
                            <span className="text-slate-400 text-[10px]">({doc.reviewCount})</span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {doc.experienceYears} yrs experience
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                            doc.availabilityStatus === 'available' ? 'bg-emerald-50 text-emerald-700' :
                            doc.availabilityStatus === 'in_consultation' ? 'bg-amber-50 text-amber-700' :
                            doc.availabilityStatus === 'break' ? 'bg-blue-50 text-blue-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {doc.availabilityStatus.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setEditingDoctor(doc);
                                setIsNewDoctor(false);
                              }}
                              className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors inline-flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit Profile</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setDoctorToDelete(doc)}
                              className="px-2.5 py-1 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded transition-colors inline-flex items-center gap-1 shadow-2xs"
                              title={`Delete ${doc.name} from medical roster`}
                            >
                              <Trash2 className="w-3 h-3 text-red-600" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* 2. STAFF TAB */}
      {/* -------------------------------------------------------------------------- */}
      {activeTab === 'staff' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Clinical Staff & Administrative Directory</h2>
              <p className="text-xs text-slate-500">Edit staff profile pictures, assign administrator roles, and manage department personnel.</p>
            </div>
            <button
              onClick={() => {
                setEditingStaff({
                  id: `staff-${Date.now()}`,
                  name: '',
                  email: '',
                  phone: '',
                  role: 'staff',
                  department: 'Clinical Operations',
                  title: 'Clinic Coordinator',
                  avatarUrl: PRESET_STAFF_AVATARS[1].url,
                });
                setIsNewStaff(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors shadow-2xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Staff Member</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Staff Member & Photo</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Role & Authority</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {staffMembers.map(staff => {
                    const isVictor = staff.email.toLowerCase().includes('victor43chisaka');
                    return (
                      <tr key={staff.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative group/avatar shrink-0">
                              {staff.avatarUrl ? (
                                <img
                                  src={staff.avatarUrl}
                                  alt={staff.name}
                                  referrerPolicy="no-referrer"
                                  className="w-11 h-11 rounded-full object-cover border border-slate-200 bg-slate-100 shadow-2xs"
                                />
                              ) : (
                                <div className="w-11 h-11 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-sm border border-slate-200">
                                  {staff.name.charAt(0)}
                                </div>
                              )}
                              <label
                                className="absolute -bottom-1 -right-1 bg-white hover:bg-teal-50 text-slate-600 hover:text-teal-700 p-1 rounded-full border border-slate-200 shadow-xs cursor-pointer transition-colors"
                                title="Upload new photo from device"
                              >
                                <Camera className="w-3 h-3" />
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      compressAndReadImage(file, dataUrl => {
                                        updateStaffMember(staff.id, { avatarUrl: dataUrl });
                                      });
                                    }
                                  }}
                                />
                              </label>
                            </div>

                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{staff.name}</span>
                                {isVictor && (
                                  <span className="text-[9px] font-bold bg-indigo-600 text-white px-1.5 py-0.2 rounded uppercase tracking-wider">
                                    Super Admin
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono">{staff.email}</div>
                              <div className="text-[10px] text-slate-400">{staff.phone}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-medium text-slate-800">
                          {staff.department}
                        </td>

                        <td className="py-3 px-4 text-slate-600 font-medium">
                          {staff.title}
                        </td>

                        <td className="py-3 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            staff.role === 'admin' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {staff.role}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <label
                              className="px-2.5 py-1 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded transition-colors inline-flex items-center gap-1 cursor-pointer shadow-2xs"
                              title={`Upload photo of ${staff.name} from device`}
                            >
                              <Camera className="w-3 h-3 text-teal-600" />
                              <span>Upload Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={e => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    compressAndReadImage(file, dataUrl => {
                                      updateStaffMember(staff.id, { avatarUrl: dataUrl });
                                      setStaffPhotoNotice(`Photo updated successfully for ${staff.name}`);
                                      setTimeout(() => setStaffPhotoNotice(null), 4000);
                                    });
                                  }
                                }}
                              />
                            </label>
                            <button
                              onClick={() => {
                                setEditingStaff(staff);
                                setIsNewStaff(false);
                              }}
                              className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors inline-flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit Profile</span>
                            </button>
                            {!isVictor && (
                              <button
                                type="button"
                                onClick={() => setStaffToDelete(staff)}
                                className="px-2 py-1 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded transition-colors inline-flex items-center gap-1 shadow-2xs"
                                title="Remove staff member"
                              >
                                <Trash2 className="w-3 h-3 text-red-600" />
                                <span>Delete</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* 3. SPECIALTIES TAB */}
      {/* -------------------------------------------------------------------------- */}
      {activeTab === 'specialties' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Medical Specialties & Clinical Services</h2>
              <p className="text-xs text-slate-500">Configure medical departments, clinical descriptions, procedures offered, and delivery modes.</p>
            </div>
            <button
              onClick={() => {
                setEditingSpecialty({
                  slug: `dept-${Date.now()}` as any,
                  name: '',
                  shortDesc: '',
                  fullDesc: '',
                  iconName: 'Activity',
                  commonServices: [],
                  serviceType: 'in_clinic',
                });
                setIsNewSpecialty(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Department</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialties.map(spec => (
              <div
                key={spec.slug}
                className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-semibold uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {spec.slug}
                    </span>
                    <button
                      onClick={() => {
                        setEditingSpecialty(spec);
                        setIsNewSpecialty(false);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-1">{spec.name}</h3>
                  <p className="text-xs text-slate-500 mb-3 line-clamp-2">{spec.shortDesc}</p>

                  <div className="pt-2 border-t border-slate-100 mb-3">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Services ({spec.commonServices.length})
                    </span>
                    <ul className="text-xs text-slate-600 space-y-1">
                      {spec.commonServices.slice(0, 3).map(s => (
                        <li key={s} className="truncate flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0"></span>
                          <span className="truncate">{s}</span>
                        </li>
                      ))}
                      {spec.commonServices.length > 3 && (
                        <li className="text-[11px] text-slate-400 font-medium">
                          +{spec.commonServices.length - 3} more procedures
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="capitalize">Type: {spec.serviceType.replace('_', ' ')}</span>
                  <button
                    onClick={() => setSpecialtyToDelete(spec)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Delete specialty"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* 4. ADMIN PROFILE TAB */}
      {/* -------------------------------------------------------------------------- */}
      {activeTab === 'admin-profile' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#0B3B60] via-[#0A4773] to-[#008CA5] text-white rounded-2xl p-6 sm:p-8 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  {adminProfileForm.avatarUrl ? (
                    <img
                      src={adminProfileForm.avatarUrl}
                      alt={adminProfileForm.name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-full object-cover border-4 border-white/80 shadow-lg bg-white"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-white/20 text-white font-bold flex items-center justify-center text-2xl border-4 border-white/60">
                      {adminProfileForm.name ? adminProfileForm.name.charAt(0) : 'A'}
                    </div>
                  )}
                  <label
                    className="absolute -bottom-1 -right-1 bg-white hover:bg-slate-100 text-slate-800 p-1.5 rounded-full border border-slate-200 shadow-md cursor-pointer transition-colors"
                    title="Upload photo from device"
                  >
                    <Camera className="w-4 h-4 text-[#008CA5]" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          compressAndReadImage(file, dataUrl => {
                            setAdminProfileForm(prev => ({ ...prev, avatarUrl: dataUrl }));
                          });
                        }
                      }}
                    />
                  </label>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight">{adminProfileForm.name}</h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white uppercase tracking-wider backdrop-blur-xs">
                      Super Administrator
                    </span>
                  </div>
                  <p className="text-xs text-sky-100 font-mono mt-0.5">{adminProfileForm.email}</p>
                  <p className="text-xs text-slate-200 mt-1">{adminProfileForm.title}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-white/10 px-4 py-2.5 rounded-xl backdrop-blur-xs border border-white/20 text-xs text-sky-100 self-stretch sm:self-auto">
                <ShieldCheck className="w-5 h-5 text-emerald-300 shrink-0" />
                <div>
                  <span className="font-bold text-white block">Executive Authority</span>
                  <span className="text-[11px] text-slate-200">Doctor Roster · Schedule Monitor · Staff Roles</span>
                </div>
              </div>
            </div>
          </div>

          {/* Success Message Banner */}
          {adminSaveMessage && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 animate-in fade-in shadow-2xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs font-semibold">{adminSaveMessage}</div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Form Column */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Administrator Credentials & Information</h3>
                  <p className="text-xs text-slate-500">Edit legal contact information, clinic leadership department, and portal sign-in password.</p>
                </div>
              </div>

              <form onSubmit={handleSaveAdminProfile} className="space-y-4 text-xs">
                
                {/* Profile Photo Controls */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800">Executive Profile Picture</label>
                    {adminProfileForm.avatarUrl && (
                      <button
                        type="button"
                        onClick={() => setAdminProfileForm(prev => ({ ...prev, avatarUrl: '' }))}
                        className="text-[11px] text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Photo</span>
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-lg border border-slate-200">
                    <div className="relative shrink-0">
                      {adminProfileForm.avatarUrl ? (
                        <img
                          src={adminProfileForm.avatarUrl}
                          alt="Admin Preview"
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-full object-cover border-2 border-indigo-600 bg-slate-50 shadow-xs"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center text-lg border-2 border-dashed border-slate-300">
                          {adminProfileForm.name ? adminProfileForm.name.charAt(0) : 'A'}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 w-full space-y-2">
                      <label className="cursor-pointer w-full bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-300 text-indigo-900 rounded-lg py-2 px-3 flex items-center justify-center gap-2 font-semibold text-xs transition-colors shadow-2xs">
                        <Upload className="w-4 h-4 text-indigo-600" />
                        <span>Upload Photo from Device (JPG, PNG)</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              compressAndReadImage(file, dataUrl => {
                                setAdminProfileForm(prev => ({ ...prev, avatarUrl: dataUrl }));
                              });
                            }
                          }}
                        />
                      </label>
                      <p className="text-[10px] text-slate-400 text-center sm:text-left">
                        Select a headshot from your device. It will be compressed and preserved across sessions.
                      </p>
                    </div>
                  </div>

                  <div className="pt-1">
                    <span className="text-[11px] text-slate-500 font-medium block mb-1.5">Preset Executive Avatars:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_STAFF_AVATARS.map(preset => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setAdminProfileForm(prev => ({ ...prev, avatarUrl: preset.url }))}
                          className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                            adminProfileForm.avatarUrl === preset.url
                              ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={adminProfileForm.avatarUrl}
                      onChange={e => setAdminProfileForm(prev => ({ ...prev, avatarUrl: e.target.value }))}
                      placeholder="Or paste an image web URL..."
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      value={adminProfileForm.name}
                      onChange={e => setAdminProfileForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Official Hospital Email *</label>
                    <input
                      type="email"
                      required
                      value={adminProfileForm.email}
                      onChange={e => setAdminProfileForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Direct Contact Phone</label>
                    <input
                      type="tel"
                      value={adminProfileForm.phone}
                      onChange={e => setAdminProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Professional Title</label>
                    <input
                      type="text"
                      value={adminProfileForm.title}
                      onChange={e => setAdminProfileForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={adminProfileForm.department}
                    onChange={e => setAdminProfileForm(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-slate-900"
                  />
                </div>

                {/* Password field */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Administrator Sign-In Password *</label>
                  <div className="relative">
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      required
                      value={adminProfileForm.password}
                      onChange={e => setAdminProfileForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter administrator password"
                      className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono text-xs text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      tabIndex={-1}
                    >
                      {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Used to authenticate across executive panels, patient records, and doctor rosters.
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Synchronized with Local Storage Persistence</span>
                  </span>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#0B3B60] hover:bg-[#082b47] text-white font-bold rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 text-xs"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes to Admin Profile</span>
                  </button>
                </div>

              </form>
            </div>

            {/* Sidebar Column: Privileges */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-indigo-600" />
                  <span>Executive Admin Privileges</span>
                </h4>
                
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span><strong>Physician Management:</strong> Register, update, and permanently delete physicians from the hospital roster.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span><strong>Staff & Triage Controls:</strong> Add coordinators, assign admin privileges, and manage device photos.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span><strong>Schedule Overrides:</strong> Allocate emergency consultation slots and block/unblock doctor calendars.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span><strong>Protected EHR Security:</strong> Audit all patient appointments, e-prescriptions, and diagnostic records.</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* EDIT / ADD DOCTOR MODAL (WITH PROFILE PICTURE CONTROLS) */}
      {/* -------------------------------------------------------------------------- */}
      {editingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <h3 className="text-sm font-bold text-slate-900">
                {isNewDoctor ? 'Register New Doctor' : `Edit Doctor Profile: ${editingDoctor.name}`}
              </h3>
              <button
                onClick={() => setEditingDoctor(null)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveDoctor} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              
              {/* Doctor Profile Picture Section */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-800">Doctor Profile Picture</label>
                  {editingDoctor.avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setEditingDoctor({ ...editingDoctor, avatarUrl: '' })}
                      className="text-[11px] text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Remove Photo</span>
                    </button>
                  )}
                </div>
                
                {/* Upload from Device Box */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-lg border border-slate-200">
                  <div className="relative shrink-0">
                    {editingDoctor.avatarUrl ? (
                      <img
                        src={editingDoctor.avatarUrl}
                        alt="Doctor Preview"
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover border-2 border-teal-500 bg-slate-50 shadow-xs"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-slate-100 text-slate-500 font-bold flex items-center justify-center text-lg border-2 border-dashed border-slate-300">
                        {editingDoctor.name ? editingDoctor.name.charAt(0) : 'D'}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <label className="cursor-pointer w-full bg-teal-50 hover:bg-teal-100/80 border border-teal-300 text-teal-800 rounded-lg py-2 px-3 flex items-center justify-center gap-2 font-semibold text-xs transition-colors shadow-2xs">
                      <Upload className="w-4 h-4 text-teal-600" />
                      <span>Upload Doctor Photo from Device (JPG, PNG)</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            compressAndReadImage(file, dataUrl => {
                              setEditingDoctor({ ...editingDoctor, avatarUrl: dataUrl });
                            });
                          }
                        }}
                      />
                    </label>
                    <p className="text-[10px] text-slate-400 text-center sm:text-left">
                      Select physician photo from your device. Image will be automatically resized and optimized.
                    </p>
                  </div>
                </div>

                <div className="pt-1">
                  <span className="text-[11px] text-slate-500 font-medium block mb-1.5">Or choose a medical preset photo:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_DOCTOR_AVATARS.map(preset => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setEditingDoctor({ ...editingDoctor, avatarUrl: preset.url })}
                        className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                          editingDoctor.avatarUrl === preset.url
                            ? 'bg-teal-600 text-white border-teal-600 font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    value={editingDoctor.avatarUrl}
                    onChange={e => setEditingDoctor({ ...editingDoctor, avatarUrl: e.target.value })}
                    placeholder="Or enter custom image URL..."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Legal Name & Degree *</label>
                  <input
                    type="text"
                    required
                    value={editingDoctor.name}
                    onChange={e => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
                    placeholder="e.g. Dr. Jordan Hayes, MD"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Clinical Title *</label>
                  <input
                    type="text"
                    required
                    value={editingDoctor.title}
                    onChange={e => setEditingDoctor({ ...editingDoctor, title: e.target.value })}
                    placeholder="e.g. Senior Pediatrician & Clinic Lead"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department Specialty *</label>
                  <select
                    value={editingDoctor.specialty}
                    onChange={e => setEditingDoctor({ ...editingDoctor, specialty: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500"
                  >
                    {specialties.map(s => (
                      <option key={s.slug} value={s.slug}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sub-Specialty Focus</label>
                  <input
                    type="text"
                    value={editingDoctor.subSpecialty}
                    onChange={e => setEditingDoctor({ ...editingDoctor, subSpecialty: e.target.value })}
                    placeholder="e.g. Neonatology, Restorative Dentistry"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Consultation Fee ($) *</label>
                  <input
                    type="number"
                    required
                    value={editingDoctor.consultationFee}
                    onChange={e => setEditingDoctor({ ...editingDoctor, consultationFee: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Experience (Years) *</label>
                  <input
                    type="number"
                    required
                    value={editingDoctor.experienceYears}
                    onChange={e => setEditingDoctor({ ...editingDoctor, experienceYears: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Clinic Room / Suite *</label>
                  <input
                    type="text"
                    required
                    value={editingDoctor.roomOrArea}
                    onChange={e => setEditingDoctor({ ...editingDoctor, roomOrArea: e.target.value })}
                    placeholder="Suite 302, Floor 3"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duty Status</label>
                  <select
                    value={editingDoctor.availabilityStatus}
                    onChange={e => setEditingDoctor({ ...editingDoctor, availabilityStatus: e.target.value as DoctorAvailabilityStatus })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 capitalize"
                  >
                    <option value="available">Available (On Duty)</option>
                    <option value="in_consultation">In Consultation</option>
                    <option value="break">On Clinical Break</option>
                    <option value="off_duty">Off Duty / Absent</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Star Rating (1.0 - 5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={editingDoctor.rating}
                    onChange={e => setEditingDoctor({ ...editingDoctor, rating: parseFloat(e.target.value) || 5.0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 font-mono"
                  />
                </div>
              </div>

              {/* Available Days */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Weekly Consulting Days</label>
                <div className="flex flex-wrap gap-2">
                  {WEEK_DAYS.map(day => {
                    const isSelected = editingDoctor.availableDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDayAvailable(day)}
                        className={`px-3 py-1 text-xs rounded border transition-colors ${
                          isSelected
                            ? 'bg-teal-600 text-white border-teal-600 font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Professional Clinical Bio</label>
                <textarea
                  rows={2}
                  value={editingDoctor.bio}
                  onChange={e => setEditingDoctor({ ...editingDoctor, bio: e.target.value })}
                  placeholder="Doctor's background, clinical philosophy, education..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Qualifications */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Board Certifications & Degrees</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={qualificationInput}
                    onChange={e => setQualificationInput(e.target.value)}
                    placeholder="e.g. MD - Harvard Medical School, FAAP"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddQualification();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddQualification}
                    className="px-3 py-2 bg-slate-800 text-white rounded-md font-semibold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {editingDoctor.qualifications.map((q, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px]">
                      <span>{q}</span>
                      <button type="button" onClick={() => handleRemoveQualification(i)} className="text-slate-400 hover:text-slate-700">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Accepted Insurances */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Accepted Health Insurances</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={insuranceInput}
                    onChange={e => setInsuranceInput(e.target.value)}
                    placeholder="e.g. Blue Cross Blue Shield, Aetna, Cigna"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddInsurance();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddInsurance}
                    className="px-3 py-2 bg-slate-800 text-white rounded-md font-semibold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {editingDoctor.acceptedInsurances.map((ins, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px]">
                      <span>{ins}</span>
                      <button type="button" onClick={() => handleRemoveInsurance(i)} className="text-emerald-600 hover:text-emerald-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-4 border-t border-slate-100">
                {!isNewDoctor ? (
                  <button
                    type="button"
                    onClick={() => {
                      const doc = editingDoctor;
                      setEditingDoctor(null);
                      setDoctorToDelete(doc);
                    }}
                    className="px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-md transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    <span>Delete Physician</span>
                  </button>
                ) : <div />}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingDoctor(null)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-white bg-teal-600 hover:bg-teal-700 rounded-md font-semibold shadow-2xs"
                  >
                    Save Doctor Profile
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* EDIT / ADD STAFF MODAL (WITH PROFILE PICTURE CONTROLS) */}
      {/* -------------------------------------------------------------------------- */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <h3 className="text-sm font-bold text-slate-900">
                {isNewStaff ? 'Add Staff Member' : `Edit Staff: ${editingStaff.name}`}
              </h3>
              <button
                onClick={() => setEditingStaff(null)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              
              {/* Staff Profile Picture Section */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-800">Staff Profile Picture</label>
                  {editingStaff.avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setEditingStaff({ ...editingStaff, avatarUrl: '' })}
                      className="text-[11px] text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Remove Photo</span>
                    </button>
                  )}
                </div>
                
                {/* Upload from Device Box */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-lg border border-slate-200">
                  <div className="relative shrink-0">
                    {editingStaff.avatarUrl ? (
                      <img
                        src={editingStaff.avatarUrl}
                        alt="Staff Preview"
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-full object-cover border-2 border-teal-500 bg-slate-50 shadow-xs"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center text-lg border-2 border-dashed border-slate-300">
                        {editingStaff.name ? editingStaff.name.charAt(0) : 'U'}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <label className="cursor-pointer w-full bg-teal-50 hover:bg-teal-100/80 border border-teal-300 text-teal-800 rounded-lg py-2 px-3 flex items-center justify-center gap-2 font-semibold text-xs transition-colors shadow-2xs">
                      <Upload className="w-4 h-4 text-teal-600" />
                      <span>Upload Photo from Device (JPG, PNG)</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            compressAndReadImage(file, dataUrl => {
                              setEditingStaff({ ...editingStaff, avatarUrl: dataUrl });
                            });
                          }
                        }}
                      />
                    </label>
                    <p className="text-[10px] text-slate-400 text-center sm:text-left">
                      Select any photo from your phone or computer. Image will be automatically optimized.
                    </p>
                  </div>
                </div>

                <div className="pt-1">
                  <span className="text-[11px] text-slate-500 font-medium block mb-1.5">Or choose a preset picture:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_STAFF_AVATARS.map(preset => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setEditingStaff({ ...editingStaff, avatarUrl: preset.url })}
                        className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                          editingStaff.avatarUrl === preset.url
                            ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    value={editingStaff.avatarUrl || ''}
                    onChange={e => setEditingStaff({ ...editingStaff, avatarUrl: e.target.value })}
                    placeholder="Or paste an image web URL..."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={editingStaff.name}
                  onChange={e => setEditingStaff({ ...editingStaff, name: e.target.value })}
                  placeholder="e.g. Victor Chisaka"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={editingStaff.email}
                  onChange={e => setEditingStaff({ ...editingStaff, email: e.target.value })}
                  placeholder="victor43chisaka@gmail.co"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={editingStaff.phone}
                  onChange={e => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Access Role *</label>
                  <select
                    value={editingStaff.role}
                    onChange={e => setEditingStaff({ ...editingStaff, role: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 font-semibold"
                  >
                    <option value="admin">Admin (Full System Control)</option>
                    <option value="staff">Staff (Operational Triage)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={editingStaff.department}
                    onChange={e => setEditingStaff({ ...editingStaff, department: e.target.value })}
                    placeholder="e.g. Clinical Operations"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Professional Title</label>
                <input
                  type="text"
                  value={editingStaff.title}
                  onChange={e => setEditingStaff({ ...editingStaff, title: e.target.value })}
                  placeholder="e.g. Health Systems Director"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500"
                />
              </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Portal Login Password</label>
                  <div className="relative">
                    <input
                      type={showStaffPassword ? 'text' : 'password'}
                      value={editingStaff.password || ''}
                      onChange={e => setEditingStaff({ ...editingStaff, password: e.target.value })}
                      placeholder="Set staff password (e.g. Hospital2026!)"
                      className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 font-mono text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowStaffPassword(!showStaffPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      tabIndex={-1}
                    >
                      {showStaffPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                  {!isNewStaff && editingStaff.id !== 'staff-admin-victor' ? (
                    <button
                      type="button"
                      onClick={() => {
                        const s = editingStaff;
                        setEditingStaff(null);
                        setStaffToDelete(s);
                      }}
                      className="px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-md transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      <span>Delete Staff</span>
                    </button>
                  ) : <div />}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingStaff(null)}
                      className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-white bg-teal-600 hover:bg-teal-700 rounded-md font-semibold shadow-2xs"
                    >
                      Save Staff Member
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

      {/* -------------------------------------------------------------------------- */}
      {/* DOCTOR DELETION CONFIRMATION MODAL (IN-APP CONFIRMATION) */}
      {/* -------------------------------------------------------------------------- */}
      {doctorToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in zoom-in-95 p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-2xs">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Delete Physician from Medical Roster?
              </h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to remove <strong>{doctorToDelete.name}</strong>?
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 text-xs">
              <img
                src={doctorToDelete.avatarUrl}
                alt={doctorToDelete.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-lg object-cover border border-slate-300 shrink-0 bg-white"
              />
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-900 truncate">{doctorToDelete.name}</div>
                <div className="text-teal-700 font-medium text-[11px] truncate">{doctorToDelete.title}</div>
                <div className="text-slate-400 text-[10px] capitalize">
                  {doctorToDelete.specialty.replace('_', ' ')} · Fee: ${doctorToDelete.consultationFee}.00
                </div>
              </div>
            </div>

            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-800 leading-relaxed space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-red-900">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>Immediate Clinical Removal</span>
              </div>
              <p className="text-red-700">
                This physician will be removed from the patient booking portal and doctor duty roster immediately. All associated schedule slots will be unassigned.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDoctorToDelete(null)}
                className="flex-1 py-2.5 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel / Keep Doctor
              </button>
              <button
                type="button"
                onClick={() => {
                  const docName = doctorToDelete.name;
                  deleteDoctor(doctorToDelete.id);
                  setDoctorToDelete(null);
                  setDeleteNotice(`${docName} was permanently deleted from the medical roster.`);
                  setTimeout(() => setDeleteNotice(null), 4000);
                }}
                className="flex-1 py-2.5 px-3 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-2xs flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm & Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* SPECIALTY DELETION CONFIRMATION MODAL */}
      {/* -------------------------------------------------------------------------- */}
      {specialtyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in zoom-in-95 p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-2xs">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Remove Medical Department?
              </h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to delete <strong>{specialtyToDelete.name}</strong> from clinical specialties?
              </p>
            </div>

            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-800 leading-relaxed">
              This department will no longer be visible to patients booking online or listed on the clinic services overview.
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSpecialtyToDelete(null)}
                className="flex-1 py-2.5 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const specName = specialtyToDelete.name;
                  deleteSpecialty(specialtyToDelete.slug);
                  setSpecialtyToDelete(null);
                  setDeleteNotice(`${specName} was removed from medical departments.`);
                  setTimeout(() => setDeleteNotice(null), 4000);
                }}
                className="flex-1 py-2.5 px-3 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-2xs"
              >
                Confirm & Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {staffToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in zoom-in-95 p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-2xs">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Remove Staff Member?
              </h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to delete <strong>{staffToDelete.name}</strong> from clinical operations?
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 text-xs">
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm shrink-0">
                {staffToDelete.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-900 truncate">{staffToDelete.name}</div>
                <div className="text-slate-500 text-[11px] font-mono truncate">{staffToDelete.email}</div>
                <div className="text-slate-400 text-[10px] capitalize">{staffToDelete.role} · {staffToDelete.department}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStaffToDelete(null)}
                className="flex-1 py-2.5 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const staffName = staffToDelete.name;
                  deleteStaffMember(staffToDelete.id);
                  setStaffToDelete(null);
                  setDeleteNotice(`${staffName} was removed from staff members.`);
                  setTimeout(() => setDeleteNotice(null), 4000);
                }}
                className="flex-1 py-2.5 px-3 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-2xs"
              >
                Confirm & Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
