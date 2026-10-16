import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SPECIALTIES } from '../../data/mockData';
import { SpecialtySlug, Doctor, VisitType, PatientProfile } from '../../types';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight, 
  ArrowLeft, 
  Star, 
  AlertCircle,
  Stethoscope,
  Smile,
  HeartPulse,
  Activity,
  Baby,
  Home,
  Sparkles,
  Check
} from 'lucide-react';

interface BookAppointmentFlowProps {
  initialSpecialty?: SpecialtySlug;
}

export const BookAppointmentFlow: React.FC<BookAppointmentFlowProps> = ({ initialSpecialty }) => {
  const { 
    doctors, 
    specialties,
    timeSlots, 
    bookAppointment, 
    currentUser, 
    setActiveTab,
    openAuthModal
  } = useApp();

  const patientProfile = currentUser as PatientProfile | null;

  const [selectedSpecialty, setSelectedSpecialty] = useState<SpecialtySlug>(initialSpecialty || 'dental');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  
  // Date picker: generate next 10 dates starting from Oct 5, 2026
  const availableDates = [
    { dateStr: '2026-10-05', dayName: 'Mon', dayNum: '5', month: 'Oct' },
    { dateStr: '2026-10-06', dayName: 'Tue', dayNum: '6', month: 'Oct' },
    { dateStr: '2026-10-07', dayName: 'Wed', dayNum: '7', month: 'Oct' },
    { dateStr: '2026-10-08', dayName: 'Thu', dayNum: '8', month: 'Oct' },
    { dateStr: '2026-10-09', dayName: 'Fri', dayNum: '9', month: 'Oct' },
    { dateStr: '2026-10-10', dayName: 'Sat', dayNum: '10', month: 'Oct' },
    { dateStr: '2026-10-12', dayName: 'Mon', dayNum: '12', month: 'Oct' },
    { dateStr: '2026-10-13', dayName: 'Tue', dayNum: '13', month: 'Oct' },
  ];

  const [selectedDate, setSelectedDate] = useState<string>(availableDates[0].dateStr);
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  // Booking Form State
  const [visitType, setVisitType] = useState<VisitType>(selectedSpecialty === 'home_nursing' ? 'home_visit' : 'in_clinic');
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [homeAddress, setHomeAddress] = useState(patientProfile?.address || '');
  const [patientNotes, setPatientNotes] = useState('');
  const [bookingConfirmedRef, setBookingConfirmedRef] = useState<string | null>(null);

  // Doctors for the chosen specialty
  const specialtyDoctors = doctors.filter(d => d.specialty === selectedSpecialty);

  // Auto-select first doctor if none chosen or if changing specialty
  const activeDoctor: Doctor | undefined = specialtyDoctors.find(d => d.id === selectedDoctorId) || specialtyDoctors[0];

  const currentDoctorId = activeDoctor ? activeDoctor.id : '';

  // Get slots for this doctor and date
  const doctorDateSlots = timeSlots.filter(s => s.doctorId === currentDoctorId && s.date === selectedDate);

  // Fallback default times if none seeded for that specific day
  const defaultMorningTimes = ['09:00 AM', '10:00 AM', '11:00 AM'];
  const defaultAfternoonTimes = ['01:30 PM', '02:30 PM', '03:30 PM'];
  const defaultEveningTimes = ['04:30 PM', '05:30 PM'];

  const getSlotStatus = (time: string): 'available' | 'booked' | 'blocked' => {
    const slot = doctorDateSlots.find(s => s.time === time);
    if (!slot) return 'available';
    return slot.status;
  };

  const handleSpecialtyChange = (slug: SpecialtySlug) => {
    setSelectedSpecialty(slug);
    const docs = doctors.filter(d => d.specialty === slug);
    if (docs.length > 0) {
      setSelectedDoctorId(docs[0].id);
    }
    setVisitType(slug === 'home_nursing' ? 'home_visit' : 'in_clinic');
    setSelectedTime('');
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      openAuthModal('login');
      return;
    }
    if (!activeDoctor || !selectedTime || !reasonForVisit.trim()) return;

    const res = bookAppointment({
      doctorId: activeDoctor.id,
      specialty: selectedSpecialty,
      date: selectedDate,
      time: selectedTime,
      visitType,
      reasonForVisit,
      symptoms,
      homeAddress: visitType === 'home_visit' ? homeAddress : undefined,
      patientNotes,
    });

    if (res.success && res.referenceCode) {
      setBookingConfirmedRef(res.referenceCode);
    }
  };

  const getSpecialtyIcon = (slug: SpecialtySlug) => {
    switch (slug) {
      case 'dental': return <Smile className="w-4 h-4" />;
      case 'internal_medicine': return <HeartPulse className="w-4 h-4" />;
      case 'surgery': return <Activity className="w-4 h-4" />;
      case 'obgyn': return <Baby className="w-4 h-4" />;
      case 'home_nursing': return <Home className="w-4 h-4" />;
      case 'pediatrics': return <Sparkles className="w-4 h-4" />;
      default: return <Stethoscope className="w-4 h-4" />;
    }
  };

  if (bookingConfirmedRef) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs text-center">
          <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Appointment Confirmed</h2>
          <p className="text-sm text-slate-600 mb-6">
            Your booking reference has been securely registered in AegisHealth clinical database.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 text-left mb-6 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Reference Code</span>
              <span className="text-base font-bold font-mono text-teal-700">{bookingConfirmedRef}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Doctor / Practitioner</span>
                <span className="font-semibold text-slate-900 text-sm">{activeDoctor?.name}</span>
                <span className="text-slate-500 text-[11px] block">{activeDoctor?.title}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Date & Time</span>
                <span className="font-semibold text-slate-900 text-sm">{selectedDate}</span>
                <span className="text-teal-700 font-medium block">{selectedTime}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Service Specialty</span>
                <span className="font-semibold text-slate-900 capitalize">{selectedSpecialty.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Visit Type & Location</span>
                <span className="font-semibold text-slate-900">
                  {visitType === 'home_visit' ? 'Home Healthcare Visit' : activeDoctor?.roomOrArea}
                </span>
              </div>
            </div>

            {visitType === 'home_visit' && (
              <div className="pt-2 border-t border-slate-200 text-xs">
                <span className="text-slate-500 block">Home Visit Address</span>
                <span className="font-medium text-slate-800">{homeAddress}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab('my-appointments')}
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors shadow-2xs"
            >
              View in My Appointments
            </button>
            <button
              onClick={() => {
                setBookingConfirmedRef(null);
                setReasonForVisit('');
                setSymptoms('');
                setSelectedTime('');
              }}
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors"
            >
              Book Another Visit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Schedule a Medical Appointment</h1>
        <p className="text-sm text-slate-600 mt-1">
          Select a medical department, choose an available specialist, and reserve your preferred consultation slot.
        </p>
      </div>

      {/* Step 1: Specialty Selection Tabs */}
      <div className="mb-8">
        <label className="block text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wider">
          Step 1: Select Medical Specialty
        </label>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {specialties.map(spec => {
            const isSelected = selectedSpecialty === spec.slug;
            return (
              <button
                key={spec.slug}
                onClick={() => handleSpecialtyChange(spec.slug)}
                className={`p-3.5 rounded-lg text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/70 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                    isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {getSpecialtyIcon(spec.slug)}
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-teal-600" />}
                </div>
                <div>
                  <h3 className={`text-xs font-bold ${isSelected ? 'text-teal-900' : 'text-slate-900'}`}>
                    {spec.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                    {spec.shortDesc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Doctor Selection & Schedule (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Step 2: Choose Doctor in this Specialty */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Step 2: Choose Specialist ({specialtyDoctors.length} available)
              </label>
            </div>

            <div className="space-y-3">
              {specialtyDoctors.map(doc => {
                const isSelected = activeDoctor?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setSelectedDoctorId(doc.id);
                      setSelectedTime('');
                    }}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-teal-600 bg-white ring-2 ring-teal-600/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Doctor Avatar with styled fallback */}
                      <div className="relative shrink-0">
                        <img
                          src={doc.avatarUrl}
                          alt={doc.name}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-lg object-cover border border-slate-200 bg-slate-100"
                        />
                        <span 
                          className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                            doc.availabilityStatus === 'available' ? 'bg-emerald-500' :
                            doc.availabilityStatus === 'in_consultation' ? 'bg-amber-500' :
                            doc.availabilityStatus === 'break' ? 'bg-blue-400' : 'bg-slate-400'
                          }`}
                          title={`Status: ${doc.availabilityStatus}`}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-bold text-slate-900 truncate">{doc.name}</h4>
                          <span className="text-xs font-bold font-mono text-slate-900 shrink-0">
                            ${doc.consultationFee} <span className="text-[10px] font-normal text-slate-500">/ visit</span>
                          </span>
                        </div>
                        
                        <p className="text-xs text-teal-700 font-medium truncate">{doc.title}</p>
                        
                        {/* Unboxed metadata row with typographic separators */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-0.5 font-medium text-amber-600">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="font-mono tabular-nums">{doc.rating}</span>
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">{doc.experienceYears} yrs experience</span>
                          <span aria-hidden="true">·</span>
                          <span className="truncate">{doc.roomOrArea}</span>
                        </div>

                        <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                          {doc.bio}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Pick Date & Time */}
          {activeDoctor && (
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
              <label className="block text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wider">
                Step 3: Select Date & Time
              </label>

              {/* Date horizontal picker */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-5">
                {availableDates.map(item => {
                  const isCurrentDate = selectedDate === item.dateStr;
                  return (
                    <button
                      key={item.dateStr}
                      type="button"
                      onClick={() => {
                        setSelectedDate(item.dateStr);
                        setSelectedTime('');
                      }}
                      className={`flex flex-col items-center justify-center p-2.5 min-w-[70px] rounded-lg border transition-all shrink-0 ${
                        isCurrentDate
                          ? 'border-teal-600 bg-teal-600 text-white shadow-2xs'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-semibold opacity-80">{item.dayName}</span>
                      <span className="text-base font-bold font-mono my-0.5">{item.dayNum}</span>
                      <span className="text-[10px] opacity-80">{item.month}</span>
                    </button>
                  );
                })}
              </div>

              {/* Time Slots Categories */}
              <div className="space-y-4">
                
                {/* Morning */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                    Morning Sessions
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {defaultMorningTimes.map(timeStr => {
                      const status = getSlotStatus(timeStr);
                      const isSelected = selectedTime === timeStr;
                      const isAvailable = status === 'available';

                      return (
                        <button
                          key={timeStr}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => setSelectedTime(timeStr)}
                          className={`py-2 px-2 text-xs font-mono font-medium rounded-md border text-center transition-all ${
                            isSelected
                              ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                              : isAvailable
                              ? 'bg-white border-slate-200 text-slate-800 hover:border-teal-500 hover:bg-teal-50/50'
                              : status === 'booked'
                              ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through'
                              : 'bg-red-50 border-red-200 text-red-400 cursor-not-allowed'
                          }`}
                        >
                          {timeStr}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Afternoon */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                    Afternoon Sessions
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {defaultAfternoonTimes.map(timeStr => {
                      const status = getSlotStatus(timeStr);
                      const isSelected = selectedTime === timeStr;
                      const isAvailable = status === 'available';

                      return (
                        <button
                          key={timeStr}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => setSelectedTime(timeStr)}
                          className={`py-2 px-2 text-xs font-mono font-medium rounded-md border text-center transition-all ${
                            isSelected
                              ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                              : isAvailable
                              ? 'bg-white border-slate-200 text-slate-800 hover:border-teal-500 hover:bg-teal-50/50'
                              : status === 'booked'
                              ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through'
                              : 'bg-red-50 border-red-200 text-red-400 cursor-not-allowed'
                          }`}
                        >
                          {timeStr}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Evening */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                    Evening Sessions
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {defaultEveningTimes.map(timeStr => {
                      const status = getSlotStatus(timeStr);
                      const isSelected = selectedTime === timeStr;
                      const isAvailable = status === 'available';

                      return (
                        <button
                          key={timeStr}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => setSelectedTime(timeStr)}
                          className={`py-2 px-2 text-xs font-mono font-medium rounded-md border text-center transition-all ${
                            isSelected
                              ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                              : isAvailable
                              ? 'bg-white border-slate-200 text-slate-800 hover:border-teal-500 hover:bg-teal-50/50'
                              : status === 'booked'
                              ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through'
                              : 'bg-red-50 border-red-200 text-red-400 cursor-not-allowed'
                          }`}
                        >
                          {timeStr}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Right Column: Booking Details Form & Confirmation (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs sticky top-24">
            
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Step 4: Visit & Patient Information
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {currentUser ? (
                <>
                  Booking for: <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.email})
                </>
              ) : (
                <>
                  Booking as: <span className="font-semibold text-[#008CA5]">Guest Patient</span> (You will be prompted to sign in)
                </>
              )}
            </p>

            <form onSubmit={handleConfirmBooking} className="space-y-4">
              
              {/* Visit Type Toggle */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Consultation Setting
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={selectedSpecialty === 'home_nursing'}
                    onClick={() => setVisitType('in_clinic')}
                    className={`py-2 px-3 text-xs font-medium rounded-md border text-center transition-colors ${
                      visitType === 'in_clinic'
                        ? 'bg-teal-50 border-teal-600 text-teal-800 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    In-Clinic Visit
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisitType('home_visit')}
                    className={`py-2 px-3 text-xs font-medium rounded-md border text-center transition-colors ${
                      visitType === 'home_visit'
                        ? 'bg-teal-50 border-teal-600 text-teal-800 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Home Healthcare
                  </button>
                </div>
              </div>

              {/* If Home Visit: require home address */}
              {visitType === 'home_visit' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Home Nursing Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={homeAddress}
                    onChange={e => setHomeAddress(e.target.value)}
                    placeholder="Enter complete residential address & gate/door code"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                  <p className="text-[11px] text-teal-700 mt-1">
                    Clinical nurse arrives with mobile medical equipment and sterile supplies.
                  </p>
                </div>
              )}

              {/* Reason for Visit */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Reason for Visit *
                </label>
                <input
                  type="text"
                  required
                  value={reasonForVisit}
                  onChange={e => setReasonForVisit(e.target.value)}
                  placeholder="e.g. Tooth ache, annual checkup, wound care, pregnancy exam"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              {/* Symptoms Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Symptoms & Duration (Optional)
                </label>
                <textarea
                  rows={2}
                  value={symptoms}
                  onChange={e => setSymptoms(e.target.value)}
                  placeholder="Describe when symptoms started, severity, or current medications..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Special Accommodations or Notes
                </label>
                <input
                  type="text"
                  value={patientNotes}
                  onChange={e => setPatientNotes(e.target.value)}
                  placeholder="e.g. Wheelchair access, anxious about needles, companion attending"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              {/* Summary Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-md p-3 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Selected Specialist:</span>
                  <span className="font-semibold text-slate-900">{activeDoctor?.name}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Date & Slot:</span>
                  <span className="font-semibold text-slate-900">
                    {selectedDate} {selectedTime ? `@ ${selectedTime}` : '(Pick time slot)'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Consultation Fee:</span>
                  <span className="font-bold text-slate-900 font-mono">${activeDoctor?.consultationFee}.00</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={!selectedTime || !reasonForVisit.trim()}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-md shadow-2xs transition-colors"
              >
                {!currentUser 
                  ? `Sign In & Reserve Appointment ($${activeDoctor?.consultationFee})` 
                  : !selectedTime 
                  ? 'Please Select a Time Slot Above' 
                  : `Confirm & Reserve Appointment ($${activeDoctor?.consultationFee})`}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Isolated patient record · Protected by Supabase RLS</span>
              </div>
            </form>

          </div>
        </div>

      </div>

    </div>
  );
};
