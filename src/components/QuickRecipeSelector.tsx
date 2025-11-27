import React from 'react';
import { X, Clock, ChefHat } from 'lucide-react';
import { Recipe, MealType } from '../types';
import { sampleRecipes } from '../data/sampleData';

interface QuickRecipeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  mealType: MealType;
  onSelect: (recipe: Recipe) => void;
  onViewAllRecipes?: () => void;
}

export function QuickRecipeSelector({ 
  isOpen, 
  onClose, 
  mealType, 
  onSelect,
  onViewAllRecipes 
}: QuickRecipeSelectorProps) {
  if (!isOpen) return null;

  // Filter recipes based on meal type and preparation time
  const suggestions = sampleRecipes
    .filter(recipe => {
      const totalTime = recipe.prepTime + recipe.cookTime;
      const breakfastKeywords = ['pancake', 'smoothie', 'breakfast', 'yogurt', 'oat', 'toasted muffin'];
      const dessertKeywords = ['choco', 'granita', 'tiramisu', 'cheesecake'];
      
      const isBreakfast = breakfastKeywords.some(keyword => 
        recipe.name.toLowerCase().includes(keyword)
      );
      
      const isNotBreakfast = breakfastKeywords.every(keyword => 
        !recipe.name.toLowerCase().includes(keyword)
      );
      const isNotDessert = dessertKeywords.every(keyword => 
        !recipe.name.toLowerCase().includes(keyword)
      );
      
      const isLunch = isNotBreakfast && isNotDessert;
      
      switch (mealType) {
        case 'breakfast':
          return isBreakfast;
        case 'lunch':
          return totalTime>=20 && totalTime <= 45 && isLunch;
        case 'dinner':
          return isNotDessert && isNotBreakfast && totalTime>=30;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      // Sort by preparation time
      const aTime = a.prepTime + a.cookTime;
      const bTime = b.prepTime + b.cookTime;
      return aTime - bTime;
    })
    .slice(0, 6); // Show only 6 suggestions

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-racing capitalize">
              Quick {mealType} Suggestions
            </h2>
            <button
              onClick={onClose}
              className="p-2 -m-2 text-racing-50 hover:text-racing rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {suggestions.map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => onSelect(recipe)}
                className="flex gap-4 p-4 rounded-lg border-2 border-primary hover:border-racing text-left transition-all group"
              >
                <img
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-racing mb-1 line-clamp-2 group-hover:text-royal transition-colors">
                    {recipe.name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-racing-50">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{recipe.prepTime + recipe.cookTime} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ChefHat className="w-4 h-4" />
                      <span className="capitalize">{recipe.difficulty}</span>
                    </div>
                  </div>
                  {/* Dietary Info */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {recipe.dietaryInfo.vegetarian && (
                      <span className="px-2 py-0.5 bg-primary rounded-full text-xs text-racing">
                        Vegetarian
                      </span>
                    )}
                    {recipe.dietaryInfo.vegan && (
                      <span className="px-2 py-0.5 bg-primary rounded-full text-xs text-racing">
                        Vegan
                      </span>
                    )}
                    {recipe.dietaryInfo.glutenFree && (
                      <span className="px-2 py-0.5 bg-primary rounded-full text-xs text-racing">
                        GF
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {suggestions.length === 0 && (
            <div className="text-center py-8 text-racing-75">
              <p>No suggestions available for {mealType}</p>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={onViewAllRecipes}
              className="px-4 py-2 text-racing hover:text-royal transition-colors"
            >
              View all recipes →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}