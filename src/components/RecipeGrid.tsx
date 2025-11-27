import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
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

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const displayedRecipes = filteredRecipes.filter(recipe => {
    if (favoritesOnly) {
      return favoriteRecipes.has(recipe.id);
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
  });

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[#465E5A]">
            {favoritesOnly ? 'Your Favorites' : 'Recommended for You'}
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
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#465E5A]/15 rounded hover:bg-[#E5F2E4] transition-colors"
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
        <div className="mb-6 p-4 bg-white border border-[#465E5A]/15 rounded-lg">
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
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
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
