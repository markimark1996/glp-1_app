import { MealPlanItem } from '../types';
import { CircularProgress } from './CircularProgress';

interface MealPlanSummaryProps {
  mealPlanItems: MealPlanItem[];
}

export function MealPlanSummary({ mealPlanItems }: MealPlanSummaryProps) {
  const totalMeals = mealPlanItems.length;
  const maxMeals = 28;
  const progress = (totalMeals / maxMeals) * 100;

  const totalProtein = mealPlanItems.reduce((sum, item) => {
    return sum + (item.recipe.nutrition.protein * item.servings);
  }, 0);

  const totalFiber = mealPlanItems.reduce((sum, item) => {
    return sum + (item.recipe.nutrition.fiber * item.servings);
  }, 0);

  const avgDailyProtein = mealPlanItems.length > 0 ? Math.round(totalProtein / 7) : 0;
  const avgDailyFiber = mealPlanItems.length > 0 ? Math.round(totalFiber / 7) : 0;

  const dailyProteinTarget = 60;
  const dailyFiberTarget = 25;

  const weeklyProteinTarget = dailyProteinTarget * 7;
  const weeklyFiberTarget = dailyFiberTarget * 7;

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
            target={dailyProteinTarget}
            label="Average Daily Protein"
            unit="g"
            color="#6264A1"
          />
          <CircularProgress
            current={avgDailyFiber}
            target={dailyFiberTarget}
            label="Average Daily Fiber"
            unit="g"
            color="#E8A544"
          />
        </div>
      </div>

      <div className="bg-white border border-[#465E5A]/15 p-6">
        <h3 className="text-lg font-medium text-[#465E5A] mb-6">Weekly Nutrition Targets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
          <CircularProgress
            current={Math.round(totalProtein)}
            target={weeklyProteinTarget}
            label="Weekly Protein"
            unit="g"
            color="#6264A1"
            size={120}
            strokeWidth={8}
          />
          <CircularProgress
            current={Math.round(totalFiber)}
            target={weeklyFiberTarget}
            label="Weekly Fiber"
            unit="g"
            color="#E8A544"
            size={120}
            strokeWidth={8}
          />
        </div>
      </div>
    </div>
  );
}
