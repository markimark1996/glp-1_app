import React, { useState } from 'react';
import { Clock, Users, Heart, Star } from 'lucide-react';
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
  const hasHighProtein = recipe.dietaryInfo.highProtein;
  const hasHighFiber = recipe.dietaryInfo.highFibre;
  const healthScore = recipe.healthScore;

  const getGlpSuitability = () => {
    if (healthScore >= 80) return { label: 'HIGH', level: 'high', stars: 3 };
    if (healthScore >= 60) return { label: 'MODERATE', level: 'moderate', stars: 2 };
    return { label: 'LOW', level: 'low', stars: 1 };
  };

  const suitability = getGlpSuitability();

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
        className={`group bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 ${className}`}
        role="article"
        aria-label={`Recipe: ${recipe.name}`}
      >
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Top Left Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {/* GLP-1 Suitability Badge */}
            <div className="bg-white rounded-lg px-2.5 py-1.5 shadow-sm flex items-center gap-2">
              <div className="w-5 h-5 bg-[#4A7C59] rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">⚡</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[#2C4A3E] text-[10px] font-semibold leading-none">
                  {suitability.label}
                </span>
                <div className="flex gap-0.5 mt-0.5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-2.5 h-2.5 ${
                        i < suitability.stars
                          ? 'fill-[#4A7C59] text-[#4A7C59]'
                          : 'fill-gray-300 text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* High Protein Badge */}
            {hasHighProtein && (
              <div className="bg-[#5B5F97] text-white rounded-lg px-3 py-1 text-xs font-semibold shadow-sm">
                High Protein
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Recipe Name */}
          <h3 className="text-[#2C4A3E] text-base font-semibold mb-3 line-clamp-1">
            {recipe.name}
          </h3>

          {/* GLP-1 Suitability Details */}
          <div className={`mb-3 p-3 rounded-lg border-l-4 ${
            suitability.level === 'high'
              ? 'bg-[#E8F5E9] border-[#4A7C59]'
              : suitability.level === 'moderate'
              ? 'bg-[#FFF9E6] border-[#F59E0B]'
              : 'bg-[#FEE2E2] border-[#EF4444]'
          }`}>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-[#4A7C59] rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">⚡</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold uppercase ${
                    suitability.level === 'high'
                      ? 'text-[#4A7C59]'
                      : suitability.level === 'moderate'
                      ? 'text-[#F59E0B]'
                      : 'text-[#EF4444]'
                  }`}>
                    {suitability.label} GLP-1 SUITABILITY
                  </span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < suitability.stars
                            ? suitability.level === 'high'
                              ? 'fill-[#4A7C59] text-[#4A7C59]'
                              : suitability.level === 'moderate'
                              ? 'fill-[#F59E0B] text-[#F59E0B]'
                              : 'fill-[#EF4444] text-[#EF4444]'
                            : 'fill-gray-300 text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <ul className="text-[10px] text-[#2C4A3E] space-y-0.5">
                  {hasHighProtein && <li>• High protein {recipe.nutrition.protein}g+</li>}
                  {recipe.dietaryInfo.lowCarb && <li>• Perfect portions</li>}
                  <li>• Gentle on digestion</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Nutrition Stats */}
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="text-center">
              <div className="text-lg font-bold text-[#2C4A3E]">{recipe.nutrition.protein}g</div>
              <div className="text-[10px] text-[#6B7280]">Protein</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-[#2C4A3E]">{recipe.nutrition.fiber}g</div>
              <div className="text-[10px] text-[#6B7280]">Fibre</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-[#2C4A3E]">{recipe.nutrition.calories}</div>
              <div className="text-[10px] text-[#6B7280]">Cal</div>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-[#6B7280] mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{recipe.prepTime + recipe.cookTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{recipe.servings} serving{recipe.servings > 1 ? 's' : ''}</span>
            </div>
            <button
              onClick={(e) => handleButtonClick(e, onToggleFavorite || (() => {}))}
              className="flex items-center gap-1 hover:text-[#EF4444] transition-colors"
              aria-label={isFavorite ? `Remove ${recipe.name} from favorites` : `Add ${recipe.name} to favorites`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-[#EF4444] text-[#EF4444]' : ''}`} />
              <span>{recipe.likes?.toLocaleString() || 0}</span>
            </button>
          </div>

          {/* View Recipe Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onClick) onClick();
            }}
            className="w-full bg-[#5B5F97] hover:bg-[#4A4D7C] text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            View Recipe
          </button>
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
