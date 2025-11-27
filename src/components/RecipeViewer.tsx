import React, { useState } from 'react';
import { X, Clock, Users, ChefHat, Scale, Info, CalendarPlus, Heart, Apple, Percent, ShoppingBag, Star } from 'lucide-react';
import { Recipe, MealType } from '../types';
import { AddToMealPlanModal } from './AddToMealPlanModal';

interface RecipeViewerProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
  onAddToMealPlan?: (mealPlan: {
    recipeId: string;
    date: string;
    mealType: MealType;
    servings: number;
    notes: string;
  }) => void;
  onAddToShoppingList?: (recipe: Recipe, servings?: number) => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function RecipeViewer({
  recipe,
  isOpen,
  onClose,
  onAddToMealPlan,
  onAddToShoppingList,
  isFavorite = false,
  onToggleFavorite
}: RecipeViewerProps) {
  const [isAddToMealPlanOpen, setIsAddToMealPlanOpen] = useState(false);
  const [servings, setServings] = useState(recipe.servings);

  if (!isOpen) return null;

  const getGlpSuitability = () => {
    const healthScore = recipe.healthScore;
    if (healthScore >= 80) return { label: 'HIGH', level: 'high', stars: 3, color: '#2E7D32', bgColor: '#E8F5E9' };
    if (healthScore >= 60) return { label: 'MODERATE', level: 'moderate', stars: 2, color: '#558B2F', bgColor: '#F1F8E9' };
    return { label: 'BASIC', level: 'low', stars: 1, color: '#9E9D24', bgColor: '#F9FBE7' };
  };

  const suitability = getGlpSuitability();

  const handleAddToMealPlan = (mealPlan: {
    recipeId: string;
    date: string;
    mealType: MealType;
    servings: number;
    notes: string;
  }) => {
    if (onAddToMealPlan) {
      onAddToMealPlan(mealPlan);
    }
    setIsAddToMealPlanOpen(false);
  };

  const handleButtonClick = (e: React.MouseEvent, callback: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    callback();
  };

  const handleAddToShoppingList = () => {
    if (onAddToShoppingList) {
      onAddToShoppingList(recipe, servings);
    }
  };

  const formatPrice = (price: string) => {
    if (!price) return '';
    if (price.startsWith('$') || price.startsWith('£') || price.startsWith('€')) {
      return price;
    }
    return `£${price}`;
  };

  const sortedIngredients = [...recipe.ingredients].sort((a, b) => {
    if (a.promoted && !b.promoted) return -1;
    if (!a.promoted && b.promoted) return 1;
    return 0;
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl my-8" role="dialog" aria-modal="true">
        {/* Recipe Header with Image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-[#EEEBE7]">
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Header Actions */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {onToggleFavorite && (
              <button
                onClick={(e) => handleButtonClick(e, onToggleFavorite)}
                className="w-10 h-10 flex items-center justify-center bg-white/95 backdrop-blur-sm hover:bg-white transition-colors"
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-[#465E5A]'}`} />
              </button>
            )}
            <button
              onClick={(e) => handleButtonClick(e, onClose)}
              className="w-10 h-10 flex items-center justify-center bg-white/95 backdrop-blur-sm hover:bg-white transition-colors"
              aria-label="Close recipe viewer"
            >
              <X className="w-5 h-5 text-[#465E5A]" />
            </button>
          </div>

          {/* Recipe Title */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-sm">
                {recipe.cuisine}
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-sm capitalize">
                {recipe.difficulty}
              </span>
            </div>
            <h2 className="text-3xl font-semibold mb-2">{recipe.name}</h2>
            <p className="text-white/90 text-sm">{recipe.description}</p>
          </div>
        </div>

        <div className="p-6">
          {/* GLP-1 Suitability Badge */}
          <div className="mb-6">
            <div className="p-4 border-l-4" style={{
              backgroundColor: suitability.bgColor,
              borderLeftColor: suitability.color
            }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: suitability.color }}>
                  <span className="text-white text-lg font-bold">⚡</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold uppercase tracking-wide" style={{ color: suitability.color }}>
                      {suitability.label} GLP-1 SUITABILITY
                    </span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4"
                          style={{
                            fill: i < suitability.stars ? suitability.color : '#D1D5DB',
                            color: i < suitability.stars ? suitability.color : '#D1D5DB'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <ul className="text-xs space-y-1" style={{ color: suitability.color, opacity: 0.8 }}>
                    {recipe.dietaryInfo.highProtein && <li>• High protein {recipe.nutrition.protein}g+</li>}
                    {recipe.dietaryInfo.lowCarb && <li>• Perfect portions</li>}
                    <li>• Gentle on digestion</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-[#DDEFDC]/30 text-center">
              <Clock className="w-5 h-5 text-[#465E5A] mx-auto mb-1" />
              <div className="text-sm text-[#849491]">Time</div>
              <div className="font-semibold text-[#465E5A]">
                {recipe.prepTime + recipe.cookTime} min
              </div>
            </div>
            <div className="p-4 bg-[#E5F2E4]/50 text-center">
              <Users className="w-5 h-5 text-[#465E5A] mx-auto mb-1" />
              <div className="text-sm text-[#849491]">Servings</div>
              <input
                type="number"
                min="1"
                value={servings}
                onChange={(e) => setServings(parseInt(e.target.value, 10))}
                className="w-16 px-2 py-1 rounded border border-[#465E5A]/20 text-[#465E5A] font-semibold text-center mx-auto mt-1"
              />
            </div>
            <div className="p-4 bg-[#C5DFF2]/30 text-center">
              <Scale className="w-5 h-5 text-[#465E5A] mx-auto mb-1" />
              <div className="text-sm text-[#849491]">Calories</div>
              <div className="font-semibold text-[#465E5A]">
                {recipe.nutrition.calories}
              </div>
            </div>
            <div className="p-4 bg-[#F1F8E9] text-center">
              <ChefHat className="w-5 h-5 text-[#465E5A] mx-auto mb-1" />
              <div className="text-sm text-[#849491]">Difficulty</div>
              <div className="font-semibold text-[#465E5A] capitalize">
                {recipe.difficulty}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={handleAddToShoppingList}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#465E5A] text-white hover:bg-[#092923] transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Add to Shopping List</span>
            </button>
            <button
              onClick={() => setIsAddToMealPlanOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#6264A1] text-white hover:bg-[#2E3082] transition-colors"
            >
              <CalendarPlus className="w-5 h-5" />
              <span>Add to Meal Plan</span>
            </button>
          </div>

          {/* Dietary Tags */}
          {(recipe.dietaryInfo.vegetarian || recipe.dietaryInfo.vegan || recipe.dietaryInfo.glutenFree || recipe.dietaryInfo.dairyFree) && (
            <div className="flex flex-wrap gap-2 mb-8">
              {recipe.dietaryInfo.vegetarian && (
                <span className="px-3 py-1.5 bg-[#DDEFDC] text-[#465E5A] text-sm font-medium">
                  Vegetarian
                </span>
              )}
              {recipe.dietaryInfo.vegan && (
                <span className="px-3 py-1.5 bg-[#DDEFDC] text-[#465E5A] text-sm font-medium">
                  Vegan
                </span>
              )}
              {recipe.dietaryInfo.glutenFree && (
                <span className="px-3 py-1.5 bg-[#DDEFDC] text-[#465E5A] text-sm font-medium">
                  Gluten-Free
                </span>
              )}
              {recipe.dietaryInfo.dairyFree && (
                <span className="px-3 py-1.5 bg-[#DDEFDC] text-[#465E5A] text-sm font-medium">
                  Dairy-Free
                </span>
              )}
            </div>
          )}

          {/* Nutrition Panel */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-[#465E5A] mb-4">Nutrition Facts</h3>
            <div className="bg-[#F9FBE7] p-6">
              <div className="border-b-2 border-[#465E5A]/20 pb-4 mb-4">
                <div className="text-sm text-[#849491]">Per serving</div>
                <div className="text-3xl font-bold text-[#465E5A]">{recipe.nutrition.calories} cal</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 bg-[#DDEFDC]/30 text-center">
                  <div className="text-2xl font-bold text-[#465E5A]">{recipe.nutrition.protein}g</div>
                  <div className="text-xs text-[#849491]">Protein</div>
                </div>
                <div className="p-3 bg-[#E5F2E4]/50 text-center">
                  <div className="text-2xl font-bold text-[#465E5A]">{recipe.nutrition.fiber}g</div>
                  <div className="text-xs text-[#849491]">Fibre</div>
                </div>
                <div className="p-3 bg-[#C5DFF2]/30 text-center">
                  <div className="text-2xl font-bold text-[#465E5A]">{recipe.nutrition.carbs}g</div>
                  <div className="text-xs text-[#849491]">Carbs</div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="flex justify-between items-center p-2 border-b border-[#465E5A]/10">
                  <span className="text-sm text-[#465E5A]">Fat</span>
                  <span className="text-sm font-semibold text-[#465E5A]">{recipe.nutrition.fat}g</span>
                </div>
                <div className="flex justify-between items-center p-2 border-b border-[#465E5A]/10">
                  <span className="text-sm text-[#465E5A]">Sugar</span>
                  <span className="text-sm font-semibold text-[#465E5A]">{recipe.nutrition.sugar}g</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-[#465E5A] mb-4">Ingredients</h3>
            <ul className="space-y-2">
              {sortedIngredients.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 p-3 bg-[#F4F6F7] text-[#465E5A]"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#465E5A] mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">
                        {(ingredient.amount * servings) / recipe.servings} {ingredient.unit} {ingredient.name}
                      </span>
                      {ingredient.promoted && (
                        <div className="w-5 h-5 rounded-full bg-[#6264A1] flex items-center justify-center">
                          <Percent className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    {(ingredient.product_name || ingredient.price) && (
                      <div className="text-sm text-[#849491] mt-1">
                        {ingredient.product_name && (
                          <span>{ingredient.product_name}</span>
                        )}
                        {ingredient.price && (
                          <span className="ml-2 font-medium text-[#465E5A]">
                            {formatPrice(ingredient.price)}
                          </span>
                        )}
                      </div>
                    )}
                    {ingredient.notes && (
                      <p className="text-sm text-[#849491] mt-1">{ingredient.notes}</p>
                    )}
                    {ingredient.substitutes && ingredient.substitutes.length > 0 && (
                      <p className="text-sm text-[#849491] mt-1">
                        Substitute: {ingredient.substitutes.join(' or ')}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-[#465E5A] mb-4">Instructions</h3>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li
                  key={index}
                  className="flex gap-4 p-4 bg-[#F4F6F7]"
                >
                  <span className="flex-none w-8 h-8 flex items-center justify-center bg-[#465E5A] text-white font-semibold text-sm">
                    {instruction.step}
                  </span>
                  <div className="flex-1">
                    <p className="text-[#465E5A]">{instruction.text}</p>
                    {instruction.tips && instruction.tips.length > 0 && (
                      <div className="mt-3 p-3 bg-white border-l-2 border-[#6264A1]">
                        <div className="flex items-center gap-1.5 mb-2 text-[#6264A1]">
                          <Info className="w-4 h-4" />
                          <span className="font-semibold text-sm">Tips:</span>
                        </div>
                        <ul className="space-y-1 text-sm text-[#849491]">
                          {instruction.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-start gap-2">
                              <span className="text-[#6264A1]">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Variations */}
          {recipe.variations && recipe.variations.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-[#465E5A] mb-4">Variations</h3>
              <ul className="space-y-2">
                {recipe.variations.map((variation, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 p-3 bg-[#F4F6F7] text-[#465E5A]"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#6264A1] mt-2 flex-shrink-0" />
                    {variation}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tips for Success */}
          {recipe.tips && recipe.tips.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-[#465E5A] mb-4">Tips for Success</h3>
              <ul className="space-y-2">
                {recipe.tips.map((tip, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 p-3 bg-[#E8F5E9] text-[#465E5A]"
                  >
                    <Info className="w-5 h-5 text-[#2E7D32] flex-shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <AddToMealPlanModal
        recipe={recipe}
        isOpen={isAddToMealPlanOpen}
        onClose={() => setIsAddToMealPlanOpen(false)}
        onSave={handleAddToMealPlan}
      />
    </div>
  );
}
