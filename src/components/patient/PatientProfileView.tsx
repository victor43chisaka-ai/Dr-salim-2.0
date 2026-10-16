import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PatientProfile } from '../../types';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Heart, 
  AlertCircle, 
  FileCheck, 
  Save, 
  CheckCircle2,
  Lock
} from 'lucide-react';

export const PatientProfileView: React.FC = () => {
  const { currentUser, updatePatientProfile, openAuthModal } = useApp();

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto text-[#008CA5] border border-sky-100">
          <User className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-[#0A335C]">Sign In to View Health Profile</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Your electronic medical record, insurance numbers, allergies, and contact details are stored securely.
        </p>
        <div className="pt-2">
          <button
            onClick={() => openAuthModal('login')}
            className="px-6 py-2.5 bg-[#008CA5] hover:bg-[#007a90] text-white font-bold text-xs rounded-lg shadow-xs transition-colors"
          >
            Sign In with Email & Password
          </button>
        </div>
      </div>
    );
  }

  const profile = currentUser as PatientProfile;

  const [formData, setFormData] = useState({
    name: profile.name || '',
    phone: profile.phone || '',
    address: profile.address || '',
    dateOfBirth: profile.dateOfBirth || '',
    gender: profile.gender || 'Prefer not to say',
    bloodGroup: profile.bloodGroup || 'O+',
    allergies: (profile.allergies || []).join(', '),
    chronicConditions: (profile.chronicConditions || []).join(', '),
    emergencyName: profile.emergencyContact?.name || '',
    emergencyPhone: profile.emergencyContact?.phone || '',
    emergencyRelation: profile.emergencyContact?.relation || '',
    insuranceProvider: profile.insuranceProvider || '',
    insurancePolicyNumber: profile.insurancePolicyNumber || '',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePatientProfile({
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender as any,
      bloodGroup: formData.bloodGroup,
      allergies: formData.allergies.split(',').map(s => s.trim()).filter(Boolean),
      chronicConditions: formData.chronicConditions.split(',').map(s => s.trim()).filter(Boolean),
      emergencyContact: {
        name: formData.emergencyName,
        phone: formData.emergencyPhone,
        relation: formData.emergencyRelation,
      },
      insuranceProvider: formData.insuranceProvider,
      insurancePolicyNumber: formData.insurancePolicyNumber,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Patient Health Profile</h1>
            <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>Strict RLS Protected</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Personal health summary, emergency contacts, and active medical records.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-md animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile Saved Successfully</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Demographics */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs">
          <h2 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <User className="w-4 h-4 text-teal-600" />
            <span>Personal Demographics</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address (Account ID)</label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full px-3 py-2 border border-slate-200 bg-slate-100 text-slate-500 rounded-md cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value as "Female" | "Male" | "Other" | "Prefer not to say" })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
              <select
                value={formData.bloodGroup}
                onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Home Residence Address (For Home Nursing)</label>
              <input
                type="text"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street address, city, state, postal code"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Clinical Alert Details */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs">
          <h2 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-600" />
            <span>Clinical Alerts & Medical History</span>
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Known Drug & Environmental Allergies (comma-separated)
              </label>
              <input
                type="text"
                value={formData.allergies}
                onChange={e => setFormData({ ...formData, allergies: e.target.value })}
                placeholder="e.g. Penicillin, Latex, Peanuts, Sulfa drugs"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Highlighted automatically to consulting surgeons and nurses prior to medication administration.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Chronic Medical Conditions (comma-separated)
              </label>
              <input
                type="text"
                value={formData.chronicConditions}
                onChange={e => setFormData({ ...formData, chronicConditions: e.target.value })}
                placeholder="e.g. Hypertension, Type 2 Diabetes, Asthma"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Emergency Contact & Insurance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-600" />
              <span>Emergency Contact</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Name</label>
                <input
                  type="text"
                  value={formData.emergencyName}
                  onChange={e => setFormData({ ...formData, emergencyName: e.target.value })}
                  placeholder="e.g. Emily Doe"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Relationship</label>
                <input
                  type="text"
                  value={formData.emergencyRelation}
                  onChange={e => setFormData({ ...formData, emergencyRelation: e.target.value })}
                  placeholder="e.g. Spouse, Parent, Sibling"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Emergency Phone</label>
                <input
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={e => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-indigo-600" />
              <span>Insurance Coverage</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Insurance Provider</label>
                <input
                  type="text"
                  value={formData.insuranceProvider}
                  onChange={e => setFormData({ ...formData, insuranceProvider: e.target.value })}
                  placeholder="e.g. Blue Cross Blue Shield, Aetna, Medicare"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Policy / Member ID</label>
                <input
                  type="text"
                  value={formData.insurancePolicyNumber}
                  onChange={e => setFormData({ ...formData, insurancePolicyNumber: e.target.value })}
                  placeholder="e.g. BCBS-98402-99"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-500 mt-2">
                Co-pays and diagnostic procedures are automatically verified against your provider during check-in.
              </div>
            </div>
          </div>

        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-md shadow-2xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Update Health Profile</span>
          </button>
        </div>

      </form>
    </div>
  );
};
