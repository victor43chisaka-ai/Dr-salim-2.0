import React from 'react';
import { useApp } from '../../context/AppContext';
import { HospitalLogo } from '../common/HospitalLogo';
import { SpecialtySlug } from '../../types';
import { 
  Calendar, 
  PhoneCall, 
  Mail, 
  MapPin, 
  ArrowRight, 
  Heart, 
  Plus, 
  Users, 
  ShieldCheck, 
  Smile, 
  HeartPulse, 
  Activity, 
  Baby, 
  Home, 
  Sparkles,
  UserPlus,
  Award,
  Sparkle
} from 'lucide-react';

interface HospitalLandingPageProps {
  onSelectSpecialty: (slug: SpecialtySlug) => void;
}

export const HospitalLandingPage: React.FC<HospitalLandingPageProps> = ({ onSelectSpecialty }) => {
  const { specialties, doctors, setActiveTab, currentUser, openAuthModal } = useApp();

  const getSpecialtyIcon = (slug: string) => {
    switch (slug) {
      case 'dental': return <Smile className="w-5 h-5 text-teal-600" />;
      case 'internal_medicine': return <HeartPulse className="w-5 h-5 text-rose-600" />;
      case 'surgery': return <Activity className="w-5 h-5 text-indigo-600" />;
      case 'obgyn': return <Baby className="w-5 h-5 text-amber-600" />;
      case 'home_nursing': return <Home className="w-5 h-5 text-emerald-600" />;
      case 'pediatrics': return <Sparkles className="w-5 h-5 text-pink-600" />;
      default: return <HeartPulse className="w-5 h-5 text-teal-600" />;
    }
  };

  return (
    <div className="font-sans bg-white text-slate-900">
      
      {/* HERO SECTION - REPLICATING THE POSTER DESIGN */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F2F8FA] via-white to-slate-50 pt-8 pb-12 sm:pb-16 border-b border-slate-200">
        
        {/* Soft background radial decorative glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* LEFT COLUMN: EXACT POSTER HEADLINE, DIVIDER, SUBTITLE & 4 PILLARS */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Brand Lockup */}
              <div>
                <HospitalLogo size="lg" showTagline={true} variant="horizontal" />
              </div>

              {/* Main Headline from photo */}
              <div className="space-y-2 pt-2">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black uppercase text-[#0B3B60] tracking-tight leading-[1.08] font-sans">
                  HEALTHCARE <br className="hidden sm:inline" />
                  <span className="text-xl sm:text-2xl md:text-3xl font-bold tracking-widest text-[#008CA5] block sm:inline sm:ml-2">
                    WITH A
                  </span> <br />
                  <span className="text-[#008CA5]">HUMAN TOUCH</span>
                </h1>

                {/* Decorative Heart Divider from photo */}
                <div className="flex items-center gap-3 py-1 max-w-md">
                  <div className="h-[1.5px] bg-[#008CA5]/40 flex-1" />
                  <Heart className="w-4 h-4 text-[#008CA5] fill-[#008CA5]" />
                  <div className="h-[1.5px] bg-[#008CA5]/40 flex-1" />
                </div>

                {/* Italic Script Subheading from photo */}
                <h2 className="text-2xl sm:text-3xl font-serif italic text-[#008CA5] font-semibold tracking-wide">
                  Healing with Skill, Caring with Heart.
                </h2>

                {/* Statement paragraph from photo */}
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-xl font-medium pt-1">
                  At <strong>Dr. Salim Hospital</strong>, we believe healing goes beyond treatment. We listen, we care, and we treat every patient like family.
                </p>
              </div>

              {/* 4 Feature Points from photo with circular badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                
                {/* 1. Compassionate Care */}
                <div className="flex items-start gap-3 bg-white/80 p-3 rounded-xl border border-slate-100 shadow-2xs">
                  <div className="w-10 h-10 rounded-full bg-[#0093A8] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Heart className="w-5 h-5 fill-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[#0B3B60] text-xs uppercase tracking-wide">
                      COMPASSIONATE CARE
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                      We treat you with kindness, respect and empathy.
                    </p>
                  </div>
                </div>

                {/* 2. Quality Treatment */}
                <div className="flex items-start gap-3 bg-white/80 p-3 rounded-xl border border-slate-100 shadow-2xs">
                  <div className="w-10 h-10 rounded-full bg-[#0B3B60] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Plus className="w-5 h-5 stroke-[3]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[#0B3B60] text-xs uppercase tracking-wide">
                      QUALITY TREATMENT
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                      Evidence-based medicine with modern facilities.
                    </p>
                  </div>
                </div>

                {/* 3. Patient First */}
                <div className="flex items-start gap-3 bg-white/80 p-3 rounded-xl border border-slate-100 shadow-2xs">
                  <div className="w-10 h-10 rounded-full bg-[#0093A8] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[#0B3B60] text-xs uppercase tracking-wide">
                      PATIENT FIRST
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                      Your health, comfort and safety are our top priority.
                    </p>
                  </div>
                </div>

                {/* 4. Trust & Integrity */}
                <div className="flex items-start gap-3 bg-white/80 p-3 rounded-xl border border-slate-100 shadow-2xs">
                  <div className="w-10 h-10 rounded-full bg-[#0B3B60] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[#0B3B60] text-xs uppercase tracking-wide">
                      TRUST & INTEGRITY
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                      Honest, ethical and transparent in everything we do.
                    </p>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('book')}
                  className="px-6 py-3 text-xs sm:text-sm font-bold text-white bg-[#0093A8] hover:bg-[#008194] rounded-lg shadow-sm hover:shadow transition-all inline-flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Doctor Appointment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {!currentUser && (
                  <button
                    onClick={() => openAuthModal('register')}
                    className="px-5 py-3 text-xs sm:text-sm font-bold text-white bg-[#0B3B60] hover:bg-[#082b47] rounded-lg transition-colors inline-flex items-center gap-2 shadow-2xs"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up (New Patient)</span>
                  </button>
                )}

                <a
                  href="tel:0979602882"
                  className="px-5 py-3 text-xs sm:text-sm font-bold text-[#0B3B60] bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors inline-flex items-center gap-2 shadow-2xs"
                >
                  <PhoneCall className="w-4 h-4 text-[#0093A8]" />
                  <span>Call 0979602882</span>
                </a>
              </div>

            </div>

            {/* RIGHT COLUMN: DR. SALIM PHOTO WITH CIRCULAR CALLOUT BADGE */}
            <div className="lg:col-span-5 relative flex justify-center">
              
              <div className="relative w-full max-w-md">
                
                {/* Doctor Portrait Image */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                  <img
                    src="/src/assets/images/dr_emmanuel_salim_portrait_1791026927984.jpg"
                    alt="Dr. Emmanuel Salim - Lead Physician"
                    className="w-full h-[460px] sm:h-[500px] object-cover object-top"
                  />

                  {/* Gradient bottom shadow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B3B60]/90 via-[#0B3B60]/20 to-transparent" />

                  {/* Doctor Title Banner at bottom */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#00C2DE] bg-white/10 px-2 py-0.5 rounded backdrop-blur-xs">
                      Founder & Chief Medical Officer
                    </span>
                    <h3 className="text-xl font-bold mt-1 tracking-tight">
                      Dr. Emmanuel Salim, MD
                    </h3>
                    <p className="text-xs text-slate-200">
                      Internal Medicine & Comprehensive Clinical Care
                    </p>
                  </div>
                </div>

                {/* Circular Callout Badge from Photo: "Putting the Human Touch Back in Healthcare" */}
                <div className="absolute -bottom-6 -left-4 sm:-left-8 bg-[#0B3B60] text-white p-5 rounded-full w-48 h-48 sm:w-52 sm:h-52 flex flex-col items-center justify-center text-center shadow-2xl border-4 border-white z-10 animate-in zoom-in-95 duration-300">
                  
                  {/* Heart in Hands Icon */}
                  <div className="mb-1 text-[#00C2DE]">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l.96-.94" />
                    </svg>
                  </div>

                  <p className="text-xs sm:text-[13px] font-extrabold leading-tight tracking-tight text-white px-1">
                    Putting the <br />
                    <span className="text-[#00C2DE]">Human Touch</span> <br />
                    Back in Healthcare.
                  </p>

                  <div className="w-8 h-[1px] bg-white/40 my-1" />

                  <p className="text-[9px] sm:text-[10px] text-slate-300 font-medium">
                    Advanced Medicine. <br />
                    <span className="text-white font-bold">Human Touch.</span>
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* FULL CONTACT & DISPATCH BAR - EXACTLY REPLICATING THE NAVY / CYAN BAR IN PHOTO */}
      <section className="bg-[#0B3B60] text-white border-y border-[#0093A8]/40 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* Phone from photo */}
            <a 
              href="tel:0979602882"
              className="flex items-center gap-3.5 hover:opacity-90 transition-opacity group"
            >
              <div className="w-12 h-12 rounded-full bg-[#0093A8] flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform shadow-md">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold font-mono tracking-wider text-white">
                  0979602882
                </div>
                <div className="text-[11px] font-extrabold tracking-widest uppercase text-[#00C2DE]">
                  CALL US TODAY
                </div>
              </div>
            </a>

            {/* Email from photo */}
            <a 
              href="mailto:emmanuelsalim42@gmail.com"
              className="flex items-center gap-3.5 hover:opacity-90 transition-opacity group"
            >
              <div className="w-12 h-12 rounded-full bg-[#0093A8] flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform shadow-md">
                <Mail className="w-5 h-5" />
              </div>
              <div className="truncate">
                <div className="text-sm sm:text-base font-bold font-mono tracking-tight text-white truncate">
                  emmanuelsalim42@gmail.com
                </div>
                <div className="text-[11px] font-extrabold tracking-widest uppercase text-[#00C2DE]">
                  WE ARE HERE FOR YOU
                </div>
              </div>
            </a>

            {/* Mission from photo */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#0093A8] flex items-center justify-center text-white shrink-0 shadow-md">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white leading-tight">
                  Your Health. Our Mission.
                </div>
                <div className="text-xs text-slate-300">
                  Together, we build a healthier future.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4 CORE VALUES - EXACTLY REPLICATING THE FOOTER BAR FROM THE PHOTO */}
      <section className="bg-slate-50 py-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            
            {/* 1. Compassion */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 text-[#0093A8] flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 fill-[#0093A8]" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-[#0B3B60]">
                  COMPASSION
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  We care deeply.
                </p>
              </div>
            </div>

            {/* 2. Excellence */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 text-[#0093A8] flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-[#0093A8]" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-[#0B3B60]">
                  EXCELLENCE
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  We strive for the best.
                </p>
              </div>
            </div>

            {/* 3. Respect */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 text-[#0093A8] flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-[#0093A8]" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-[#0B3B60]">
                  RESPECT
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  We value every person.
                </p>
              </div>
            </div>

            {/* 4. Integrity */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 text-[#0093A8] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#0093A8]" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-[#0B3B60]">
                  INTEGRITY
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  We do what is right.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* CLINICAL SPECIALTIES & BOOKING SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0093A8]">
              Comprehensive Hospital Services
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B3B60] tracking-tight mt-1">
              Select a Department to Book Your Physician
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('specialties')}
            className="text-xs font-semibold text-[#0093A8] hover:text-[#0B3B60] flex items-center gap-1"
          >
            <span>View all detailed protocols</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {specialties.map(spec => {
            const docCount = doctors.filter(d => d.specialty === spec.slug).length;
            return (
              <div
                key={spec.slug}
                onClick={() => {
                  onSelectSpecialty(spec.slug);
                  setActiveTab('book');
                }}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:shadow-md hover:border-[#0093A8] transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {getSpecialtyIcon(spec.slug)}
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 font-medium">
                      {docCount} {docCount === 1 ? 'Doctor' : 'Doctors'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0093A8] transition-colors mb-1">
                    {spec.name}
                  </h3>
                  
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {spec.shortDesc}
                  </p>

                  <div className="border-t border-slate-100 pt-2.5 mb-2">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Key Services:
                    </span>
                    <p className="text-xs text-slate-700 truncate">
                      {spec.commonServices.slice(0, 2).join(' · ')}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0093A8]">
                  <span>Book Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </section>

    </div>
  );
};
