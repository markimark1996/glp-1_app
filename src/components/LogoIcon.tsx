import React from 'react';

interface LogoIconProps {
  className?: string;
}

export function LogoIcon({ className = "w-6 h-6" }: LogoIconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="48" fill="#2E3082" />
      <path
        d="M35 45 Q35 30 50 30 Q65 30 65 45 Q65 55 50 65 Q35 55 35 45"
        fill="#DDEFDC"
      />
      <circle cx="50" cy="42" r="8" fill="#2E3082" />
      <rect x="48" y="50" width="4" height="25" rx="2" fill="#092923" />
    </svg>
  );
}
