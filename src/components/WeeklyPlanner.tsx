import React from 'react';
import { Pencil, Plus } from 'lucide-react';
import { MealPlan, Recipe } from '../types';

interface WeeklyPlannerProps {
  mealPlan: MealPlan[];
  selectedDate: { day: string; date: number };
  onDateSelect: (day: string, date: number) => void;
  onAddMeal: () => void;
}

export function WeeklyPlanner({ mealPlan, selectedDate, onDateSelect, onAddMeal }: WeeklyPlannerProps) {
  const renderMealItem = (meal: Recipe | undefined, servings: number) => {
    if (!meal) return null;
    return (
      <div className="flex items-center gap-4 py-3">
        <img 
          src={meal.imageUrl} 
          alt={meal.name}
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h4 className="font-medium text-racing">{meal.name}</h4>
          <p className="text-sm text-racing-50">{servings} serving</p>
        </div>
        <button className="text-racing-50 hover:text-racing">
          <Pencil className="w-4 h-4" />
        </button>
      </div>
    );
  };

  const dayPlan = mealPlan.find(d => d.day === selectedDate.day && d.date === selectedDate.date);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-racing">Meal Plan</h2>
        <button 
          onClick={onAddMeal}
          className="bg-royal text-white rounded-full p-2 hover:bg-royal-75"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Date Selector */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {mealPlan.map(({ day, date }) => (
          <button
            key={`${day}-${date}`}
            onClick={() => onDateSelect(day, date)}
            className={`flex flex-col items-center min-w-[60px] p-3 rounded-2xl transition-colors
              ${selectedDate.day === day && selectedDate.date === date
                ? 'bg-racing text-white'
                : 'hover:bg-primary text-racing-50 hover:text-racing'
              }`}
          >
            <span className="text-sm">{day}</span>
            <span className="text-xl font-semibold">{date}</span>
          </button>
        ))}
      </div>

      {/* Selected Day Plan */}
      <div className="space-y-6">
        <div>
          <h3 className="text-racing-50 font-medium mb-2">BREAKFAST</h3>
          {renderMealItem(dayPlan?.meals.breakfast, 8)}
        </div>
        <div>
          <h3 className="text-racing-50 font-medium mb-2">LUNCH</h3>
          {renderMealItem(dayPlan?.meals.lunch, 5)}
        </div>
        <div>
          <h3 className="text-racing-50 font-medium mb-2">DINNER</h3>
          {renderMealItem(dayPlan?.meals.dinner, 8)}
        </div>
      </div>
    </div>
  );
}