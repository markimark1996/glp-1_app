import React from 'react';

export function Logo() {
  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold">
        <span className="text-royal">Spoon </span>
        <span className="text-royal">Guru</span>
        <span className="text-racing text-xs align-super">®</span>
      </h1>
      <p className="text-sm text-racing-75 mt-1">Your Nutrition Intelligence Companion app</p>
    </div>
  );
}