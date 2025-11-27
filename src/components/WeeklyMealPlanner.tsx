import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Plus, Calendar, Share2, Printer, ShoppingBag } from 'lucide-react';
import { WeeklyMealPlan, MealType, Recipe } from '../types';
import { MealPlannerDay } from './MealPlannerDay';
import { ShareMealPlanModal } from './ShareMealPlanModal';
import { ShoppingListGenerator } from './ShoppingListGenerator';
import { MealPlanSummary } from './MealPlanSummary';

interface WeeklyMealPlannerProps {
  mealPlan: WeeklyMealPlan;
  onAddMeal: (mealPlan: {
    recipeId: string;
    date: string;
    mealType: MealType;
    servings: number;
    notes: string;
  }) => void;
  onMoveMeal: (fromDate: string, toDate: string, mealId: string) => void;
  onDeleteMeal: (mealId: string) => void;
  onGenerateGroceryList: () => void;
  onPrint: () => void;
  onShare: () => void;
}

export function WeeklyMealPlanner({
  mealPlan,
  onAddMeal,
  onMoveMeal,
  onDeleteMeal,
  onGenerateGroceryList,
  onPrint,
  onShare
}: WeeklyMealPlannerProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showShoppingList, setShowShoppingList] = useState(false);

  // Get today's date and day of week (0-6)
  const today = new Date();
  const currentDayOfWeek = today.getDay();

  // Generate array of next 7 days starting from today
  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    return {
      name: new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date),
      date: date,
      dayOfWeek: (currentDayOfWeek + index) % 7,
      isoDate: date.toISOString().split('T')[0]
    };
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        <div className="bg-white border border-[#465E5A]/15 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-[#465E5A]/15">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-[#465E5A]">Weekly Meal Plan</h2>
                <p className="text-[#465E5A]/70 text-sm mt-1">Plan your meals ahead for better results</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={onPrint}
                  className="p-2 text-[#465E5A]/60 hover:text-[#6264A1] transition-colors"
                  aria-label="Print meal plan"
                >
                  <Printer className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="p-2 text-[#465E5A]/60 hover:text-[#6264A1] transition-colors"
                  aria-label="Share meal plan"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowShoppingList(!showShoppingList)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#6264A1] text-white hover:bg-[#465E5A] transition-colors"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span className="hidden sm:inline">{showShoppingList ? 'Hide' : 'Show'} Shopping List</span>
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-max">
              <div className="grid grid-cols-7 border-b border-[#465E5A]/15">
                {weekDays.map(({ name, date }) => (
                  <div key={name} className="p-4 text-center border-r last:border-r-0 border-[#465E5A]/15 bg-[#EEEBE7] min-w-[150px]">
                    <div className="text-[#465E5A] font-medium">{name}</div>
                    <div className="text-sm text-[#465E5A]/70 mt-1">
                      {date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7">
                {weekDays.map(({ dayOfWeek, isoDate }) => (
                  <MealPlannerDay
                    key={isoDate}
                    dayOfWeek={dayOfWeek}
                    date={isoDate}
                    meals={mealPlan.items.filter(item =>
                      new Date(item.date).toISOString().split('T')[0] === isoDate
                    )}
                    onAddMeal={onAddMeal}
                    onMoveMeal={onMoveMeal}
                    onDeleteMeal={onDeleteMeal}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Summary */}
        <MealPlanSummary mealPlanItems={mealPlan.items} />

        {/* Shopping List */}
        {showShoppingList && (
          <ShoppingListGenerator mealPlanItems={mealPlan.items} />
        )}
      </div>

      {/* Share Modal */}
      <ShareMealPlanModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        mealPlan={mealPlan}
      />
    </DndProvider>
  );
}