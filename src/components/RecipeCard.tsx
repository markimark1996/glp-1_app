import React, { useState } from 'react';
import { ThumbsUp, Heart, CalendarPlus } from 'lucide-react';
import { Recipe, MealType } from '../types';
import { AddToMealPlanModal } from './AddToMealPlanModal';

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  className?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onAddToMealPlan?: (mealPlan: {
    recipeId: string;
    date: string;
    mealType: MealType;
    servings: number;
    notes: string;
  }) => void;
}

export function RecipeCard({ 
  recipe, 
  onClick, 
  className = '', 
  isFavorite = false,
  onToggleFavorite,
  onAddToMealPlan 
}: RecipeCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const hasHighProtein = recipe.nutrition.protein >= 15;
  // const hasHighFiber = recipe.nutrition.fiber >= 5;
  const hasHighProtein = recipe.dietaryInfo.highProtein;
  const hasHighFiber = recipe.dietaryInfo.highFibre;

  const calculateHealthScore = () => {
    const proteinScore = (recipe.nutrition.protein || 0) * 2;
    const fiberScore = (recipe.nutrition.fiber || 0) * 4;
    return Math.min(100, Math.round(proteinScore + fiberScore)) || 0;
  };

  // const healthScore = calculateHealthScore();
  const healthScore=recipe.healthScore;

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-green-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const handleButtonClick = (e: React.MouseEvent, callback: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    callback();
  };

  const handleSaveMealPlan = (mealPlan: {
    recipeId: string;
    date: string;
    mealType: MealType;
    servings: number;
    notes: string;
  }) => {
    if (onAddToMealPlan) {
      onAddToMealPlan({
        ...mealPlan,
        recipeId: recipe.id
      });
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <div 
        className={`group bg-white rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 ${className}`}
        onClick={onClick}
        role="article"
        aria-label={`Recipe: ${recipe.name}`}
      >
        <div className="relative">
          <img 
            src={recipe.imageUrl} 
            alt={recipe.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div 
            className="absolute top-3 right-3 z-10"
            aria-label={`Health score: ${healthScore}`}
          >
            <div className={`w-12 h-12 rounded-full ${getHealthScoreColor(healthScore)} flex items-center justify-center border-2 border-white shadow-lg`}>
              <span className="text-white font-bold">{healthScore}</span>
            </div>
          </div>
          {(hasHighProtein || hasHighFiber) && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
              {hasHighProtein && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-racing text-sm font-medium shadow-sm">
                  🏋️ HIGH PROTEIN
                </span>
              )}
              {hasHighFiber && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-racing text-sm font-medium shadow-sm">
                  🌾 HIGH FIBER
                </span>
              )}
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-racing mb-4 group-hover:text-royal transition-colors">
            {recipe.name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center text-racing-50">
                <ThumbsUp className="w-4 h-4 mr-1" />
                <span>{recipe.likes}</span>
              </div>
              <button 
                className={`w-10 h-10 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-racing rounded-full ${
                  isFavorite ? 'text-red-500 hover:text-red-600' : 'text-racing-50 hover:text-racing'
                }`}
                aria-label={isFavorite ? `Remove ${recipe.name} from favorites` : `Add ${recipe.name} to favorites`}
                onClick={(e) => handleButtonClick(e, onToggleFavorite || (() => {}))}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
            <button
              onClick={(e) => handleButtonClick(e, () => setIsModalOpen(true))}
              className="w-10 h-10 flex items-center justify-center text-racing-50 hover:text-racing transition-colors focus:outline-none focus:ring-2 focus:ring-racing rounded-full"
              aria-label={`Add ${recipe.name} to meal plan`}
            >
              <CalendarPlus className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <AddToMealPlanModal
        recipe={recipe}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMealPlan}
      />
    </>
  );
}