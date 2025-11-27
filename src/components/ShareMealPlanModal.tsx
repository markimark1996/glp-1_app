import React, { useState } from 'react';
import { X, Copy, Mail, Link } from 'lucide-react';
import { WeeklyMealPlan } from '../types';

interface ShareMealPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealPlan: WeeklyMealPlan;
}

export function ShareMealPlanModal({ isOpen, onClose, mealPlan }: ShareMealPlanModalProps) {
  const [shareUrl] = useState('https://example.com/share/abc123');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent('Check out my meal plan!');
    const body = encodeURIComponent(`Here's my meal plan for the week: ${shareUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-racing">Share Meal Plan</h2>
            <button
              onClick={onClose}
              className="p-2 -m-2 text-racing-50 hover:text-racing rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="w-full pl-4 pr-24 py-3 rounded-lg border-2 border-primary focus:outline-none focus:ring-2 focus:ring-racing focus:border-racing bg-primary-25"
              />
              <button
                onClick={handleCopyLink}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 rounded-md ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-racing text-white hover:bg-racing-75'
                } transition-colors`}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCopyLink}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-primary hover:border-racing text-racing transition-colors"
              >
                <Link className="w-5 h-5" />
                <span>Copy Link</span>
              </button>
              <button
                onClick={handleEmailShare}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-racing text-white hover:bg-racing-75 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>Email</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}