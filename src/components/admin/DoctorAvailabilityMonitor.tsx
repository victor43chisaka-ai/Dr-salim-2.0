import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Doctor, DoctorAvailabilityStatus, TimeSlot } from '../../types';
import { 
  Stethoscope, 
  Clock, 
  Calendar, 
  ShieldAlert, 
  Plus, 
  Check, 
  Lock, 
  Unlock, 
  Activity, 
  Users,
  AlertCircle,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const DoctorAvailabilityMonitor: React.FC = () => {
  const { 
    doctors, 
    updateDoctorStatus, 
    timeSlots, 
    toggleSlotBlocked, 
    addEmergencySlot,
    deleteDoctor,
    isAdmin,
    setActiveTab
  } = useApp();

  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(doctors[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState('2026-10-06');
  
  // Doctor deletion & notice states
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);
  const [deleteNotice, setDeleteNotice] = useState<string | null>(null);
  
  // Emergency slot modal state
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [slotTime, setSlotTime] = useState('08:00 AM');
  const [slotPeriod, setSlotPeriod] = useState<'morning' | 'afternoon' | 'evening'>('morning');

  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId) || doctors[0];

  const currentSlots = timeSlots.filter(
    s => s.doctorId === selectedDoctorId && s.date === selectedDate
  );

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorId || !slotTime) return;
    addEmergencySlot(selectedDoctorId, selectedDate, slotTime, slotPeriod);
    setIsAddSlotOpen(false);
  };

  const getStatusBadge = (status: DoctorAvailabilityStatus) => {
    switch (status) {
      case 'available':
        return { text: 'On Duty & Available', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'in_consultation':
        return { text: 'In Consultation', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'break':
        return { text: 'On Clinical Break', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'off_duty':
        return { text: 'Off Duty / Absent', bg: 'bg-slate-100 text-slate-600 border-slate-200' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Physician & Service Availability Monitor</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time duty status controls, schedule slot management, and emergency capacity allocation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin-management')}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-600" />
              <span>Doctor Roster Management</span>
            </button>
          )}
          <button
            onClick={() => setIsAddSlotOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Emergency Slot</span>
          </button>
        </div>
      </div>

      {/* Delete Notice Alert */}
      {deleteNotice && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-2.5 text-xs font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
          <span>{deleteNotice}</span>
        </div>
      )}

      {/* Doctor Cards Overview Grid */}
      <div>
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          Live Clinical Roster ({doctors.length} Physicians & Nurses)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map(doc => {
            const isSelected = selectedDoctor?.id === doc.id;
            const badge = getStatusBadge(doc.availabilityStatus);
            return (
              <div
                key={doc.id}
                onClick={() => setSelectedDoctorId(doc.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all bg-white flex flex-col justify-between ${
                  isSelected
                    ? 'border-teal-600 ring-2 ring-teal-600/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-start gap-3">
                    <img
                      src={doc.avatarUrl}
                      alt={doc.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200 bg-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="text-xs font-bold text-slate-900 truncate">{doc.name}</h3>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border shrink-0 ${badge.bg}`}>
                          {badge.text}
                        </span>
                      </div>

                      <p className="text-[11px] text-teal-700 font-medium truncate mt-0.5">{doc.title}</p>
                      <p className="text-[11px] text-slate-400 capitalize">{doc.specialty.replace('_', ' ')} · {doc.roomOrArea}</p>
                    </div>
                  </div>
                </div>

                {/* Status Changer & Admin Controls */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1 flex-wrap">
                    {(['available', 'in_consultation', 'break', 'off_duty'] as DoctorAvailabilityStatus[]).map(st => (
                      <button
                        key={st}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateDoctorStatus(doc.id, st);
                        }}
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono capitalize transition-colors ${
                          doc.availabilityStatus === st
                            ? 'bg-slate-900 text-white font-semibold'
                            : 'text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {st === 'in_consultation' ? 'Consult' : st.replace('_', ' ')}
                      </button>
                    ))}
                  </div>

                  {isAdmin && (
                    <div className="flex items-center gap-1 shrink-0 ml-auto">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDoctorToDelete(doc);
                        }}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        title={`Delete ${doc.name} from roster`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Doctor Detailed Schedule & Slot Controller */}
      {selectedDoctor && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Schedule Slots for {selectedDoctor.name}
                </h3>
                <span className="text-xs text-slate-500 font-medium">({selectedDoctor.roomOrArea})</span>
              </div>
              <p className="text-xs text-slate-500">
                Click any slot to block/unblock appointment availability in real-time.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setDoctorToDelete(selectedDoctor)}
                  className="px-2.5 py-1 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors flex items-center gap-1 shadow-2xs"
                  title={`Delete ${selectedDoctor.name} from medical roster`}
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-600" />
                  <span>Delete Physician</span>
                </button>
              )}

              {/* Date selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Date:</span>
                <select
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 font-mono"
                >
                <option value="2026-10-05">Monday, Oct 5, 2026</option>
                <option value="2026-10-06">Tuesday, Oct 6, 2026</option>
                <option value="2026-10-07">Wednesday, Oct 7, 2026</option>
                <option value="2026-10-08">Thursday, Oct 8, 2026</option>
                <option value="2026-10-09">Friday, Oct 9, 2026</option>
              </select>
            </div>
          </div>
        </div>

          {/* Slots list */}
          {currentSlots.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No slots configured for this date. Click "Add Emergency Slot" above to provision appointment availability.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
              {currentSlots.map(slot => {
                const isBooked = slot.status === 'booked';
                const isBlocked = slot.status === 'blocked';

                return (
                  <div
                    key={slot.id}
                    onClick={() => {
                      if (!isBooked) toggleSlotBlocked(slot.id);
                    }}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      isBooked
                        ? 'bg-amber-50 border-amber-300 text-amber-900 cursor-not-allowed'
                        : isBlocked
                        ? 'bg-red-50 border-red-300 text-red-800 cursor-pointer hover:bg-red-100'
                        : 'bg-white border-slate-200 text-slate-800 cursor-pointer hover:border-teal-500 hover:shadow-2xs'
                    }`}
                  >
                    <div className="font-mono text-xs font-bold">{slot.time}</div>
                    <div className="text-[10px] mt-1 flex items-center justify-center gap-1 font-medium">
                      {isBooked ? (
                        <span className="text-amber-700">Booked (Patient Reserved)</span>
                      ) : isBlocked ? (
                        <span className="text-red-700 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Blocked
                        </span>
                      ) : (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <Unlock className="w-3 h-3" /> Open
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-3 border-t border-slate-100">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Open for Booking</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Booked by Patient</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Blocked by Staff</span>
          </div>

        </div>
      )}

      {/* Add Emergency Slot Modal */}
      {isAddSlotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 p-6 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-1">Add Emergency Schedule Slot</h3>
            <p className="text-xs text-slate-500 mb-4">
              Allocate immediate appointment capacity for {selectedDoctor?.name}.
            </p>

            <form onSubmit={handleAddSlot} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Slot Time (e.g. 08:00 AM, 05:00 PM)</label>
                <input
                  type="text"
                  required
                  value={slotTime}
                  onChange={e => setSlotTime(e.target.value)}
                  placeholder="08:00 AM"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Period</label>
                <select
                  value={slotPeriod}
                  onChange={e => setSlotPeriod(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500"
                >
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddSlotOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-teal-600 hover:bg-teal-700 rounded-md font-semibold shadow-2xs"
                >
                  Publish Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Doctor Deletion Modal */}
      {doctorToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in zoom-in-95 p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-2xs">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Delete Physician from Roster?
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
                <span>Immediate Schedule & Slot Removal</span>
              </div>
              <p className="text-red-700">
                This physician will be removed immediately from online patient booking, schedule monitors, and doctor rosters.
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
                  const docId = doctorToDelete.id;
                  deleteDoctor(docId);
                  setDoctorToDelete(null);
                  setDeleteNotice(`${docName} was permanently deleted from the medical roster.`);
                  setTimeout(() => setDeleteNotice(null), 4000);
                  if (selectedDoctorId === docId) {
                    const remaining = doctors.filter(d => d.id !== docId);
                    if (remaining.length > 0) {
                      setSelectedDoctorId(remaining[0].id);
                    }
                  }
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

    </div>
  );
};
