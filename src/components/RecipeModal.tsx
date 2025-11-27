import { Dialog, DialogContent, DialogTitle, DialogClose, DialogDescription } from "./ui/dialog";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Clock, Users, Heart, CalendarPlus, X, Dumbbell, Droplet, Flame } from "lucide-react";
import { GlpSuitabilityBadge, GlpSuitabilityLevel } from "./GlpSuitabilityBadge";
import { Recipe } from "../types";
import { useState } from "react";

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe | null;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onAddToMealPlan?: () => void;
}

export function RecipeModal({
  isOpen,
  onClose,
  recipe,
  isFavorite: initialFavorite = false,
  onToggleFavorite,
  onAddToMealPlan
}: RecipeModalProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isAddedToMealPlan, setIsAddedToMealPlan] = useState(false);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'method'>('ingredients');

  if (!recipe) return null;

  const getGlpSuitability = (): GlpSuitabilityLevel => {
    if (recipe.healthScore >= 80) return 3;
    if (recipe.healthScore >= 60) return 2;
    return 1;
  };

  const glpSuitability = getGlpSuitability();
  const totalTime = recipe.prepTime + recipe.cookTime;

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (onToggleFavorite) {
      onToggleFavorite();
    }
  };

  const handleAddToMealPlan = () => {
    setIsAddedToMealPlan(!isAddedToMealPlan);
    if (onAddToMealPlan && !isAddedToMealPlan) {
      onAddToMealPlan();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl p-0 gap-0 overflow-hidden border-none bg-white max-h-[95vh] flex flex-col">
        <DialogTitle className="sr-only">{recipe.name}</DialogTitle>
        <DialogDescription className="sr-only">
          Detailed recipe view for {recipe.name}, including ingredients, nutritional information, and cooking instructions.
        </DialogDescription>

        {/* Fixed Close Button */}
        <DialogClose className="fixed top-4 right-4 z-50 w-10 h-10 bg-white/95 hover:bg-white text-[#465E5A] flex items-center justify-center transition-all hover:scale-105 shadow-lg">
          <span className="sr-only">Close</span>
          <X className="w-5 h-5" />
        </DialogClose>

        {/* Scrollable Content */}
        <div className="overflow-y-auto">
          {/* Hero Image Section */}
          <div className="relative h-64 md:h-80 bg-[#EEEBE7] shrink-0">
            <ImageWithFallback
              src={recipe.imageUrl}
              alt={recipe.name}
              className="w-full h-full object-cover"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* GLP Badge - Prominent Position */}
            <div className="absolute top-6 left-6 z-10">
              <GlpSuitabilityBadge
                level={glpSuitability}
                variant="full"
                showDetails={false}
              />
            </div>

            {/* Title & Quick Meta Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
              <h2 className="text-white text-3xl md:text-4xl mb-4 tracking-tight">
                {recipe.name}
              </h2>
              <div className="flex items-center gap-4 md:gap-6 text-white/90 flex-wrap">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm">{totalTime} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span className="text-sm">{recipe.servings} serving{recipe.servings > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm">{recipe.likes.toLocaleString()} saves</span>
                </div>
              </div>
            </div>
          </div>

          {/* Nutrition Stats Bar */}
          <div className="grid grid-cols-3 gap-px bg-[#465E5A]/10">
            <div className="bg-white px-4 md:px-6 py-4 md:py-5">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="w-8 h-8 md:w-9 md:h-9 bg-[#6264A1]/10 flex items-center justify-center">
                  <Dumbbell className="w-4 h-4 md:w-5 md:h-5 text-[#6264A1]" />
                </div>
                <span className="text-xs uppercase tracking-widest text-[#465E5A]/60">Protein</span>
              </div>
              <p className="text-xl md:text-2xl text-[#465E5A] md:ml-12">{recipe.nutrition.protein}g</p>
            </div>
            <div className="bg-white px-4 md:px-6 py-4 md:py-5">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="w-8 h-8 md:w-9 md:h-9 bg-[#6264A1]/10 flex items-center justify-center">
                  <Droplet className="w-4 h-4 md:w-5 md:h-5 text-[#6264A1]" />
                </div>
                <span className="text-xs uppercase tracking-widest text-[#465E5A]/60">Fibre</span>
              </div>
              <p className="text-xl md:text-2xl text-[#465E5A] md:ml-12">{recipe.nutrition.fiber}g</p>
            </div>
            <div className="bg-white px-4 md:px-6 py-4 md:py-5">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="w-8 h-8 md:w-9 md:h-9 bg-[#6264A1]/10 flex items-center justify-center">
                  <Flame className="w-4 h-4 md:w-5 md:h-5 text-[#6264A1]" />
                </div>
                <span className="text-xs uppercase tracking-widest text-[#465E5A]/60">Calories</span>
              </div>
              <p className="text-xl md:text-2xl text-[#465E5A] md:ml-12">{recipe.nutrition.calories}</p>
            </div>
          </div>

          {/* GLP Details Section */}
          <div className="bg-gradient-to-br from-[#E5F2E4] to-[#DDEFDC] px-6 md:px-8 py-5 md:py-6 border-y border-[#465E5A]/5">
            <GlpSuitabilityBadge
              level={glpSuitability}
              variant="full"
              showDetails={true}
            />
          </div>

          {/* Main Content Area */}
          <div className="px-6 md:px-8 py-6 md:py-8">
            {/* Tabs Navigation */}
            <div className="flex gap-1 mb-6 md:mb-8 bg-[#F4F6F7] p-1">
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`flex-1 py-3 px-4 md:px-6 transition-all ${
                  activeTab === 'ingredients'
                    ? 'bg-white text-[#465E5A] shadow-sm'
                    : 'text-[#465E5A]/60 hover:text-[#465E5A]/80'
                }`}
              >
                Ingredients
              </button>
              <button
                onClick={() => setActiveTab('method')}
                className={`flex-1 py-3 px-4 md:px-6 transition-all ${
                  activeTab === 'method'
                    ? 'bg-white text-[#465E5A] shadow-sm'
                    : 'text-[#465E5A]/60 hover:text-[#465E5A]/80'
                }`}
              >
                Method
              </button>
            </div>

            {/* Tab Content */}
            <div className="mb-6">
              {activeTab === 'ingredients' && (
                <div className="space-y-2">
                  {recipe.ingredients?.map((ingredient, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 px-4 py-3 hover:bg-[#F4F6F7] transition-colors"
                    >
                      <div className="w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-[#6264A1]" />
                      </div>
                      <span className="text-[#465E5A] leading-relaxed">
                        {ingredient.amount} {ingredient.unit} {ingredient.name}
                        {ingredient.notes && <span className="text-[#465E5A]/60"> ({ingredient.notes})</span>}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'method' && (
                <div className="space-y-6">
                  {recipe.instructions?.map((instruction, idx) => (
                    <div key={idx} className="flex gap-4 md:gap-5">
                      <div className="shrink-0 w-10 h-10 bg-[#6264A1] text-white flex items-center justify-center">
                        <span className="text-lg">{instruction.step}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-[#465E5A] leading-relaxed pt-2">{instruction.text}</p>
                        {instruction.tips && instruction.tips.length > 0 && (
                          <div className="mt-2 text-sm text-[#465E5A]/70 italic">
                            {instruction.tips.map((tip, tipIdx) => (
                              <div key={tipIdx}>💡 {tip}</div>
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
          <div className="border-t border-[#465E5A]/10 px-6 md:px-8 py-6 bg-white sticky bottom-0">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <button
                onClick={handleAddToMealPlan}
                className={`py-3 md:py-4 px-4 md:px-6 border-2 transition-all ${
                  isAddedToMealPlan
                    ? 'bg-[#E5F2E4] border-[#465E5A] text-[#465E5A]'
                    : 'border-[#465E5A]/20 text-[#465E5A] hover:border-[#465E5A]/40 hover:bg-[#F4F6F7]'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <CalendarPlus className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">{isAddedToMealPlan ? 'Added to Plan' : 'Add to Meal Plan'}</span>
                </div>
              </button>
              <button
                onClick={handleToggleFavorite}
                className={`py-3 md:py-4 px-4 md:px-6 transition-all ${
                  isFavorite
                    ? 'bg-[#FFEAEA] text-red-600 border-2 border-red-200'
                    : 'bg-[#6264A1] text-white hover:bg-[#465E5A]'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Heart className={`w-4 h-4 md:w-5 md:h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  <span className="text-sm md:text-base">{isFavorite ? 'Recipe Saved' : 'Save Recipe'}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
