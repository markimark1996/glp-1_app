import { WeeklyMealPlanner } from './WeeklyMealPlanner';
import { MealPlanItem, MealType } from '../types';

interface MealPlannerProps {
  mealPlanItems: MealPlanItem[];
  onMealPlanChange: (items: MealPlanItem[]) => void;
}

export function MealPlanner({ mealPlanItems, onMealPlanChange }: MealPlannerProps) {
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
    const mealToMove = mealPlanItems.find(item => item.id === mealId);
    if (!mealToMove) return;

    const updatedItems = mealPlanItems.filter(item => item.id !== mealId);
    const newDate = new Date(toDate);

    onMealPlanChange([...updatedItems, {
      ...mealToMove,
      date: newDate,
      dayOfWeek: newDate.getDay()
    }]);
  };

  const handleDeleteMeal = (mealId: string) => {
    onMealPlanChange(mealPlanItems.filter(item => item.id !== mealId));
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
