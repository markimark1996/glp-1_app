import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { Plus } from 'lucide-react';
import { MealPlanItem, MealType, Recipe } from '../types';
import { MealCard } from './MealCard';
import { QuickRecipeSelector } from './QuickRecipeSelector';
import { AddToMealPlanModal } from './AddToMealPlanModal';

interface MealPlannerDayProps {
  dayOfWeek: number;
  date: string;
  meals: MealPlanItem[];
  onAddMeal: (mealPlan: {
    recipeId: string;
    date: string;
    mealType: MealType;
    servings: number;
    notes: string;
  }) => void;
  onMoveMeal: (fromDate: string, toDate: string, mealId: string) => void;
  onDeleteMeal: (mealId: string) => void;
}

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner'];

export function MealPlannerDay({ 
  dayOfWeek, 
  date, 
  meals, 
  onAddMeal,
  onMoveMeal,
  onDeleteMeal
}: MealPlannerDayProps) {
  const [selectedMealType, setSelectedMealType] = useState<MealType | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isAddToMealPlanOpen, setIsAddToMealPlanOpen] = useState(false);
  const [isQuickSelectorOpen, setIsQuickSelectorOpen] = useState(false);

  const [{ isOver }, drop] = useDrop({
    accept: 'MEAL',
    drop: (item: { id: string; fromDate: string }) => {
      if (item.fromDate !== date) {
        onMoveMeal(item.fromDate, date, item.id);
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver()
    })
  });

  const handleMealTypeClick = (mealType: MealType) => {
    setSelectedMealType(mealType);
    setIsQuickSelectorOpen(true);
  };

  const handleRecipeSelect = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsQuickSelectorOpen(false);
    setIsAddToMealPlanOpen(true);
  };

  const handleSaveMealPlan = (mealPlan: {
    recipeId: string;
    date: string;
    mealType: MealType;
    servings: number;
    notes: string;
  }) => {
    onAddMeal({
      ...mealPlan,
      date: date,
      mealType: selectedMealType || mealPlan.mealType
    });
    setIsAddToMealPlanOpen(false);
    setSelectedRecipe(null);
    setSelectedMealType(null);
  };

  const handleCloseModal = () => {
    setIsAddToMealPlanOpen(false);
    setSelectedRecipe(null);
    setSelectedMealType(null);
  };

  const handleViewAllRecipes = () => {
    setIsQuickSelectorOpen(false);
    const event = new CustomEvent('open-recipe-search');
    document.dispatchEvent(event);
  };

  return (
    <>
      <div
        ref={drop}
        className={`p-4 min-h-[300px] border-r last:border-r-0 border-[#465E5A]/15 min-w-[150px] transition-colors ${
          isOver ? 'bg-[#E5F2E4]' : 'hover:bg-[#F4F6F7]'
        }`}
      >
        <div className="space-y-3">
          {MEAL_TYPES.map(mealType => {
            const meal = meals.find(m => m.mealType === mealType);

            return meal ? (
              <MealCard
                key={meal.id}
                meal={meal}
                fromDate={date}
                onDelete={() => onDeleteMeal(meal.id)}
              />
            ) : (
              <button
                key={mealType}
                onClick={() => handleMealTypeClick(mealType)}
                className="w-full p-2 border border-dashed border-[#465E5A]/30 hover:border-[#6264A1] hover:bg-[#DDEFDC]/30 text-[#465E5A]/60 hover:text-[#6264A1] transition-colors text-sm"
              >
                <div className="flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span className="capitalize">{mealType}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Recipe Selector */}
      <QuickRecipeSelector
        isOpen={isQuickSelectorOpen}
        onClose={() => setIsQuickSelectorOpen(false)}
        mealType={selectedMealType || 'breakfast'}
        onSelect={handleRecipeSelect}
        onViewAllRecipes={handleViewAllRecipes}
      />

      {/* Add to Meal Plan Modal */}
      {selectedRecipe && (
        <AddToMealPlanModal
          recipe={selectedRecipe}
          isOpen={isAddToMealPlanOpen}
          onClose={handleCloseModal}
          onSave={handleSaveMealPlan}
          initialDate={date}
          initialMealType={selectedMealType || undefined}
        />
      )}
    </>
  );
}