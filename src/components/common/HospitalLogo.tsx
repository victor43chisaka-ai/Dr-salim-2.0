import React from 'react';

interface HospitalLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showTagline?: boolean;
  className?: string;
  variant?: 'full' | 'horizontal' | 'icon-only';
}

export const HospitalLogo: React.FC<HospitalLogoProps> = ({
  size = 'md',
  showTagline = true,
  className = '',
  variant = 'horizontal'
}) => {
  // Scaling factors
  const isSm = size === 'sm';
  const isMd = size === 'md';
  const isLg = size === 'lg';
  const isHero = size === 'hero';

  const iconDimension = isSm ? 32 : isMd ? 42 : isLg ? 56 : 72;

  // The distinctive Dr. Salim Hospital medical cross with parent-infant heart motif
  const CrossIcon = (
    <svg 
      width={iconDimension} 
      height={iconDimension} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-xs"
    >
      {/* Cyan-teal Medical Cross Base with soft rounded corners */}
      <rect x="32" y="5" width="36" height="90" rx="10" fill="#0093A8" />
      <rect x="5" y="32" width="90" height="36" rx="10" fill="#0093A8" />

      {/* Center Background Plate */}
      <rect x="32" y="32" width="36" height="36" fill="#0093A8" />

      {/* White Negative Space and Navy Mother-Child Heart Silhouette */}
      {/* Parent Figure Head */}
      <circle cx="58" cy="27" r="7" fill="#0A335C" />
      <path d="M52 25C54 22 62 22 64 25" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

      {/* Infant Head */}
      <circle cx="58" cy="46" r="5" fill="#0A335C" />

      {/* Mother Body curving around baby to form heart */}
      <path 
        d="M58 35C45 35 37 46 37 60C37 73 50 83 66 79C74 76 78 68 78 58C78 48 70 41 62 41" 
        stroke="#0A335C" 
        strokeWidth="9" 
        strokeLinecap="round" 
      />

      {/* Inner white highlight swirl */}
      <path 
        d="M45 52C42 59 44 68 50 72C56 76 64 74 68 68" 
        stroke="#FFFFFF" 
        strokeWidth="4" 
        strokeLinecap="round" 
      />

      {/* Baby Swaddle / Arm Hug Curve */}
      <path 
        d="M57 52C65 52 70 57 70 64C70 71 63 76 56 74" 
        fill="#0093A8" 
      />
      <path 
        d="M56 50C62 50 67 55 67 61C67 67 60 71 55 68" 
        stroke="#0A335C" 
        strokeWidth="4.5" 
        strokeLinecap="round" 
      />
    </svg>
  );

  if (variant === 'icon-only') {
    return <div className={`inline-flex items-center ${className}`}>{CrossIcon}</div>;
  }

  if (variant === 'horizontal') {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        {CrossIcon}
        <div className="flex flex-col justify-center text-left">
          <div className="flex items-baseline gap-1.5">
            <span className={`font-serif font-black tracking-tight text-[#0A335C] ${
              isSm ? 'text-base' : isMd ? 'text-lg' : isLg ? 'text-2xl' : 'text-3xl'
            }`} style={{ letterSpacing: '0.02em' }}>
              DR. SALIM
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-teal-100 text-teal-800 tracking-wide font-sans">
              2.0
            </span>
          </div>

          <span className={`font-sans font-extrabold uppercase text-[#008CA5] tracking-[0.28em] -mt-0.5 ${
            isSm ? 'text-[9px]' : isMd ? 'text-[11px]' : isLg ? 'text-sm' : 'text-base'
          }`}>
            HOSPITAL
          </span>

          {showTagline && !isSm && (
            <div className="flex items-center gap-1.5 mt-0.5 pt-0.5 border-t border-[#0A335C]/20">
              <span className="text-[8px] sm:text-[9px] font-semibold text-[#0A335C] tracking-wider uppercase whitespace-nowrap">
                COMPASSION · CARE · COMMUNITY
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full stacked badge version (great for landing page hero, splash screen, or modal headers)
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <div className="mb-2">
        {CrossIcon}
      </div>
      
      <div className="flex items-center justify-center gap-2">
        <h1 className="font-serif font-black tracking-tight text-[#0A335C] text-2xl sm:text-3xl md:text-4xl">
          DR. SALIM
        </h1>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-600 text-white font-sans tracking-wide">
          2.0
        </span>
      </div>

      <div className="font-sans font-extrabold uppercase text-[#008CA5] tracking-[0.38em] text-sm sm:text-base md:text-lg mt-0.5">
        HOSPITAL
      </div>

      {showTagline && (
        <div className="flex items-center gap-2 mt-2 pt-1 border-t border-[#0A335C]/20 w-full max-w-[260px] justify-center">
          <span className="text-[10px] sm:text-[11px] font-bold text-[#0A335C] tracking-widest uppercase">
            COMPASSION · CARE · COMMUNITY
          </span>
        </div>
      )}
    </div>
  );
};
