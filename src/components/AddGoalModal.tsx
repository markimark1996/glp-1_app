import React, { useState, useEffect } from 'react';
import { X, Calendar, Droplet, Utensils } from 'lucide-react';
import { GoalCategory, GoalDuration } from '../types';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: {
    category: GoalCategory;
    title: string;
    description: string;
    target: number;
    unit: string;
    duration: GoalDuration;
    startDate: string;
    endDate: string;
    currentProgress: number;
    points: number;
  }) => void;
  category?: GoalCategory;
}

export function AddGoalModal({ isOpen, onClose, onSave, category: initialCategory = 'nutrition' }: AddGoalModalProps) {
  const [goalData, setGoalData] = useState({
    category: initialCategory,
    title: '',
    description: '',
    target: 0,
    unit: initialCategory === 'hydration' ? 'litres' : 'servings',
    duration: 'daily' as GoalDuration,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    currentProgress: 0,
    points: 100
  });

  // Update unit when category changes
  useEffect(() => {
    setGoalData(prev => ({
      ...prev,
      unit: prev.category === 'hydration' ? 'litres' : 'servings'
    }));
  }, [goalData.category]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(goalData);
  };

  const calculateEndDate = (startDate: string, duration: GoalDuration) => {
    const date = new Date(startDate);
    switch (duration) {
      case 'daily':
        date.setDate(date.getDate() + 1);
        break;
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'quarterly':
        date.setMonth(date.getMonth() + 3);
        break;
    }
    return date.toISOString().split('T')[0];
  };

  const handleStartDateChange = (date: string) => {
    setGoalData(prev => ({
      ...prev,
      startDate: date,
      endDate: calculateEndDate(date, prev.duration)
    }));
  };

  const handleDurationChange = (duration: GoalDuration) => {
    setGoalData(prev => ({
      ...prev,
      duration,
      endDate: calculateEndDate(prev.startDate, duration)
    }));
  };

  const getPlaceholderText = () => {
    return goalData.category === 'hydration' 
      ? 'Daily water intake'
      : 'Healthy meals per day';
  };

  const getStepValue = () => {
    return goalData.category === 'hydration' ? '0.1' : '1';
  };

  const getDefaultTarget = () => {
    return goalData.category === 'hydration' ? '2.5' : '3';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-md my-8">
        {/* Header - Fixed */}
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-primary z-10">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-racing">New Goal</h2>
              <button
                onClick={onClose}
                className="p-2 -m-2 text-racing-50 hover:text-racing rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="max-h-[calc(100vh-16rem)] overflow-y-auto">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-racing-75 mb-2">
                  Goal Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGoalData(prev => ({ ...prev, category: 'nutrition' }))}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                      goalData.category === 'nutrition'
                        ? 'bg-racing text-white'
                        : 'bg-primary text-racing hover:bg-primary-75'
                    }`}
                  >
                    <Utensils className="w-5 h-5" />
                    <span>Nutrition</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGoalData(prev => ({ ...prev, category: 'hydration' }))}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                      goalData.category === 'hydration'
                        ? 'bg-racing text-white'
                        : 'bg-primary text-racing hover:bg-primary-75'
                    }`}
                  >
                    <Droplet className="w-5 h-5" />
                    <span>Hydration</span>
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-racing-75 mb-2">
                  Goal Title
                </label>
                <input
                  type="text"
                  value={goalData.title}
                  onChange={e => setGoalData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={getPlaceholderText()}
                  className="w-full px-4 py-2 rounded-lg border-2 border-primary focus:outline-none focus:ring-2 focus:ring-racing focus:border-racing"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-racing-75 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={goalData.description}
                  onChange={e => setGoalData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border-2 border-primary focus:outline-none focus:ring-2 focus:ring-racing focus:border-racing"
                  rows={3}
                  placeholder={`Set a goal for your daily ${goalData.category === 'hydration' ? 'water intake' : 'nutrition'}`}
                />
              </div>

              {/* Target and Unit */}
              <div>
                <label className="block text-sm font-medium text-racing-75 mb-2">
                  Target Amount
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={goalData.target}
                    onChange={e => setGoalData(prev => ({ ...prev, target: Number(e.target.value) }))}
                    className="flex-1 px-4 py-2 rounded-lg border-2 border-primary focus:outline-none focus:ring-2 focus:ring-racing focus:border-racing"
                    required
                    min="0"
                    step={getStepValue()}
                    placeholder={getDefaultTarget()}
                  />
                  <input
                    type="text"
                    value={goalData.unit}
                    readOnly
                    className="w-24 px-4 py-2 rounded-lg border-2 border-primary bg-primary-25 text-racing-75"
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-racing-75 mb-2">
                  Duration
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['daily', 'weekly'] as GoalDuration[]).map(duration => (
                    <button
                      key={duration}
                      type="button"
                      onClick={() => handleDurationChange(duration)}
                      className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                        goalData.duration === duration
                          ? 'bg-racing text-white'
                          : 'bg-primary text-racing hover:bg-primary-75'
                      }`}
                    >
                      {duration}
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-racing-75 mb-2">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-racing-50 w-5 h-5" />
                  <input
                    type="date"
                    value={goalData.startDate}
                    onChange={e => handleStartDateChange(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-12 pr-4 py-2 rounded-lg border-2 border-primary focus:outline-none focus:ring-2 focus:ring-racing focus:border-racing"
                    required
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="sticky bottom-0 bg-white rounded-b-2xl border-t border-primary">
          <div className="p-6">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border-2 border-racing text-racing rounded-lg hover:bg-racing-25 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-racing text-white rounded-lg hover:bg-racing-75 transition-colors"
              >
                Create Goal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}