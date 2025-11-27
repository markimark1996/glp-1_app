import React, { useState } from 'react';
import { X } from 'lucide-react';

export interface FilterState {
  categories: string[];
  mealTypes: string[];
  difficulty: string[];
  cookingTime: {
    min: number;
    max: number;
  };
  timePreset: string | null;
}

interface RecipeFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  'High Protein',
  'Low Carb',
  'Vegetarian',
  'Vegan',
  'Gluten Free',
  'Dairy Free',
];

const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

const difficultyLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
];

const timePresets = [
  { value: 'quick', label: 'Quick (<30 min)', min: 0, max: 30 },
  { value: 'medium', label: 'Medium (30-60 min)', min: 30, max: 60 },
  { value: 'long', label: 'Long (>60 min)', min: 60, max: 180 }
];

export function RecipeFilters({ onFilterChange, isOpen, onClose }: RecipeFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    mealTypes: [],
    difficulty: [],
    cookingTime: {
      min: 0,
      max: 180
    },
    timePreset: null
  });

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    const resetFilters: FilterState = {
      categories: [],
      mealTypes: [],
      difficulty: [],
      cookingTime: {
        min: 0,
        max: 180
      },
      timePreset: null
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const toggleCategory = (category: string) => {
    const updatedCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    handleFilterChange({ categories: updatedCategories });
  };

  const toggleMealType = (mealType: string) => {
    const updatedMealTypes = filters.mealTypes.includes(mealType)
      ? filters.mealTypes.filter(m => m !== mealType)
      : [...filters.mealTypes, mealType];
    handleFilterChange({ mealTypes: updatedMealTypes });
  };

  const toggleDifficulty = (difficulty: string) => {
    const updatedDifficulty = filters.difficulty.includes(difficulty)
      ? filters.difficulty.filter(d => d !== difficulty)
      : [...filters.difficulty, difficulty];
    handleFilterChange({ difficulty: updatedDifficulty });
  };

  const handleTimePresetChange = (preset: typeof timePresets[0]) => {
    handleFilterChange({
      timePreset: preset.value,
      cookingTime: {
        min: preset.min,
        max: preset.max
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-md my-8 flex flex-col max-h-[calc(100vh-4rem)]">
        {/* Header - Fixed */}
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-primary z-10">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-racing">Filter Recipes</h2>
              <button
                onClick={onClose}
                className="p-2 -m-2 text-racing-50 hover:text-racing rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* Categories */}
            <div>
              <h3 className="text-sm font-medium text-racing-75 mb-4">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      filters.categories.includes(category)
                        ? 'bg-racing text-white'
                        : 'bg-primary text-racing hover:bg-primary-75'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Meal Types */}
            <div>
              <h3 className="text-sm font-medium text-racing-75 mb-4">Meal Type</h3>
              <div className="flex flex-wrap gap-2">
                {mealTypes.map((mealType) => (
                  <button
                    key={mealType}
                    onClick={() => toggleMealType(mealType)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      filters.mealTypes.includes(mealType)
                        ? 'bg-racing text-white'
                        : 'bg-primary text-racing hover:bg-primary-75'
                    }`}
                  >
                    {mealType}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Level */}
            <div>
              <h3 className="text-sm font-medium text-racing-75 mb-4">Difficulty Level</h3>
              <div className="flex flex-wrap gap-2">
                {difficultyLevels.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => toggleDifficulty(value)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      filters.difficulty.includes(value)
                        ? 'bg-racing text-white'
                        : 'bg-primary text-racing hover:bg-primary-75'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cooking Time */}
            <div>
              <h3 className="text-sm font-medium text-racing-75 mb-4">Cooking Time</h3>
              <div className="flex flex-wrap gap-2">
                {timePresets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => handleTimePresetChange(preset)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      filters.timePreset === preset.value
                        ? 'bg-racing text-white'
                        : 'bg-primary text-racing hover:bg-primary-75'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="sticky bottom-0 bg-white rounded-b-2xl border-t border-primary">
          <div className="p-6">
            <div className="flex gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 px-4 py-2 border-2 border-racing text-racing rounded-lg hover:bg-racing-25 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-racing text-white rounded-lg hover:bg-racing-75 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}