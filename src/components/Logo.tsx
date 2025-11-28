import React from 'react';

interface LogoProps {
  onClick?: () => void;
}

export function Logo({ onClick }: LogoProps) {
  return (
    <div className="flex items-center">
      <img
        src="/b02c349f-665a-4c33-8ac0-57ffad929725.png"
        alt="Spoon Guru Logo"
        className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
        onClick={onClick}
      />
    </div>
  );
}