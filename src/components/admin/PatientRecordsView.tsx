import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PatientProfile, Appointment } from '../../types';
import { 
  Users, 
  Search, 
  User, 
  Heart, 
  AlertTriangle, 
  Calendar, 
  Phone, 
  Mail, 
  ChevronRight, 
  FileText,
  ShieldCheck,
  MapPin,
  Pill
} from 'lucide-react';

export const PatientRecordsView: React.FC = () => {
  const { patients, appointments } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(patients[0]?.id || null);

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery) ||
    p.insurancePolicyNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  const patientAppointments = selectedPatient
    ? appointments.filter(a => a.patientId === selectedPatient.id)
    : [];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Patient Electronic Health Records</h1>
          <p className="text-xs text-slate-500 mt-1">
            Clinical directory, medical alert summaries, and lifetime appointment histories.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <span>{patients.length} Total Registered Patients</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Patient List (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-3">
          
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or insurance policy..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {filteredPatients.map(p => {
              const isSelected = selectedPatient?.id === p.id;
              const visitCount = appointments.filter(a => a.patientId === p.id).length;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPatientId(p.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-teal-50/70 border border-teal-200 shadow-2xs'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                      {p.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{p.name}</h4>
                      <p className="text-[11px] text-slate-500 truncate">{p.email}</p>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                        <span className="font-mono">{p.bloodGroup || 'Blood: N/A'}</span>
                        <span aria-hidden="true">·</span>
                        <span>{visitCount} {visitCount === 1 ? 'visit' : 'visits'}</span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              );
            })}
          </div>

        </div>

        {/* Right: Selected Patient Details & History (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {selectedPatient ? (
            <>
              {/* Patient Card */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs">
                
                <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">{selectedPatient.name}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      DOB: <span className="font-mono text-slate-700 font-medium">{selectedPatient.dateOfBirth}</span> · Gender: {selectedPatient.gender} · Blood: <span className="font-mono font-bold text-teal-700">{selectedPatient.bloodGroup}</span>
                    </p>
                  </div>
                  <span className="text-[11px] font-mono font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    ID: {selectedPatient.id}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs mb-6">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Primary Contact</span>
                    <span className="font-medium text-slate-800">{selectedPatient.phone}</span>
                    <span className="text-slate-500 block text-[11px]">{selectedPatient.email}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Insurance Policy</span>
                    <span className="font-medium text-slate-800">{selectedPatient.insuranceProvider}</span>
                    <span className="font-mono text-slate-500 block text-[11px]">{selectedPatient.insurancePolicyNumber}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Emergency Contact</span>
                    <span className="font-medium text-slate-800">{selectedPatient.emergencyContact.name} ({selectedPatient.emergencyContact.relation})</span>
                    <span className="text-slate-500 block text-[11px]">{selectedPatient.emergencyContact.phone}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Residential Address</span>
                    <span className="text-slate-800 text-[11px]">{selectedPatient.address || 'Address on file required'}</span>
                  </div>
                </div>

                {/* Medical Alert Flags */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div>
                    <span className="text-xs font-semibold text-rose-700 block mb-1">
                      Reported Drug & Environmental Allergies:
                    </span>
                    {selectedPatient.allergies.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {selectedPatient.allergies.map(a => (
                          <span key={a} className="text-xs text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded font-medium">
                            {a}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">No known allergies on record.</span>
                    )}
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-slate-700 block mb-1">
                      Chronic Medical Conditions:
                    </span>
                    {selectedPatient.chronicConditions.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {selectedPatient.chronicConditions.map(c => (
                          <span key={c} className="text-xs text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                            {c}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">No chronic conditions reported.</span>
                    )}
                  </div>
                </div>

              </div>

              {/* Consultation History for this Patient */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
                  <span>Visit History ({patientAppointments.length} Consultations)</span>
                </h3>

                {patientAppointments.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">
                    No recorded visits for this patient yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {patientAppointments.map(apt => (
                      <div
                        key={apt.id}
                        className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-teal-700 font-semibold">{apt.referenceCode}</span>
                            <span className="text-slate-400">·</span>
                            <span className="font-semibold text-slate-800">{apt.doctorName}</span>
                            <span className="text-slate-400">·</span>
                            <span className="capitalize text-slate-600">{apt.specialty.replace('_', ' ')}</span>
                          </div>
                          <span className="font-mono text-slate-500">{apt.date} @ {apt.time}</span>
                        </div>

                        <div>
                          <span className="text-slate-500 font-medium">Chief Complaint: </span>
                          <span className="text-slate-800">{apt.reasonForVisit}</span>
                        </div>

                        {apt.clinicalSummary && (
                          <div className="p-2.5 bg-white border border-slate-200 rounded text-slate-700">
                            <strong className="text-teal-800 font-semibold block mb-0.5">Clinical Findings & Diagnosis:</strong>
                            <p>{apt.clinicalSummary}</p>
                          </div>
                        )}

                        {apt.prescription && (
                          <div className="p-2.5 bg-indigo-50/60 border border-indigo-200/60 rounded text-indigo-950 font-mono text-[11px]">
                            <strong className="text-indigo-800 font-semibold block mb-0.5 font-sans">Prescription:</strong>
                            <p>{apt.prescription}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-xs text-slate-500">
              Select a patient from the directory to review their electronic health record.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
