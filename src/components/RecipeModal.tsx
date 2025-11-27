import { Dialog, DialogContent, DialogTitle, DialogClose, DialogDescription } from "./ui/dialog";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Clock, Users, Heart, CalendarPlus, X, Award, Star, Beef, Droplet, Scale } from "lucide-react";
import { Recipe, MealType } from "../types";
import { useState, useEffect } from "react";
import { AddToMealPlanModal } from "./AddToMealPlanModal";
import { useFavorites } from "../contexts/FavoritesContext";
import { calculateNutritionWithDV } from "../utils/nutritionCalculations";

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
  const [activeTab, setActiveTab] = useState<'ingredients' | 'method' | 'nutrition'>('ingredients');
  const [isAddToMealPlanModalOpen, setIsAddToMealPlanModalOpen] = useState(false);

  if (!recipe) return null;

  const isFavorite = favorites.has(String(recipe.id));
  const nutritionWithDV = calculateNutritionWithDV(recipe.nutrition);

  const getDietaryAttributes = () => {
    if (recipe.dietaryAttributes && recipe.dietaryAttributes.length > 0) {
      return recipe.dietaryAttributes;
    }

    const attributes: string[] = [];
    if (recipe.dietaryInfo.vegetarian) attributes.push('Vegetarian');
    if (recipe.dietaryInfo.vegan) attributes.push('Vegan');
    if (recipe.dietaryInfo.glutenFree) attributes.push('Gluten-Free');
    if (recipe.dietaryInfo.dairyFree) attributes.push('Dairy-Free');
    if (recipe.dietaryInfo.pescetarian) attributes.push('Pescetarian');
    if (recipe.dietaryInfo.highProtein) attributes.push('High Protein');
    if (recipe.dietaryInfo.highFibre) attributes.push('High Fibre');
    return attributes;
  };

  const dietaryAttributes = getDietaryAttributes();

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
    await toggleFavorite(String(recipe.id));
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
      <DialogContent className="w-full sm:max-w-6xl h-full sm:h-auto p-0 gap-0 overflow-hidden border-none bg-white sm:max-h-[95vh] flex flex-col sm:rounded-lg">
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
        <div className="overflow-y-auto flex-1" style={{ paddingBottom: 'calc(88px + env(safe-area-inset-bottom))' }}>
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
          {dietaryAttributes.length > 0 && (
            <div className="px-8 py-5 bg-white border-t border-gray-100">
              <div className="flex flex-wrap gap-2 overflow-x-auto">
                {dietaryAttributes.map((attribute, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-[#E5F2E4] text-[#465E5A] text-sm rounded-full border border-[#465E5A]/10 font-medium whitespace-nowrap"
                  >
                    {attribute}
                  </span>
                ))}
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
              <button
                onClick={() => setActiveTab('nutrition')}
                className={`flex-1 py-4 px-6 transition-all text-base font-medium ${
                  activeTab === 'nutrition'
                    ? 'bg-white text-[#465E5A] border-b-4 border-[#6264A1]'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                Nutrition Facts
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

              {activeTab === 'nutrition' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b-2 border-gray-200">
                    <h3 className="text-2xl font-normal text-[#465E5A]">Nutrition Facts</h3>
                    <span className="text-sm text-[#465E5A]/70">Per serving</span>
                  </div>

                  <div className="bg-[#F4F6F7] p-6">
                    <div className="text-sm text-[#465E5A]/70 mb-2">Calories</div>
                    <div className="text-5xl font-normal text-[#465E5A]">{nutritionWithDV.calories}</div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Beef className="w-4 h-4 text-[#6264A1]" />
                          <span className="text-[#465E5A] font-medium">Protein</span>
                        </div>
                        <span className="text-[#465E5A]">
                          {nutritionWithDV.protein}g
                          {nutritionWithDV.proteinDV && (
                            <span className="text-[#465E5A]/60 ml-2 text-sm">{nutritionWithDV.proteinDV}%</span>
                          )}
                        </span>
                      </div>
                      <div className="h-3 bg-[#F4F6F7] overflow-hidden">
                        <div
                          className="h-full bg-[#6264A1] transition-all"
                          style={{ width: `${Math.min((nutritionWithDV.proteinDV || 0), 100)}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[#465E5A] font-medium">Carbohydrates</span>
                        <span className="text-[#465E5A]">
                          {nutritionWithDV.carbs}g
                          {nutritionWithDV.carbsDV && (
                            <span className="text-[#465E5A]/60 ml-2 text-sm">{nutritionWithDV.carbsDV}%</span>
                          )}
                        </span>
                      </div>
                      <div className="h-3 bg-[#F4F6F7] overflow-hidden">
                        <div
                          className="h-full bg-[#B2D4EE] transition-all"
                          style={{ width: `${Math.min((nutritionWithDV.carbsDV || 0), 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="pl-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[#465E5A]/80 text-sm">of which sugars</span>
                        <span className="text-[#465E5A] text-sm">
                          {nutritionWithDV.sugar}g
                          {nutritionWithDV.sugarDV && (
                            <span className="text-[#465E5A]/60 ml-2">{nutritionWithDV.sugarDV}%</span>
                          )}
                        </span>
                      </div>
                      <div className="h-2 bg-[#F4F6F7] overflow-hidden">
                        <div
                          className="h-full bg-[#C5DFF2] transition-all"
                          style={{ width: `${Math.min((nutritionWithDV.sugarDV || 0), 100)}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Droplet className="w-4 h-4 text-[#6264A1]" />
                          <span className="text-[#465E5A] font-medium">Fibre</span>
                        </div>
                        <span className="text-[#465E5A]">
                          {nutritionWithDV.fiber}g
                          {nutritionWithDV.fiberDV && (
                            <span className="text-[#465E5A]/60 ml-2 text-sm">{nutritionWithDV.fiberDV}%</span>
                          )}
                        </span>
                      </div>
                      <div className="h-3 bg-[#F4F6F7] overflow-hidden">
                        <div
                          className="h-full bg-[#DDEFDC] transition-all"
                          style={{ width: `${Math.min((nutritionWithDV.fiberDV || 0), 100)}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[#465E5A] font-medium">Fat</span>
                        <span className="text-[#465E5A]">
                          {nutritionWithDV.fat}g
                          {nutritionWithDV.fatDV && (
                            <span className="text-[#465E5A]/60 ml-2 text-sm">{nutritionWithDV.fatDV}%</span>
                          )}
                        </span>
                      </div>
                      <div className="h-3 bg-[#F4F6F7] overflow-hidden">
                        <div
                          className="h-full bg-[#9697C0] transition-all"
                          style={{ width: `${Math.min((nutritionWithDV.fatDV || 0), 100)}%` }}
                        />
                      </div>
                    </div>

                    {nutritionWithDV.saturatedFat !== undefined && (
                      <div className="pl-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[#465E5A]/80 text-sm">of which saturates</span>
                          <span className="text-[#465E5A] text-sm">
                            {nutritionWithDV.saturatedFat}g
                            {nutritionWithDV.saturatedFatDV && (
                              <span className="text-[#465E5A]/60 ml-2">{nutritionWithDV.saturatedFatDV}%</span>
                            )}
                          </span>
                        </div>
                        <div className="h-2 bg-[#F4F6F7] overflow-hidden">
                          <div
                            className="h-full bg-[#B2D4EE] transition-all"
                            style={{ width: `${Math.min((nutritionWithDV.saturatedFatDV || 0), 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {nutritionWithDV.sodium !== undefined && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[#465E5A] font-medium">Sodium</span>
                          <span className="text-[#465E5A]">
                            {nutritionWithDV.sodium}mg
                            {nutritionWithDV.sodiumDV && (
                              <span className="text-[#465E5A]/60 ml-2 text-sm">{nutritionWithDV.sodiumDV}%</span>
                            )}
                          </span>
                        </div>
                        <div className="h-3 bg-[#F4F6F7] overflow-hidden">
                          <div
                            className="h-full bg-[#E3DBD1] transition-all"
                            style={{ width: `${Math.min((nutritionWithDV.sodiumDV || 0), 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-[#F4F6F7] text-sm text-[#465E5A]/70">
                    <Scale className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p>
                      * Daily values are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your calorie needs.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fixed Footer Actions */}
        <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 px-4 sm:px-8 py-4 sm:py-6 bg-white z-40 sm:relative" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-6xl mx-auto">
            <button
              onClick={handleAddToMealPlan}
              className={`py-3 sm:py-4 px-3 sm:px-6 border-2 transition-all font-medium text-sm sm:text-base ${
                isAddedToMealPlan
                  ? 'bg-[#E5F2E4] border-[#465E5A] text-[#465E5A]'
                  : 'border-gray-300 text-[#465E5A] hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3">
                <CalendarPlus className="w-5 h-5 flex-shrink-0" />
                <span className="text-xs sm:text-base leading-tight text-center">
                  {isAddedToMealPlan ? 'Added to Plan' : 'Add to Plan'}
                </span>
              </div>
            </button>
            <button
              onClick={handleToggleFavorite}
              className={`py-3 sm:py-4 px-3 sm:px-6 transition-all font-medium text-sm sm:text-base ${
                isFavorite
                  ? 'bg-red-50 text-red-600 border-2 border-red-200'
                  : 'bg-[#6264A1] text-white hover:bg-[#4A5080]'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3">
                <Heart className={`w-5 h-5 flex-shrink-0 ${isFavorite ? 'fill-current' : ''}`} />
                <span className="text-xs sm:text-base leading-tight text-center">
                  {isFavorite ? 'Saved' : 'Save Recipe'}
                </span>
              </div>
            </button>
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
