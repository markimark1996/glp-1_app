import { Dialog, DialogContent, DialogTitle, DialogClose, DialogDescription } from "./ui/dialog";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Clock, Users, Heart, CalendarPlus, X, Award, Star } from "lucide-react";
import { Recipe, MealType } from "../types";
import { useState, useEffect } from "react";
import { AddToMealPlanModal } from "./AddToMealPlanModal";
import { useFavorites } from "../contexts/FavoritesContext";

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe | null;
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

export function RecipeModal({
  isOpen,
  onClose,
  recipe,
  isFavorite: initialFavorite = false,
  onToggleFavorite,
  onAddToMealPlan
}: RecipeModalProps) {
  const { favorites, toggleFavorite } = useFavorites();
  const [isAddedToMealPlan, setIsAddedToMealPlan] = useState(false);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'method'>('ingredients');
  const [isAddToMealPlanModalOpen, setIsAddToMealPlanModalOpen] = useState(false);

  if (!recipe) return null;

  const isFavorite = favorites.has(recipe.id);

  const getGlpConfig = () => {
    const healthScore = recipe.healthScore;
    if (healthScore >= 80) {
      return {
        level: 'HIGH',
        label: 'HIGH GLP-1 SUITABILITY',
        stars: 3,
        color: 'var(--glp-high-color)',
        bgColor: 'var(--glp-high-bg)',
        benefits: [
          `High protein ${recipe.nutrition.protein}g+`,
          'Perfect portions',
          'Gentle on digestion'
        ]
      };
    } else if (healthScore >= 60) {
      return {
        level: 'MEDIUM',
        label: 'MEDIUM GLP-1 SUITABILITY',
        stars: 2,
        color: 'var(--glp-moderate-color)',
        bgColor: 'var(--glp-moderate-bg)',
        benefits: [
          `Good protein ${recipe.nutrition.protein}g`,
          'Balanced portions',
          'Well-suited'
        ]
      };
    } else {
      return {
        level: 'MODERATE',
        label: 'MODERATE GLP-1 SUITABILITY',
        stars: 1,
        color: 'var(--glp-basic-color)',
        bgColor: 'var(--glp-basic-bg)',
        benefits: [
          'Moderate protein',
          'Adjust portions',
          'Customisable'
        ]
      };
    }
  };

  const glpConfig = getGlpConfig();
  const totalTime = recipe.prepTime + recipe.cookTime;

  const handleToggleFavorite = async () => {
    console.log('RecipeModal - Toggling favorite for recipe:', recipe.id);
    await toggleFavorite(recipe.id);
    if (onToggleFavorite) {
      onToggleFavorite();
    }
  };

  const handleAddToMealPlan = () => {
    setIsAddToMealPlanModalOpen(true);
  };

  const handleSaveMealPlan = (mealPlan: {
    recipeId: string;
    date: string;
    mealType: MealType;
    servings: number;
    notes: string;
  }) => {
    console.log('RecipeModal - handleSaveMealPlan called:', mealPlan);
    if (onAddToMealPlan) {
      console.log('RecipeModal - Calling onAddToMealPlan');
      onAddToMealPlan(mealPlan);
      setIsAddedToMealPlan(true);
      setIsAddToMealPlanModalOpen(false);
    } else {
      console.log('RecipeModal - onAddToMealPlan is not defined');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl w-full p-0 gap-0 overflow-hidden border-none bg-white max-h-[95vh] flex flex-col">
        <DialogTitle className="sr-only">{recipe.name}</DialogTitle>
        <DialogDescription className="sr-only">
          Detailed recipe view for {recipe.name}, including ingredients, nutritional information, and cooking instructions.
        </DialogDescription>

        {/* Fixed Close Button */}
        <DialogClose className="fixed top-4 right-4 z-50 w-12 h-12 bg-white hover:bg-gray-50 text-[#465E5A] flex items-center justify-center transition-all shadow-lg">
          <span className="sr-only">Close</span>
          <X className="w-6 h-6" />
        </DialogClose>

        {/* Scrollable Content */}
        <div className="overflow-y-auto">
          {/* Hero Image Section */}
          <div className="relative h-80 md:h-96 bg-[#EEEBE7] shrink-0">
            <ImageWithFallback
              src={recipe.imageUrl}
              alt={recipe.name}
              className="w-full h-full object-cover"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* GLP Badge - Top Left */}
            <div className="absolute top-6 left-6 z-10 bg-white px-4 py-3 shadow-md flex items-center gap-3">
              <div
                className="w-10 h-10 flex items-center justify-center"
                style={{ backgroundColor: glpConfig.color }}
              >
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold tracking-wide" style={{ color: glpConfig.color }}>
                  {glpConfig.label}
                </div>
                <div className="flex gap-0.5 mt-0.5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5"
                      style={{
                        fill: i < glpConfig.stars ? glpConfig.color : '#D1D5DB',
                        color: i < glpConfig.stars ? glpConfig.color : '#D1D5DB'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Title & Quick Meta Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
              <h2 className="text-white text-4xl md:text-5xl font-normal mb-4">
                {recipe.name}
              </h2>
              <div className="flex items-center gap-6 text-white flex-wrap">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{totalTime} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{recipe.servings} serving{recipe.servings > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  <span>{recipe.likes.toLocaleString()} saves</span>
                </div>
              </div>
            </div>
          </div>

          {/* Nutrition Stats Bar */}
          <div className="grid grid-cols-3 bg-white">
            <div className="px-6 py-6 border-r border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#E8EAF6] flex items-center justify-center">
                  <Award className="w-5 h-5 text-[#6264A1]" />
                </div>
                <span className="text-xs uppercase tracking-widest text-gray-500">Protein</span>
              </div>
              <p className="text-3xl font-normal text-[#465E5A]">{recipe.nutrition.protein}g</p>
            </div>
            <div className="px-6 py-6 border-r border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#E8EAF6] flex items-center justify-center">
                  <Award className="w-5 h-5 text-[#6264A1]" />
                </div>
                <span className="text-xs uppercase tracking-widest text-gray-500">Fibre</span>
              </div>
              <p className="text-3xl font-normal text-[#465E5A]">{recipe.nutrition.fiber}g</p>
            </div>
            <div className="px-6 py-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#E8EAF6] flex items-center justify-center">
                  <Award className="w-5 h-5 text-[#6264A1]" />
                </div>
                <span className="text-xs uppercase tracking-widest text-gray-500">Calories</span>
              </div>
              <p className="text-3xl font-normal text-[#465E5A]">{recipe.nutrition.calories}</p>
            </div>
          </div>

          {/* GLP Details Section */}
          <div
            className="px-8 py-6 border-l-4"
            style={{
              backgroundColor: glpConfig.bgColor,
              borderLeftColor: glpConfig.color
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: glpConfig.color }}
              >
                <Award className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-base font-bold tracking-wide" style={{ color: glpConfig.color }}>
                    {glpConfig.label}
                  </span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4"
                        style={{
                          fill: i < glpConfig.stars ? glpConfig.color : '#D1D5DB',
                          color: i < glpConfig.stars ? glpConfig.color : '#D1D5DB'
                        }}
                      />
                    ))}
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {glpConfig.benefits.map((benefit, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm"
                      style={{ color: glpConfig.color }}
                    >
                      <span className="mt-1">▪</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Dietary Attributes Section */}
          {recipe.dietaryAttributes && recipe.dietaryAttributes.length > 0 && (
            <div className="px-8 py-6 bg-white border-t border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-medium text-[#465E5A]/70 uppercase tracking-wider">Dietary Information</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recipe.dietaryAttributes.map((attribute, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-[#E5F2E4] text-[#465E5A] text-sm rounded-full border border-[#465E5A]/10 font-medium"
                  >
                    {attribute}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Nutrition Information */}
          {(recipe.nutrition.saturatedFat !== undefined || recipe.nutrition.sodium !== undefined) && (
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
              <h3 className="text-sm font-medium text-[#465E5A]/70 uppercase tracking-wider mb-4">Detailed Nutrition</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">Carbohydrates</div>
                  <div className="text-2xl font-normal text-[#465E5A]">{recipe.nutrition.carbs}g</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">Sugar</div>
                  <div className="text-2xl font-normal text-[#465E5A]">{recipe.nutrition.sugar}g</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">Total Fat</div>
                  <div className="text-2xl font-normal text-[#465E5A]">{recipe.nutrition.fat}g</div>
                </div>
                {recipe.nutrition.saturatedFat !== undefined && (
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Saturated Fat</div>
                    <div className="text-2xl font-normal text-[#465E5A]">{recipe.nutrition.saturatedFat}g</div>
                  </div>
                )}
                {recipe.nutrition.sodium !== undefined && (
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Sodium</div>
                    <div className="text-2xl font-normal text-[#465E5A]">{recipe.nutrition.sodium}mg</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="px-8 py-8 bg-white">
            {/* Tabs Navigation */}
            <div className="flex gap-0 mb-8 border-2 border-[#D1D5DB] overflow-hidden">
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`flex-1 py-4 px-6 transition-all text-base font-medium ${
                  activeTab === 'ingredients'
                    ? 'bg-white text-[#465E5A] border-b-4 border-[#6264A1]'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                Ingredients
              </button>
              <button
                onClick={() => setActiveTab('method')}
                className={`flex-1 py-4 px-6 transition-all text-base font-medium ${
                  activeTab === 'method'
                    ? 'bg-white text-[#465E5A] border-b-4 border-[#6264A1]'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                Method
              </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === 'ingredients' && (
                <div className="space-y-4">
                  {recipe.ingredients?.map((ingredient, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 text-[#465E5A]"
                    >
                      <div className="w-2 h-2 bg-[#6264A1] mt-2 flex-shrink-0" />
                      <span className="text-base leading-relaxed">
                        {ingredient.amount} {ingredient.unit} {ingredient.name}
                        {ingredient.notes && <span className="text-gray-500"> ({ingredient.notes})</span>}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'method' && (
                <div className="space-y-6">
                  {recipe.instructions?.map((instruction, idx) => (
                    <div key={idx} className="flex gap-5">
                      <div className="shrink-0 w-10 h-10 bg-[#6264A1] text-white flex items-center justify-center font-medium">
                        {instruction.step}
                      </div>
                      <div className="flex-1">
                        <p className="text-[#465E5A] leading-relaxed text-base pt-1.5">{instruction.text}</p>
                        {instruction.tips && instruction.tips.length > 0 && (
                          <div className="mt-3 text-sm text-gray-600 italic">
                            {instruction.tips.map((tip, tipIdx) => (
                              <div key={tipIdx} className="flex gap-2">
                                <span>💡</span>
                                <span>{tip}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-200 px-8 py-6 bg-white">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleAddToMealPlan}
                className={`py-4 px-6 border-2 transition-all font-medium ${
                  isAddedToMealPlan
                    ? 'bg-[#E5F2E4] border-[#465E5A] text-[#465E5A]'
                    : 'border-gray-300 text-[#465E5A] hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <CalendarPlus className="w-5 h-5" />
                  <span>{isAddedToMealPlan ? 'Added to Meal Plan' : 'Add to Meal Plan'}</span>
                </div>
              </button>
              <button
                onClick={handleToggleFavorite}
                className={`py-4 px-6 transition-all font-medium ${
                  isFavorite
                    ? 'bg-red-50 text-red-600 border-2 border-red-200'
                    : 'bg-[#6264A1] text-white hover:bg-[#4A5080]'
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  <span>{isFavorite ? 'Recipe Saved' : 'Save Recipe'}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </DialogContent>

      {isAddToMealPlanModalOpen && (
        <AddToMealPlanModal
          recipe={recipe}
          isOpen={isAddToMealPlanModalOpen}
          onClose={() => setIsAddToMealPlanModalOpen(false)}
          onSave={handleSaveMealPlan}
        />
      )}
    </Dialog>
  );
}
