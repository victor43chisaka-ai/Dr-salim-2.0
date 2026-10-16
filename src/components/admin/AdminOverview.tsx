import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Stethoscope, 
  Activity, 
  ArrowRight,
  TrendingUp,
  MapPin,
  FileText
} from 'lucide-react';

export const AdminOverview: React.FC = () => {
  const { 
    appointments, 
    doctors, 
    timeSlots, 
    patients, 
    setActiveTab,
    updateAppointmentStaffDetails 
  } = useApp();

  const totalBookings = appointments.length;
  const pendingBookings = appointments.filter(a => a.status === 'pending');
  const confirmedBookings = appointments.filter(a => a.status === 'confirmed');
  const completedBookings = appointments.filter(a => a.status === 'completed');
  
  // Real-time slot utilization
  const totalSlots = timeSlots.length;
  const bookedSlots = timeSlots.filter(s => s.status === 'booked').length;
  const slotUtilizationRate = totalSlots > 0 ? Math.round((bookedSlots / totalSlots) * 100) : 0;

  // Active doctors on duty
  const activeDoctors = doctors.filter(d => d.availabilityStatus === 'available' || d.availabilityStatus === 'in_consultation');

  // Breakdown by department
  const specialtyCounts = {
    dental: appointments.filter(a => a.specialty === 'dental').length,
    internal_medicine: appointments.filter(a => a.specialty === 'internal_medicine').length,
    surgery: appointments.filter(a => a.specialty === 'surgery').length,
    obgyn: appointments.filter(a => a.specialty === 'obgyn').length,
    home_nursing: appointments.filter(a => a.specialty === 'home_nursing').length,
    pediatrics: appointments.filter(a => a.specialty === 'pediatrics').length,
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Clinical Operations Command</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time appointment triage, multi-specialty physician scheduling, and patient directory management.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('admin-bookings')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors shadow-2xs"
          >
            Review All Bookings
          </button>
          <button
            onClick={() => setActiveTab('admin-availability')}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors shadow-2xs"
          >
            Manage Doctor Schedules
          </button>
        </div>
      </div>

      {/* KPI Stat Cards (Single-Elevation, No Pill Sandwich) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Total Bookings</span>
            <Calendar className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{totalBookings}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {confirmedBookings.length} confirmed · {completedBookings.length} completed
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Pending Triage</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700 font-mono tabular-nums">{pendingBookings.length}</div>
          <div className="text-[11px] text-amber-700/80 mt-1">
            Requires clinical confirmation
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Active Physicians On Duty</span>
            <Stethoscope className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {activeDoctors.length} <span className="text-xs font-normal text-slate-400">/ {doctors.length}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Across 5 medical departments
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Slot Utilization Rate</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {slotUtilizationRate}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {bookedSlots} booked of {totalSlots} schedule slots
          </div>
        </div>

      </div>

      {/* Two Columns: Recent Pending Triage + Department Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Pending and Urgent Bookings (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-6 shadow-2xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Booking Requests</h2>
              <p className="text-xs text-slate-500">Immediate action required on pending and new consultations.</p>
            </div>
            <button
              onClick={() => setActiveTab('admin-bookings')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {appointments.slice(0, 5).map(apt => (
              <div
                key={apt.id}
                className="p-3.5 rounded-lg border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{apt.patientName}</span>
                    <span className="text-[11px] font-mono text-teal-800">{apt.referenceCode}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.2 rounded uppercase ${
                      apt.status === 'confirmed' ? 'text-emerald-700 bg-emerald-50' :
                      apt.status === 'pending' ? 'text-amber-700 bg-amber-50' : 'text-slate-600 bg-slate-100'
                    }`}>
                      {apt.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 flex-wrap">
                    <span className="font-medium text-slate-700">{apt.doctorName}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{apt.date} @ {apt.time}</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{apt.specialty.replace('_', ' ')}</span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 truncate">
                    Reason: {apt.reasonForVisit}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {apt.status === 'pending' && (
                    <button
                      onClick={() => updateAppointmentStaffDetails(apt.id, 'confirmed')}
                      className="px-3 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors shadow-2xs"
                    >
                      Approve
                    </button>
                  )}
                  {apt.status === 'confirmed' && (
                    <button
                      onClick={() => updateAppointmentStaffDetails(apt.id, 'completed')}
                      className="px-3 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded transition-colors"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Department Workload & Doctor Status (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Department Breakdown */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900 mb-1">Department Consultation Volume</h2>
            <p className="text-xs text-slate-500 mb-4">Total active appointments booked by specialty.</p>

            <div className="space-y-3">
              {[
                { label: 'Dental Care', count: specialtyCounts.dental, color: 'bg-teal-600' },
                { label: 'Internal Medicine', count: specialtyCounts.internal_medicine, color: 'bg-rose-600' },
                { label: 'Surgery', count: specialtyCounts.surgery, color: 'bg-indigo-600' },
                { label: 'OB/GYN', count: specialtyCounts.obgyn, color: 'bg-amber-600' },
                { label: 'Home Nursing', count: specialtyCounts.home_nursing, color: 'bg-emerald-600' },
                { label: 'Pediatrics & Child Health', count: specialtyCounts.pediatrics, color: 'bg-pink-600' },
              ].map(dep => {
                const pct = totalBookings > 0 ? Math.round((dep.count / totalBookings) * 100) : 0;
                return (
                  <div key={dep.label} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700">{dep.label}</span>
                      <span className="font-mono text-slate-500">{dep.count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${dep.color}`} style={{ width: `${Math.max(pct, 5)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-time Physician Quick Roster */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Physicians On Duty</h2>
                <p className="text-xs text-slate-500">Live clinical presence status.</p>
              </div>
              <button
                onClick={() => setActiveTab('admin-availability')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800"
              >
                Manage
              </button>
            </div>

            <div className="space-y-2.5">
              {doctors.slice(0, 4).map(doc => (
                <div key={doc.id} className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      doc.availabilityStatus === 'available' ? 'bg-emerald-500' :
                      doc.availabilityStatus === 'in_consultation' ? 'bg-amber-500' :
                      doc.availabilityStatus === 'break' ? 'bg-blue-400' : 'bg-slate-400'
                    }`} />
                    <span className="font-semibold text-slate-800 truncate max-w-[150px]">{doc.name}</span>
                  </div>
                  <span className="text-slate-500 capitalize text-[11px] font-mono">
                    {doc.availabilityStatus.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
