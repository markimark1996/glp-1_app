import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Plus, Calendar, Share2, Printer, ShoppingBag } from 'lucide-react';
import { WeeklyMealPlan, MealType, Recipe } from '../types';
import { MealPlannerDay } from './MealPlannerDay';
import { ShareMealPlanModal } from './ShareMealPlanModal';
import { ShoppingListGenerator } from './ShoppingListGenerator';

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
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-primary">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-racing" />
                <h2 className="text-xl font-bold text-racing">Weekly Meal Plan</h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={onPrint}
                  className="p-2 text-racing-50 hover:text-racing rounded-lg transition-colors"
                  aria-label="Print meal plan"
                >
                  <Printer className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="p-2 text-racing-50 hover:text-racing rounded-lg transition-colors"
                  aria-label="Share meal plan"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowShoppingList(!showShoppingList)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-racing text-white rounded-lg hover:bg-racing-75 transition-colors"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>{showShoppingList ? 'Hide' : 'Show'} Shopping List</span>
                </button>
              </div>
            </div>
            
            <div className="text-sm text-racing-75">
              Week of {weekDays[0].date.toLocaleDateString('en-US', { 
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-primary">
            {/* Day Headers */}
            {weekDays.map(({ name, date }) => (
              <div key={name} className="p-4 bg-primary-25 font-medium text-racing">
                <div className="text-center">{name}</div>
                <div className="text-center text-sm text-racing-75">
                  {date.toLocaleDateString('en-US', { 
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
            ))}

            {/* Day Cells */}
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