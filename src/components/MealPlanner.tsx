import { WeeklyMealPlanner } from './WeeklyMealPlanner';
import { useState } from 'react';
import { MealPlanItem, MealType } from '../types';

export function MealPlanner() {
  const [mealPlanItems, setMealPlanItems] = useState<MealPlanItem[]>([]);

  const handleAddMeal = (mealPlan: {
    recipeId: string;
    date: string;
    mealType: MealType;
    servings: number;
    notes: string;
  }) => {
    console.log('Add meal to plan:', mealPlan);
  };

  const handleMoveMeal = (fromDate: string, toDate: string, mealId: string) => {
    setMealPlanItems(prev => {
      const mealToMove = prev.find(item => item.id === mealId);
      if (!mealToMove) return prev;

      const updatedItems = prev.filter(item => item.id !== mealId);
      const newDate = new Date(toDate);

      return [...updatedItems, {
        ...mealToMove,
        date: newDate,
        dayOfWeek: newDate.getDay()
      }];
    });
  };

  const handleDeleteMeal = (mealId: string) => {
    setMealPlanItems(prev => prev.filter(item => item.id !== mealId));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    console.log('Share meal plan');
  };

  const weeklyMealPlan = {
    id: '1',
    weekStartDate: new Date().toISOString(),
    items: mealPlanItems
  };

  return (
    <WeeklyMealPlanner
      mealPlan={weeklyMealPlan}
      onAddMeal={handleAddMeal}
      onMoveMeal={handleMoveMeal}
      onDeleteMeal={handleDeleteMeal}
      onGenerateGroceryList={() => console.log('Generate grocery list')}
      onPrint={handlePrint}
      onShare={handleShare}
    />
  );
}
