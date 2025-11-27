import { useState } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { RecipeCard } from './RecipeCard';
import { RecipeViewer } from './RecipeViewer';
import { RecipeFilters, FilterState } from './RecipeFilters';
import { RecipeSearch } from './RecipeSearch';
import { sampleRecipes } from '../data/sampleData';
import { Recipe, MealType } from '../types';
import { useFilteredRecipes } from '../hooks/useFilteredRecipes';
import { useHealthProfile } from '../contexts/HealthProfileContext';

interface RecipeGridProps {
  favoritesOnly?: boolean;
}

export function RecipeGrid({ favoritesOnly = false }: RecipeGridProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Set<string>>(new Set());
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    categories: [],
    mealTypes: [],
    difficulty: [],
    cookingTime: { min: 0, max: 180 },
    timePreset: null
  });

  const { profile } = useHealthProfile();
  const filteredRecipes = useFilteredRecipes(sampleRecipes, profile);

  const handleToggleFavorite = (recipeId: string) => {
    setFavoriteRecipes(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(recipeId)) {
        newFavorites.delete(recipeId);
      } else {
        newFavorites.add(recipeId);
      }
      return newFavorites;
    });
  };

  const handleAddToMealPlan = (mealPlan: {
    recipeId: string;
    date: string;
    mealType: MealType;
    servings: number;
    notes: string;
  }) => {
    console.log('Add to meal plan:', mealPlan);
  };

  const handleAddToShoppingList = (recipe: Recipe) => {
    console.log('Add to shopping list:', recipe);
  };

  const displayedRecipes = filteredRecipes.filter(recipe => {
    if (favoritesOnly) {
      return favoriteRecipes.has(recipe.id);
    }

    if (activeFilters.categories.length > 0) {
      const hasMatchingCategory = activeFilters.categories.some(category => {
        switch (category.toLowerCase()) {
          case 'high protein':
            return recipe.nutrition.protein >= 15;
          case 'vegetarian':
            return recipe.dietaryInfo.vegetarian;
          case 'vegan':
            return recipe.dietaryInfo.vegan;
          case 'gluten free':
            return recipe.dietaryInfo.glutenFree;
          case 'dairy free':
            return recipe.dietaryInfo.dairyFree;
          default:
            return false;
        }
      });
      if (!hasMatchingCategory) return false;
    }

    if (activeFilters.difficulty.length > 0) {
      if (!activeFilters.difficulty.includes(recipe.difficulty)) {
        return false;
      }
    }

    if (activeFilters.cookingTime.max) {
      if ((recipe.prepTime + recipe.cookTime) > activeFilters.cookingTime.max) {
        return false;
      }
    }

    return true;
  });

  return (
    <section className="py-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[#465E5A]">
              {favoritesOnly ? 'Your Favorites' : 'Discover Recipes'}
            </h2>
            <p className="text-[#465E5A]/70 text-sm mt-1">
              {favoritesOnly
                ? 'All your saved recipes in one place'
                : 'GLP-1 friendly meals tailored for you'
              }
            </p>
          </div>
        </div>

        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex-1 flex items-center gap-2 px-4 py-3 bg-white border border-[#465E5A]/15 rounded-lg text-left text-[#465E5A]/60 hover:border-[#6264A1] transition-colors"
          >
            <Search className="w-5 h-5" />
            <span>Search recipes...</span>
          </button>
          <button
            onClick={() => setIsFiltersOpen(true)}
            className="px-4 py-3 bg-[#6264A1] text-white rounded-lg hover:bg-[#465E5A] transition-colors flex items-center gap-2"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        {activeFilters.categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeFilters.categories.map(category => (
              <span
                key={category}
                className="inline-flex items-center gap-1 px-3 py-1 bg-[#9697C0]/20 text-[#6264A1] rounded-full text-sm"
              >
                {category}
              </span>
            ))}
          </div>
        )}
      </div>

      {displayedRecipes.length === 0 ? (
        <div className="text-center py-12 bg-white border border-[#465E5A]/15 rounded-lg">
          <p className="text-[#465E5A]/60">No recipes found</p>
          <p className="text-sm text-[#465E5A]/40 mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedRecipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => setSelectedRecipe(recipe)}
              onAddToMealPlan={handleAddToMealPlan}
              isFavorite={favoriteRecipes.has(recipe.id)}
              onToggleFavorite={() => handleToggleFavorite(recipe.id)}
            />
          ))}
        </div>
      )}

      {selectedRecipe && (
        <RecipeViewer
          recipe={selectedRecipe}
          isOpen={true}
          onClose={() => setSelectedRecipe(null)}
          onAddToMealPlan={handleAddToMealPlan}
          onAddToShoppingList={handleAddToShoppingList}
          isFavorite={favoriteRecipes.has(selectedRecipe.id)}
          onToggleFavorite={() => handleToggleFavorite(selectedRecipe.id)}
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
