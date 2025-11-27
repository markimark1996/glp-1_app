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
    if (healthScore >= 80) return {
      label: 'HIGH',
      level: 'high',
      stars: 3,
      color: 'var(--glp-high-color)',
      bgColor: 'var(--glp-high-bg)'
    };
    if (healthScore >= 60) return {
      label: 'MEDIUM',
      level: 'medium',
      stars: 2,
      color: 'var(--glp-moderate-color)',
      bgColor: 'var(--glp-moderate-bg)'
    };
    return {
      label: 'MODERATE',
      level: 'moderate',
      stars: 1,
      color: 'var(--glp-basic-color)',
      bgColor: 'var(--glp-basic-bg)'
    };
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
        className={`group bg-white shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 flex flex-col h-full ${className}`}
        role="article"
        aria-label={`Recipe: ${recipe.name}`}
      >
        {/* Image Section */}
        <div
          className="relative h-48 overflow-hidden cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            if (onClick) onClick();
          }}
        >
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Top Left Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2 max-w-[calc(100%-1.5rem)]">
            {/* GLP-1 Suitability Badge */}
            <div className="bg-white/95 backdrop-blur-sm px-2.5 py-1.5 shadow-sm flex items-center gap-2 border-l-4" style={{ borderLeftColor: suitability.color }}>
              <div className="w-5 h-5 flex items-center justify-center" style={{ backgroundColor: suitability.color }}>
                <span className="text-white text-xs font-bold">⚡</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold leading-none" style={{ color: suitability.color }}>
                  {suitability.label}
                </span>
                <div className="flex gap-0.5 mt-0.5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-2.5 h-2.5"
                      style={{
                        fill: i < suitability.stars ? suitability.color : '#D1D5DB',
                        color: i < suitability.stars ? suitability.color : '#D1D5DB'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* High Protein Badge */}
            {hasHighProtein && (
              <div className="bg-[#465E5A] text-white px-2.5 py-1 text-xs">
                High Protein
              </div>
            )}

            {/* High Fibre Badge */}
            {hasHighFiber && (
              <div className="bg-[#465E5A] text-white px-2.5 py-1 text-xs">
                High Fibre
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-1">
          {/* Recipe Name */}
          <h3 className="text-[#465E5A] text-base font-semibold mb-3 line-clamp-1">
            {recipe.name}
          </h3>

          {/* GLP-1 Suitability Details */}
          <div className="mb-3 p-3 border-l-4" style={{
            backgroundColor: suitability.bgColor,
            borderLeftColor: suitability.color
          }}>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: suitability.color }}>
                <span className="text-white text-xs font-bold">⚡</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wide" style={{ color: suitability.color }}>
                    {suitability.label} GLP-1 SUITABILITY
                  </span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3"
                        style={{
                          fill: i < suitability.stars ? suitability.color : '#D1D5DB',
                          color: i < suitability.stars ? suitability.color : '#D1D5DB'
                        }}
                      />
                    ))}
                  </div>
                </div>
                <ul className="text-[10px] space-y-0.5" style={{ color: suitability.color, opacity: 0.8 }}>
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
              <div className="text-lg font-bold text-[#465E5A]">{recipe.nutrition.protein}g</div>
              <div className="text-[10px] text-[#849491]">Protein</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-[#465E5A]">{recipe.nutrition.fiber}g</div>
              <div className="text-[10px] text-[#849491]">Fibre</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-[#465E5A]">{recipe.nutrition.calories}</div>
              <div className="text-[10px] text-[#849491]">Cal</div>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-[#849491] mb-4">
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

          {/* Spacer to push button to bottom */}
          <div className="flex-1" />

          {/* View Recipe Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onClick) onClick();
            }}
            className="w-full bg-[#6264A1] hover:bg-[#2E3082] text-white py-2.5 text-sm font-semibold transition-colors"
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
