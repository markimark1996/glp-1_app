import { MealPlanItem } from '../types';
import { CircularProgress } from './CircularProgress';

interface MealPlanSummaryProps {
  mealPlanItems: MealPlanItem[];
}

export function MealPlanSummary({ mealPlanItems }: MealPlanSummaryProps) {
  const totalMeals = mealPlanItems.length;
  const maxMeals = 28;
  const progress = (totalMeals / maxMeals) * 100;

  const avgDailyProtein = mealPlanItems.length > 0
    ? Math.round(
        mealPlanItems.reduce((sum, item) => {
          return sum + (item.recipe.nutrition.protein * item.servings);
        }, 0) / 7
      )
    : 0;

  const avgDailyCalories = mealPlanItems.length > 0
    ? Math.round(
        mealPlanItems.reduce((sum, item) => {
          return sum + (item.recipe.nutrition.calories * item.servings);
        }, 0) / 7
      )
    : 0;

  const proteinTarget = 60;
  const caloriesTarget = 1000;

  return (
    <div className="mt-6 space-y-6">
      <div className="bg-white border border-[#465E5A]/15 p-6">
        <p className="text-sm text-[#465E5A]/70 mb-2">Planned Meals</p>
        <p className="text-2xl font-semibold text-[#465E5A] mb-3">
          {totalMeals} of {maxMeals}
        </p>
        <div className="w-full h-2 bg-[#EEEBE7] overflow-hidden">
          <div
            className="h-full bg-[#6264A1] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="bg-white border border-[#465E5A]/15 p-6">
        <h3 className="text-lg font-medium text-[#465E5A] mb-6">Daily Nutrition Targets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
          <CircularProgress
            current={avgDailyProtein}
            target={proteinTarget}
            label="Average Daily Protein"
            unit="g"
            color="#6264A1"
          />
          <CircularProgress
            current={avgDailyCalories}
            target={caloriesTarget}
            label="Average Daily Calories"
            unit=""
            color="#2D7A3E"
          />
        </div>
      </div>
    </div>
  );
}
