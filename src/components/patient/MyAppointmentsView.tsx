import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment } from '../../types';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  Pill, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Plus, 
  ShieldCheck,
  CalendarX,
  Stethoscope,
  Smile,
  HeartPulse,
  Activity,
  Baby,
  Home
} from 'lucide-react';

export const MyAppointmentsView: React.FC = () => {
  const { 
    currentUser, 
    patientAppointments, 
    cancelAppointment, 
    rescheduleAppointment, 
    timeSlots,
    setActiveTab,
    openAuthModal
  } = useApp();

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto text-[#008CA5] border border-sky-100">
          <Calendar className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-[#0A335C]">Sign In to View Your Appointments</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Your doctor visits, diagnostic summaries, and medical prescriptions are protected under patient privacy isolation.
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

  const [reschedulingApt, setReschedulingApt] = useState<Appointment | null>(null);
  const [cancellingApt, setCancellingApt] = useState<Appointment | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  
  // Reschedule slots state
  const [newDate, setNewDate] = useState('2026-10-08');
  const [newTime, setNewTime] = useState('');

  const upcomingAppointments = patientAppointments.filter(
    a => a.status === 'confirmed' || a.status === 'pending'
  );

  const pastAppointments = patientAppointments.filter(
    a => a.status === 'completed' || a.status === 'cancelled'
  );

  const handleConfirmCancel = () => {
    if (!cancellingApt) return;
    cancelAppointment(cancellingApt.id, cancellationReason);
    setCancellingApt(null);
    setCancellationReason('');
  };

  const handleConfirmReschedule = () => {
    if (!reschedulingApt || !newTime) return;
    rescheduleAppointment(reschedulingApt.id, newDate, newTime);
    setReschedulingApt(null);
    setNewTime('');
  };

  const getSpecialtyBadge = (specialty: string) => {
    switch (specialty) {
      case 'dental': return 'Dental Care';
      case 'internal_medicine': return 'Internal Medicine';
      case 'surgery': return 'Surgery';
      case 'obgyn': return 'OB/GYN';
      case 'home_nursing': return 'Home Nursing';
      case 'pediatrics': return 'Pediatrics';
      default: return specialty;
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Appointments</h1>
            <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Isolated Patient View</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Displaying only records for <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.email}). Other patient records are restricted.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('book')}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-md shadow-2xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Visit</span>
        </button>
      </div>

      {/* Upcoming Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Upcoming Consultations</span>
            <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {upcomingAppointments.length}
            </span>
          </h2>
        </div>

        {upcomingAppointments.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-8 text-center shadow-2xs">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900 mb-1">No Upcoming Appointments</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              You do not have any scheduled consultations at this time. Book an appointment with one of our specialized physicians.
            </p>
            <button
              onClick={() => setActiveTab('book')}
              className="px-4 py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-md transition-colors"
            >
              Find a Doctor
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingAppointments.map(apt => (
              <div
                key={apt.id}
                className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs hover:border-slate-300 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0 font-bold text-sm">
                      {apt.doctorName.replace('Dr. ', '').replace('Nurse ', '').charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-slate-900">{apt.doctorName}</h3>
                        <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {getSpecialtyBadge(apt.specialty)}
                        </span>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${
                          apt.status === 'confirmed' ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                      
                      {/* Unboxed metadata row with typographic separators */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <span className="font-mono text-teal-800 font-semibold">{apt.referenceCode}</span>
                        <span aria-hidden="true">·</span>
                        <span>{apt.visitType === 'home_visit' ? 'Home Nursing' : 'In-Clinic Consultation'}</span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{apt.homeAddress || 'AegisHealth Main Medical Campus'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <button
                      onClick={() => setReschedulingApt(apt)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors inline-flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reschedule</span>
                    </button>
                    <button
                      onClick={() => setCancellingApt(apt)}
                      className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200 rounded-md transition-colors inline-flex items-center gap-1"
                    >
                      <CalendarX className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>

                {/* Details Section */}
                <div className="pt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Appointment Schedule</span>
                    <span className="font-semibold text-slate-800 font-mono">
                      {apt.date} at {apt.time}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Primary Concern</span>
                    <span className="text-slate-700 line-clamp-1">{apt.reasonForVisit}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Reported Symptoms</span>
                    <span className="text-slate-700 line-clamp-1">{apt.symptoms || 'None reported'}</span>
                  </div>
                </div>

                {apt.staffNotes && (
                  <div className="mt-3 p-2.5 bg-blue-50/70 border border-blue-200/70 rounded text-xs text-blue-900 flex items-start gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold">Clinic Preparation Note:</strong> {apt.staffNotes}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Appointments Section */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>Consultation History & Clinical Summaries</span>
          <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {pastAppointments.length}
          </span>
        </h2>

        {pastAppointments.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-6 text-center text-xs text-slate-500">
            No completed or past appointments in your record yet.
          </div>
        ) : (
          <div className="space-y-4">
            {pastAppointments.map(apt => (
              <div
                key={apt.id}
                className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{apt.doctorName}</span>
                    <span className="text-slate-400 text-xs">·</span>
                    <span className="text-xs text-slate-500 capitalize">{getSpecialtyBadge(apt.specialty)}</span>
                    <span className="text-slate-400 text-xs">·</span>
                    <span className="text-xs font-mono text-slate-400">{apt.date}</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase self-start sm:self-auto ${
                    apt.status === 'completed' ? 'text-slate-700 bg-slate-100' : 'text-red-700 bg-red-50'
                  }`}>
                    {apt.status}
                  </span>
                </div>

                <div className="pt-3 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">Chief Complaint: </span>
                    <span className="text-slate-800">{apt.reasonForVisit}</span>
                  </div>

                  {apt.clinicalSummary && (
                    <div className="p-3 bg-emerald-50/60 border border-emerald-200/60 rounded text-emerald-950">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Doctor's Clinical Assessment</span>
                      </div>
                      <p className="leading-relaxed">{apt.clinicalSummary}</p>
                    </div>
                  )}

                  {apt.prescription && (
                    <div className="p-3 bg-indigo-50/60 border border-indigo-200/60 rounded text-indigo-950">
                      <div className="flex items-center gap-1.5 font-bold text-indigo-900 mb-1">
                        <Pill className="w-3.5 h-3.5 text-indigo-700" />
                        <span>Prescribed Regimen / Instructions</span>
                      </div>
                      <p className="leading-relaxed font-mono text-[11px]">{apt.prescription}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {reschedulingApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 p-6 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-1">Reschedule Consultation</h3>
            <p className="text-xs text-slate-500 mb-4">
              Select a new date and open time slot with {reschedulingApt.doctorName}.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Date</label>
                <select
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="2026-10-08">Thursday, Oct 8, 2026</option>
                  <option value="2026-10-09">Friday, Oct 9, 2026</option>
                  <option value="2026-10-10">Saturday, Oct 10, 2026</option>
                  <option value="2026-10-12">Monday, Oct 12, 2026</option>
                  <option value="2026-10-13">Tuesday, Oct 13, 2026</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Available Times</label>
                <div className="grid grid-cols-3 gap-2">
                  {['09:30 AM', '11:00 AM', '02:00 PM', '03:30 PM', '04:30 PM'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewTime(t)}
                      className={`py-2 text-xs font-mono rounded border text-center transition-colors ${
                        newTime === t
                          ? 'bg-teal-600 text-white border-teal-600 font-semibold'
                          : 'bg-white border-slate-200 text-slate-800 hover:bg-teal-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setReschedulingApt(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!newTime}
                onClick={handleConfirmReschedule}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 rounded-md shadow-2xs"
              >
                Confirm New Slot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancellingApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Cancel Appointment?</h3>
                <p className="text-xs text-slate-500">Ref: {cancellingApt.referenceCode}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Are you sure you want to cancel your appointment with <strong>{cancellingApt.doctorName}</strong> on {cancellingApt.date} at {cancellingApt.time}? The reserved slot will be released back to the clinic schedule.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Cancellation (Optional)</label>
              <input
                type="text"
                value={cancellationReason}
                onChange={e => setCancellationReason(e.target.value)}
                placeholder="e.g. Conflict in schedule, feeling better, illness"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setCancellingApt(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
              >
                Keep Appointment
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md shadow-2xs"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
