import React from 'react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" fill="#6264A1"/>
          <path d="M12 10C12 10 14 8 16 8C18 8 20 10 20 10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <ellipse cx="16" cy="18" rx="6" ry="8" fill="white"/>
          <path d="M16 8L16 26" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="flex flex-col leading-tight">
        <div className="font-bold text-[#465E5A] text-lg">
          Spoon Guru
        </div>
      </div>
    </div>
  );
}