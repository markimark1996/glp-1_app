import React, { useState } from 'react';
import { X, Clock, Users, ChefHat, Scale, Info, PenTool as Tool, CalendarPlus, Heart, Apple, Percent, ShoppingBag } from 'lucide-react';
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
  
  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-green-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-orange-500';
  };
  
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

  // Format price to always show currency symbol
  const formatPrice = (price: string) => {
    if (!price) return '';
    if (price.startsWith('$') || price.startsWith('£') || price.startsWith('€')) {
      return price;
    }
    return `£${price}`;
  };

  // Sort ingredients to show promoted items first
  const sortedIngredients = [...recipe.ingredients].sort((a, b) => {
    if (a.promoted && !b.promoted) return -1;
    if (!a.promoted && b.promoted) return 1;
    return 0;
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl my-8" role="dialog" aria-modal="true">
        {/* Recipe Header */}
        <div className="relative h-64 rounded-t-2xl overflow-hidden">
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {onToggleFavorite && (
              <button
                onClick={(e) => handleButtonClick(e, onToggleFavorite)}
                className={`z-10 w-10 h-10 flex items-center justify-center backdrop-blur-sm rounded-full transition-colors ${
                  isFavorite 
                    ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            )}
            <button
              onClick={(e) => handleButtonClick(e, onClose)}
              className="z-10 w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
              aria-label="Close recipe viewer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm">
                {recipe.cuisine}
              </span>
              <span className={`px-2 py-1 rounded-full backdrop-blur-sm text-sm ${
                recipe.difficulty === 'beginner' ? 'bg-green-500/20' :
                recipe.difficulty === 'intermediate' ? 'bg-yellow-500/20' :
                'bg-red-500/20'
              }`}>
                {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-2">{recipe.name}</h2>
            <p className="text-white/90">{recipe.description}</p>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
            <div className="flex items-center gap-2 text-racing-75">
              <Apple className="w-5 h-5" />
              <div>
                <div className={`w-12 h-12 rounded-full ${getHealthScoreColor(recipe.healthScore)} flex items-center justify-center border-2 border-white shadow-lg`}>
                  <span className="text-white font-bold">{recipe.healthScore}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-racing-75">
              <Clock className="w-5 h-5" />
              <div>
                <div className="text-sm">Total Time</div>
                <div className="font-medium text-racing">
                  {recipe.prepTime + recipe.cookTime} min
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-racing-75">
              <Users className="w-5 h-5" />
              <div>
                <div className="text-sm">Servings</div> 
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={servings}
                    onChange={(e) => setServings(parseInt(e.target.value, 10))}
                    className="w-16 px-2 py-1 rounded border border-primary text-racing font-medium text-center"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-racing-75">
              <Scale className="w-5 h-5" />
              <div>
                <div className="text-sm">Calories</div>
                <div className="font-medium text-racing">
                  {recipe.nutrition.calories}/serving
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-racing-75">
              <ChefHat className="w-5 h-5" />
              <div>
                <div className="text-sm">Difficulty</div>
                <div className="font-medium text-racing capitalize">
                  {recipe.difficulty}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={handleAddToShoppingList}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-racing text-white rounded-xl hover:bg-racing-75 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Add to Shopping List</span>
            </button>
            <button
              onClick={() => setIsAddToMealPlanOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-racing text-white rounded-xl hover:bg-racing-75 transition-colors"
            >
              <CalendarPlus className="w-5 h-5" />
              <span>Add to Meal Plan</span>
            </button>
          </div>

          {/* Dietary Info */}
          <div className="flex flex-wrap gap-2 mb-8">
            {recipe.dietaryInfo.vegetarian && (
              <span className="px-3 py-1 rounded-full bg-primary text-racing text-sm">
                Vegetarian
              </span>
            )}
            {recipe.dietaryInfo.vegan && (
              <span className="px-3 py-1 rounded-full bg-primary text-racing text-sm">
                Vegan
              </span>
            )}
            {recipe.dietaryInfo.glutenFree && (
              <span className="px-3 py-1 rounded-full bg-primary text-racing text-sm">
                Gluten-Free
              </span>
            )}
            {recipe.dietaryInfo.dairyFree && (
              <span className="px-3 py-1 rounded-full bg-primary text-racing text-sm">
                Dairy-Free
              </span>
            )}
          </div>

          {/* Nutrition Panel */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-racing mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5" />
              Nutrition Facts
            </h3>
            <div className="bg-primary-25 rounded-xl p-6">
              <div className="border-b-2 border-racing pb-4 mb-4">
                <div className="text-sm text-racing-75">Per serving</div>
                <div className="text-2xl font-bold text-racing">{recipe.nutrition.calories} cal</div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* Macronutrients */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-racing">Protein</span>
                      <span className="text-racing-75">{recipe.nutrition.protein}g</span>
                    </div>
                    <div className="h-2 bg-primary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500" 
                        style={{ width: `${(recipe.nutrition.protein / 50) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-racing">Carbs</span>
                      <span className="text-racing-75">{recipe.nutrition.carbs}g</span>
                    </div>
                    <div className="h-2 bg-primary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500" 
                        style={{ width: `${(recipe.nutrition.carbs / 100) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-racing">Fat</span>
                      <span className="text-racing-75">{recipe.nutrition.fat}g</span>
                    </div>
                    <div className="h-2 bg-primary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-500" 
                        style={{ width: `${(recipe.nutrition.fat / 50) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {/* Other nutrients */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-racing">Fiber</span>
                      <span className="text-racing-75">{recipe.nutrition.fiber}g</span>
                    </div>
                    <div className="h-2 bg-primary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500" 
                        style={{ width: `${(recipe.nutrition.fiber / 25) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-racing">Sugar</span>
                      <span className="text-racing-75">{recipe.nutrition.sugar}g</span>
                    </div>
                    <div className="h-2 bg-primary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500" 
                        style={{ width: `${(recipe.nutrition.sugar / 25) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="pt-2 text-sm text-racing-75">
                    <div className="flex items-center gap-1">
                      <Info className="w-4 h-4" />
                      <span>Daily values based on a 2000 calorie diet</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-racing mb-4">Ingredients</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sortedIngredients.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 p-3 bg-primary-25 rounded-lg text-racing"
                >
                  <div className="w-2 h-2 rounded-full bg-racing mt-2" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {(ingredient.amount * servings) / recipe.servings} {ingredient.unit} {ingredient.name}
                      </span>
                      {ingredient.promoted && (
                        <div className="w-5 h-5 rounded-full bg-blue-800 flex items-center justify-center">
                          <Percent className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    {(ingredient.product_name || ingredient.price) && (
                      <div className="text-sm text-racing-75 mt-1">
                        {ingredient.product_name && (
                          <span>{ingredient.product_name}</span>
                        )}
                        {ingredient.price && (
                          <span className="ml-2 font-medium text-racing">
                            {formatPrice(ingredient.price)}
                          </span>
                        )}
                      </div>
                    )}
                    {ingredient.notes && (
                      <p className="text-sm text-racing-75">{ingredient.notes}</p>
                    )}
                    {ingredient.substitutes && ingredient.substitutes.length > 0 && (
                      <p className="text-sm text-racing-75">
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
            <h3 className="text-xl font-semibold text-racing mb-4">Instructions</h3>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li
                  key={index}
                  className="flex gap-4 p-4 bg-primary-25 rounded-lg"
                >
                  <span className="flex-none w-8 h-8 flex items-center justify-center rounded-full bg-racing text-white font-medium">
                    {instruction.step}
                  </span>
                  <div className="flex-1">
                    <p className="text-racing pt-1.5">{instruction.text}</p>
                    {instruction.tips && instruction.tips.length > 0 && (
                      <div className="mt-2 text-sm text-racing-75">
                        <div className="flex items-center gap-1 mb-1">
                          <Info className="w-4 h-4" />
                          <span className="font-medium">Tips:</span>
                        </div>
                        <ul className="list-disc list-inside pl-1 space-y-1">
                          {instruction.tips.map((tip, tipIndex) => (
                            <li key={tipIndex}>{tip}</li>
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
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-racing mb-4">Variations</h3>
            <ul className="space-y-2">
              {recipe.variations.map((variation, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 p-3 bg-primary-25 rounded-lg text-racing"
                >
                  <div className="w-2 h-2 rounded-full bg-racing" />
                  {variation}
                </li>
              ))}
            </ul>
          </div>

          {/* Tips for Success */}
          <div>
            <h3 className="text-xl font-semibold text-racing mb-4">Tips for Success</h3>
            <ul className="space-y-2">
              {recipe.tips.map((tip, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 p-3 bg-primary-25 rounded-lg text-racing"
                >
                  <Info className="w-5 h-5 text-racing-50" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
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