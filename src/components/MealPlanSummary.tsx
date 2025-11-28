import { MealPlanItem } from '../types';

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

  const proteinStatus = avgDailyProtein >= 60 && avgDailyProtein <= 100 ? 'On target' : avgDailyProtein < 60 ? 'Below target' : 'Above target';
  const caloriesStatus = avgDailyCalories >= 1200 && avgDailyCalories <= 1800 ? 'On target' : avgDailyCalories < 1200 ? 'Below target' : 'Above target';

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white border border-[#465E5A]/15 p-4">
        <p className="text-sm text-[#465E5A]/70 mb-1">Planned Meals</p>
        <p className="text-2xl font-semibold text-[#465E5A]">
          {totalMeals} of {maxMeals}
        </p>
        <div className="w-full h-2 bg-[#EEEBE7] mt-2 overflow-hidden">
          <div
            className="h-full bg-[#6264A1] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="bg-white border border-[#465E5A]/15 p-4">
        <p className="text-sm text-[#465E5A]/70 mb-1">Avg. Daily Protein</p>
        <p className="text-2xl font-semibold text-[#465E5A]">{avgDailyProtein}g</p>
        <p className={`text-xs mt-1 ${
          proteinStatus === 'On target' ? 'text-[#6264A1]' : 'text-[#465E5A]/60'
        }`}>
          {proteinStatus}
        </p>
      </div>

      <div className="bg-white border border-[#465E5A]/15 p-4">
        <p className="text-sm text-[#465E5A]/70 mb-1">Avg. Daily Calories</p>
        <p className="text-2xl font-semibold text-[#465E5A]">{avgDailyCalories}</p>
        <p className={`text-xs mt-1 ${
          caloriesStatus === 'On target' ? 'text-[#6264A1]' : 'text-[#465E5A]/60'
        }`}>
          {caloriesStatus}
        </p>
      </div>
    </div>
  );
}
