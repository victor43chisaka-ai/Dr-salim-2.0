import React, { useEffect, useState } from 'react';
import { HospitalLogo } from './HospitalLogo';
import { ShieldCheck, HeartPulse, Check } from 'lucide-react';

interface LoadingSplashProps {
  onComplete?: () => void;
  durationMs?: number;
}

export const LoadingSplash: React.FC<LoadingSplashProps> = ({ 
  onComplete, 
  durationMs = 1800 
}) => {
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState('Initializing Clinical Systems...');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(55);
      setStatusText('Loading Doctor Schedules & Medical Specialties...');
    }, 400);

    const timer2 = setTimeout(() => {
      setProgress(85);
      setStatusText('Syncing Supabase Database Isolation Policies...');
    }, 1000);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatusText('Welcome to Dr. Salim Hospital 2.0');
    }, 1500);

    const timerEnd = setTimeout(() => {
      if (onComplete) onComplete();
    }, durationMs);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timerEnd);
    };
  }, [durationMs, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white p-6 transition-opacity duration-300">
      
      {/* Soft background ambient glow */}
      <div className="absolute w-[450px] h-[450px] bg-teal-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Hospital Logo Centered */}
      <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center">
        <HospitalLogo size="hero" showTagline={true} variant="full" />
      </div>

      {/* Loading Bar & Status */}
      <div className="w-full max-w-xs mt-10 space-y-3">
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#008CA5] to-[#0A335C] transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-medium text-slate-600 truncate">{statusText}</span>
          <span className="font-mono text-[11px] font-semibold text-teal-800">{progress}%</span>
        </div>
      </div>

      {/* Skip Button */}
      <div className="mt-8">
        <button
          onClick={onComplete}
          className="text-xs text-slate-400 hover:text-slate-700 underline underline-offset-4 transition-colors"
        >
          Skip Intro
        </button>
      </div>

      {/* Bottom Medical Trust Marker */}
      <div className="absolute bottom-6 flex items-center gap-2 text-[11px] text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
        <span>Accredited Multi-Specialty Hospital & Research Center</span>
      </div>

    </div>
  );
};
