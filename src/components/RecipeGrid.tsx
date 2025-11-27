import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { RecipeCard } from './RecipeCard';
import { RecipeModal } from './RecipeModal';
import { RecipeFilters, FilterState } from './RecipeFilters';
import { RecipeSearch } from './RecipeSearch';
import { sampleRecipes } from '../data/sampleData';
import { Recipe, MealType } from '../types';
import { useFilteredRecipes } from '../hooks/useFilteredRecipes';
import { useHealthProfile } from '../contexts/HealthProfileContext';
import { useFavorites } from '../contexts/FavoritesContext';

interface RecipeGridProps {
  favoritesOnly?: boolean;
  dietaryFilter?: string | null;
  onClearDietaryFilter?: () => void;
  onAddToMealPlan?: (mealPlan: {
    recipeId: string;
    date: string;
    mealType: MealType;
    servings: number;
    notes: string;
  }) => void;
}

export function RecipeGrid({ favoritesOnly = false, dietaryFilter, onClearDietaryFilter, onAddToMealPlan }: RecipeGridProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    categories: [],
    mealTypes: [],
    difficulty: [],
    cookingTime: { min: 0, max: 180 },
    timePreset: null
  });

  const filters = [
    'GLP-1 Friendly',
    'High Protein',
    'High Fibre',
    'Quick',
    'Low Calorie',
    'Breakfast',
    'Lunch',
    'Dinner',
    'Snack'
  ];

  const { profile } = useHealthProfile();
  const { favorites: favoriteRecipes, toggleFavorite, isLoading: favoritesLoading } = useFavorites();
  const filteredRecipes = useFilteredRecipes(sampleRecipes, profile);

  const handleToggleFavorite = async (recipeId: string) => {
    await toggleFavorite(recipeId);
  };

  const handleAddToMealPlan = (mealPlan: {
    recipeId: string;
    date: string;
    mealType: MealType;
    servings: number;
    notes: string;
  }) => {
    console.log('RecipeGrid - handleAddToMealPlan called:', mealPlan);
    if (onAddToMealPlan) {
      console.log('RecipeGrid - Calling parent onAddToMealPlan');
      onAddToMealPlan(mealPlan);
    } else {
      console.log('RecipeGrid - onAddToMealPlan prop is not defined');
    }
  };

  const handleAddToShoppingList = (recipe: Recipe) => {
    console.log('Add to shopping list:', recipe);
  };

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const displayedRecipes = filteredRecipes
    .filter(recipe => {
      if (favoritesOnly) {
        return favoriteRecipes.has(String(recipe.id));
      }

      // Apply dietary filter from search
      if (dietaryFilter) {
        const filterLower = dietaryFilter.toLowerCase();
        let matches = false;

        if (filterLower.includes('vegetarian')) {
          matches = recipe.dietaryInfo.vegetarian;
        } else if (filterLower.includes('vegan')) {
          matches = recipe.dietaryInfo.vegan;
        } else if (filterLower.includes('gluten')) {
          matches = recipe.dietaryInfo.glutenFree;
        } else if (filterLower.includes('dairy')) {
          matches = recipe.dietaryInfo.dairyFree;
        } else if (filterLower.includes('low carb')) {
          matches = recipe.nutrition.carbs <= 20;
        }

        if (!matches) return false;
      }

      if (selectedFilters.length === 0) {
        return true;
      }

      return selectedFilters.every(filter => {
        switch (filter) {
          case 'GLP-1 Friendly':
            return recipe.healthScore >= 70;
          case 'High Protein':
            return recipe.nutrition.protein >= 15;
          case 'High Fibre':
            return recipe.nutrition.fiber >= 5;
          case 'Quick':
            return (recipe.prepTime + recipe.cookTime) <= 30;
          case 'Low Calorie':
            return recipe.nutrition.calories <= 400;
          case 'Breakfast':
          case 'Lunch':
          case 'Dinner':
          case 'Snack':
            return recipe.mealType.toLowerCase() === filter.toLowerCase();
          default:
            return true;
        }
      });
    })
    .sort((a, b) => {
      return b.healthScore - a.healthScore;
    });

  return (
    <section className="py-6">
      {/* Active Dietary Filter Badge */}
      {dietaryFilter && (
        <div className="mb-4 p-3 bg-[#E5F2E4] border border-[#6264A1]/20 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#465E5A]">
              Showing <span className="font-semibold">{dietaryFilter}</span> recipes
            </span>
          </div>
          <button
            onClick={() => onClearDietaryFilter?.()}
            className="flex items-center gap-1 text-sm text-[#6264A1] hover:text-[#465E5A] transition-colors"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[#465E5A]">
            {favoritesOnly ? 'Your Favourites' : 'Recommended for You'}
          </h2>
          <p className="text-[#465E5A]/70 text-sm mt-1">
            {favoritesOnly
              ? 'Recipes you loved'
              : 'Personalised meals to support your journey'
            }
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#465E5A]/15 hover:bg-[#E5F2E4] transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#465E5A]" />
          <span className="text-[#465E5A] text-sm hidden sm:inline">Filters</span>
          {selectedFilters.length > 0 && (
            <span className="px-2 py-0.5 bg-[#DDEFDC] text-[#465E5A] text-xs rounded-full">
              {selectedFilters.length}
            </span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="mb-6 p-4 bg-white border border-[#465E5A]/15">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-[#465E5A]">Filter by:</span>
            <button
              onClick={() => setSelectedFilters([])}
              className="text-xs text-[#6264A1] hover:text-[#465E5A]"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => toggleFilter(filter)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  selectedFilters.includes(filter)
                    ? 'bg-[#6264A1] text-white'
                    : 'bg-[#F4F6F7] text-[#465E5A] hover:bg-[#DDEFDC]'
                }`}
              >
                {filter}
                {selectedFilters.includes(filter) && (
                  <X className="w-3 h-3 inline-block ml-1" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {favoritesLoading && favoritesOnly ? (
        <div className="text-center py-12 bg-white border border-[#465E5A]/15">
          <p className="text-[#465E5A]/60">Loading your favourites...</p>
        </div>
      ) : displayedRecipes.length === 0 ? (
        <div className="text-center py-12 bg-white border border-[#465E5A]/15">
          <p className="text-[#465E5A]/60">{favoritesOnly ? 'No favourite recipes yet' : 'No recipes found'}</p>
          <p className="text-sm text-[#465E5A]/40 mt-1">{favoritesOnly ? 'Start favouriting recipes to see them here' : 'Try adjusting your filters'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedRecipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => setSelectedRecipe(recipe)}
              onAddToMealPlan={handleAddToMealPlan}
              isFavorite={favoriteRecipes.has(String(recipe.id))}
              onToggleFavorite={() => handleToggleFavorite(String(recipe.id))}
            />
          ))}
        </div>
      )}

      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          isOpen={true}
          onClose={() => setSelectedRecipe(null)}
          onAddToMealPlan={handleAddToMealPlan}
          isFavorite={favoriteRecipes.has(String(selectedRecipe.id))}
          onToggleFavorite={() => handleToggleFavorite(String(selectedRecipe.id))}
        />
      )}

      <RecipeFilters
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        onFilterChange={setActiveFilters}
      />

      <RecipeSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onResultSelect={(recipe) => {
          setSelectedRecipe(recipe);
          setIsSearchOpen(false);
        }}
      />
    </section>
  );
}
