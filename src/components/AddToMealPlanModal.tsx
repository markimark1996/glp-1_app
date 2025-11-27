import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, FileText, ChevronRight } from 'lucide-react';
import { Recipe, MealType } from '../types';

interface AddToMealPlanModalProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
  onSave: (mealPlan: {
    recipeId: string;
    date: string;
    mealType: MealType;
    servings: number;
    notes: string;
  }) => void;
  initialDate?: string;
  initialMealType?: MealType;
}

export function AddToMealPlanModal({ 
  recipe, 
  isOpen, 
  onClose, 
  onSave,
  initialDate,
  initialMealType 
}: AddToMealPlanModalProps) {
  const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [mealType, setMealType] = useState<MealType>(initialMealType || 'dinner');
  const [servings, setServings] = useState(recipe.servings);
  const [notes, setNotes] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Update state when initial values change
  useEffect(() => {
    if (initialDate) {
      setDate(initialDate);
    }
    if (initialMealType) {
      setMealType(initialMealType);
    }
  }, [initialDate, initialMealType]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      recipeId: recipe.id,
      date,
      mealType,
      servings,
      notes
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-md my-8">
        {/* Header - Fixed */}
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-primary z-10">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-racing">Add to Meal Plan</h2>
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
              {/* Recipe Preview */}
              <div className="flex items-center gap-4 p-4 bg-primary-25 rounded-lg">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-medium text-racing">{recipe.name}</h3>
                  <p className="text-sm text-racing-75">
                    {recipe.prepTime + recipe.cookTime} min • {recipe.difficulty}
                  </p>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-racing-75 mb-2">
                  <Calendar className="w-4 h-4 inline-block mr-2" />
                  Select Date
                </label>
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-primary focus:outline-none focus:ring-2 focus:ring-racing focus:border-racing"
                  required
                />
              </div>

              {/* Meal Type */}
              <div>
                <label className="block text-sm font-medium text-racing-75 mb-2">
                  <Clock className="w-4 h-4 inline-block mr-2" />
                  Meal Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['breakfast', 'lunch', 'dinner'] as MealType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setMealType(type)}
                      className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                        mealType === type
                          ? 'bg-racing text-white'
                          : 'bg-primary text-racing hover:bg-primary-75'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Servings */}
              <div>
                <label className="block text-sm font-medium text-racing-75 mb-2">
                  <Users className="w-4 h-4 inline-block mr-2" />
                  Servings
                </label>
                <input
                  type="number"
                  min="1"
                  value={servings}
                  onChange={(e) => setServings(parseInt(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border-2 border-primary focus:outline-none focus:ring-2 focus:ring-racing focus:border-racing"
                  required
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-racing-75 mb-2">
                  <FileText className="w-4 h-4 inline-block mr-2" />
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any preparation notes or modifications..."
                  className="w-full px-4 py-2 rounded-lg border-2 border-primary focus:outline-none focus:ring-2 focus:ring-racing focus:border-racing"
                  rows={3}
                />
              </div>

              {/* Preview Button */}
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="w-full px-4 py-2 bg-primary text-racing rounded-lg hover:bg-primary-75 transition-colors flex items-center justify-between"
              >
                <span>Preview Meal Plan</span>
                <ChevronRight className={`w-5 h-5 transition-transform ${showPreview ? 'rotate-90' : ''}`} />
              </button>

              {/* Meal Plan Preview */}
              {showPreview && (
                <div className="p-4 bg-primary-25 rounded-lg space-y-2">
                  <h4 className="font-medium text-racing">Upcoming Meals</h4>
                  <div className="text-sm text-racing-75">
                    <p>{formatDate(date)}</p>
                    <p className="capitalize">{mealType}: {recipe.name}</p>
                    <p>{servings} servings</p>
                  </div>
                </div>
              )}
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
                Add to Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}