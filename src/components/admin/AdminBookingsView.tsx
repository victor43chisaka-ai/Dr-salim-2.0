import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment, SpecialtySlug, AppointmentStatus } from '../../types';
import { SPECIALTIES } from '../../data/mockData';
import { 
  Search, 
  Filter, 
  Check, 
  X, 
  FileText, 
  Pill, 
  Clock, 
  Calendar, 
  User, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  Plus
} from 'lucide-react';

export const AdminBookingsView: React.FC = () => {
  const { appointments, updateAppointmentStaffDetails } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Clinical Notes & Prescription Modal
  const [activeEditingApt, setActiveEditingApt] = useState<Appointment | null>(null);
  const [clinicalSummaryInput, setClinicalSummaryInput] = useState('');
  const [prescriptionInput, setPrescriptionInput] = useState('');
  const [staffNotesInput, setStaffNotesInput] = useState('');
  const [statusInput, setStatusInput] = useState<AppointmentStatus>('confirmed');

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = 
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.referenceCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.reasonForVisit.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialty = selectedSpecialty === 'all' || apt.specialty === selectedSpecialty;
    const matchesStatus = selectedStatus === 'all' || apt.status === selectedStatus;

    return matchesSearch && matchesSpecialty && matchesStatus;
  });

  const handleOpenEditModal = (apt: Appointment) => {
    setActiveEditingApt(apt);
    setClinicalSummaryInput(apt.clinicalSummary || '');
    setPrescriptionInput(apt.prescription || '');
    setStaffNotesInput(apt.staffNotes || '');
    setStatusInput(apt.status);
  };

  const handleSaveClinicalNotes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEditingApt) return;

    updateAppointmentStaffDetails(
      activeEditingApt.id,
      statusInput,
      staffNotesInput,
      clinicalSummaryInput,
      prescriptionInput
    );

    setActiveEditingApt(null);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manage All Clinic Bookings</h1>
          <p className="text-xs text-slate-500 mt-1">
            Master appointment schedule across Dental, Internal Medicine, Surgery, OB/GYN, and Home Nursing.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-500">Showing {filteredAppointments.length} of {appointments.length} records</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Search box */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by patient name, reference code (e.g. AEG-), doctor, or symptom..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Specialty filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedSpecialty}
              onChange={e => setSelectedSpecialty(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Specialties</option>
              <option value="dental">Dental Care</option>
              <option value="internal_medicine">Internal Medicine</option>
              <option value="surgery">Surgery</option>
              <option value="obgyn">OB/GYN</option>
              <option value="home_nursing">Home Nursing</option>
              <option value="pediatrics">Pediatrics & Child Health</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending Review</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

        </div>
      </div>

      {/* Bookings Table (High-Density Data Grid, Tabular Numerals) */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Ref & Patient</th>
                <th className="py-3 px-4">Doctor / Specialty</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Visit Type</th>
                <th className="py-3 px-4">Reason / Clinical Notes</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No matching bookings found for the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map(apt => (
                  <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Patient & Ref */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{apt.patientName}</div>
                      <div className="font-mono text-teal-700 text-[11px] font-semibold">{apt.referenceCode}</div>
                      <div className="text-slate-400 text-[10px]">{apt.patientPhone}</div>
                    </td>

                    {/* Doctor & Specialty */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{apt.doctorName}</div>
                      <div className="text-[11px] text-slate-500 capitalize">{apt.specialty.replace('_', ' ')}</div>
                    </td>

                    {/* Schedule */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono font-semibold text-slate-900">{apt.date}</div>
                      <div className="font-mono text-slate-500 text-[11px]">{apt.time}</div>
                    </td>

                    {/* Visit Type */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        apt.visitType === 'home_visit' 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {apt.visitType === 'home_visit' ? 'Home Nursing' : 'In-Clinic'}
                      </span>
                      {apt.homeAddress && (
                        <div className="text-[10px] text-slate-400 max-w-[150px] truncate mt-0.5">
                          {apt.homeAddress}
                        </div>
                      )}
                    </td>

                    {/* Reason / Notes */}
                    <td className="py-3 px-4 max-w-[220px]">
                      <div className="truncate text-slate-800 font-medium" title={apt.reasonForVisit}>
                        {apt.reasonForVisit}
                      </div>
                      {apt.clinicalSummary && (
                        <div className="text-[10px] text-teal-700 truncate" title={apt.clinicalSummary}>
                          Dx: {apt.clinicalSummary}
                        </div>
                      )}
                      {apt.prescription && (
                        <div className="text-[10px] text-indigo-600 truncate font-mono" title={apt.prescription}>
                          Rx: {apt.prescription}
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${
                        apt.status === 'confirmed' ? 'text-emerald-700 bg-emerald-50' :
                        apt.status === 'pending' ? 'text-amber-700 bg-amber-50' :
                        apt.status === 'completed' ? 'text-blue-700 bg-blue-50' :
                        'text-red-700 bg-red-50'
                      }`}>
                        {apt.status}
                      </span>
                    </td>

                    {/* Row Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        
                        {/* Quick Approve if Pending */}
                        {apt.status === 'pending' && (
                          <button
                            onClick={() => updateAppointmentStaffDetails(apt.id, 'confirmed')}
                            className="p-1 text-emerald-700 hover:bg-emerald-100 rounded"
                            title="Approve Booking"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}

                        {/* Open Clinical Notes Modal */}
                        <button
                          onClick={() => handleOpenEditModal(apt)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors inline-flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Manage</span>
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Booking & Clinical Notes Modal */}
      {activeEditingApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Manage Booking: <span className="font-mono text-teal-700">{activeEditingApt.referenceCode}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Patient: {activeEditingApt.patientName} · {activeEditingApt.doctorName}
                </p>
              </div>
              <button
                onClick={() => setActiveEditingApt(null)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveClinicalNotes} className="p-6 space-y-4 text-xs">
              
              {/* Status Selector */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Appointment Status</label>
                <select
                  value={statusInput}
                  onChange={e => setStatusInput(e.target.value as AppointmentStatus)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending Review</option>
                  <option value="completed">Completed (Consultation Finished)</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Internal Staff Notes */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Internal Clinic / Nurse Preparation Notes</label>
                <input
                  type="text"
                  value={staffNotesInput}
                  onChange={e => setStaffNotesInput(e.target.value)}
                  placeholder="e.g. Room 104 prepared, sterile dressing kit packed, fasting labs drawn"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Clinical Assessment / Doctor Summary */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Doctor's Clinical Assessment & Diagnostic Summary</label>
                <textarea
                  rows={3}
                  value={clinicalSummaryInput}
                  onChange={e => setClinicalSummaryInput(e.target.value)}
                  placeholder="Enter clinical examination findings, diagnosis, and post-visit advice (visible to patient)..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Prescription / Regimen */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Prescription Regimen & Instructions</label>
                <input
                  type="text"
                  value={prescriptionInput}
                  onChange={e => setPrescriptionInput(e.target.value)}
                  placeholder="e.g. Amoxicillin 500mg TID x 7 days; Ibuprofen 400mg PRN for pain"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveEditingApt(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white bg-teal-600 hover:bg-teal-700 rounded-md font-semibold shadow-2xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
