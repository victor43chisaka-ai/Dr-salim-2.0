import React from 'react';
import { SPECIALTIES } from '../../data/mockData';
import { SpecialtySlug } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Smile, 
  HeartPulse, 
  Activity, 
  Baby, 
  Home, 
  Sparkles,
  ArrowRight, 
  Check, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';

interface SpecialtiesViewProps {
  onSelectSpecialty: (slug: SpecialtySlug) => void;
}

export const SpecialtiesView: React.FC<SpecialtiesViewProps> = ({ onSelectSpecialty }) => {
  const { doctors, specialties, setActiveTab } = useApp();

  const getSpecialtyIcon = (slug: SpecialtySlug) => {
    switch (slug) {
      case 'dental': return <Smile className="w-6 h-6 text-teal-600" />;
      case 'internal_medicine': return <HeartPulse className="w-6 h-6 text-rose-600" />;
      case 'surgery': return <Activity className="w-6 h-6 text-indigo-600" />;
      case 'obgyn': return <Baby className="w-6 h-6 text-amber-600" />;
      case 'home_nursing': return <Home className="w-6 h-6 text-emerald-600" />;
      case 'pediatrics': return <Sparkles className="w-6 h-6 text-pink-600" />;
      default: return <HeartPulse className="w-6 h-6 text-teal-600" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Header */}
      <div className="max-w-2xl mb-10">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Clinical Specialties & Services</h1>
        <p className="text-sm text-slate-600 mt-1">
          AegisHealth integrates outpatient surgical suites, diagnostic medicine, preventive dentistry, maternal care, and licensed home nursing delivery under unified clinical governance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {specialties.map(spec => {
          const docCount = doctors.filter(d => d.specialty === spec.slug).length;
          return (
            <div
              key={spec.slug}
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                    {getSpecialtyIcon(spec.slug)}
                  </div>
                  <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {docCount} {docCount === 1 ? 'Specialist' : 'Specialists'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors mb-1.5">
                  {spec.name}
                </h3>
                
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {spec.fullDesc}
                </p>

                <div className="border-t border-slate-100 pt-3 mb-6">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Key Procedures & Programs
                  </span>
                  <ul className="space-y-1.5">
                    {spec.commonServices.map(service => (
                      <li key={service} className="text-xs text-slate-700 flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectSpecialty(spec.slug);
                  setActiveTab('book');
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
              >
                <span>Book {spec.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Home Nursing Callout */}
      <div className="mt-12 bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-1">
            <Home className="w-4 h-4 text-emerald-600" />
            <span>Dedicated Mobile Clinical Nursing Fleet</span>
          </div>
          <p className="text-xs text-emerald-950 leading-relaxed">
            Our registered nurses deliver hospital-grade wound dressings, IV antibiotic infusions, post-operative catheter care, and chronic vital signs monitoring straight to your residence within the metropolitan health district.
          </p>
        </div>
        <button
          onClick={() => {
            onSelectSpecialty('home_nursing');
            setActiveTab('book');
          }}
          className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-2xs whitespace-nowrap transition-colors"
        >
          Request Home Nursing
        </button>
      </div>

    </div>
  );
};
