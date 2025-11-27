import React, { useState, useEffect } from 'react';
import { Search, Filter, List, MessageCircle, Home, ScanLine, CalendarDays, ShoppingBag, Heart, ActivitySquare, Trophy, LogOut } from 'lucide-react';
import { RecipeCard } from './components/RecipeCard';
import { RecipeViewer } from './components/RecipeViewer';
import { ShoppingList } from './components/ShoppingList';
import { Logo } from './components/Logo';
import { HealthProfileModal } from './components/HealthProfileModal';
import { sampleRecipes } from './data/sampleData';
import { HealthProfile, Recipe, MealType, MealPlanItem, ProductInfo, ShoppingListItem } from './types';
import { RecipeFilters, FilterState } from './components/RecipeFilters';
import { WeeklyMealPlanner } from './components/WeeklyMealPlanner';
import { ProductScanner } from './components/ProductScanner';
import { RecipeSearch } from './components/RecipeSearch';
import { GoalsProvider } from './contexts/GoalsContext';
import { GoalsView } from './components/GoalsView';
import { useGoals } from './contexts/GoalsContext';
import { HealthProfileProvider } from './contexts/HealthProfileContext';
import { useHealthProfile } from './contexts/HealthProfileContext';
import { AuthModal } from './components/AuthModal';
import { ChatBot } from './components/ChatBot';
import { useFilteredRecipes } from './hooks/useFilteredRecipes';
import { supabase } from './lib/supabase';

function AppContent() {
  const [currentView, setCurrentView] = useState<'home' | 'shopping-list' | 'meal-plan' | 'favorites' | 'goals'>('home');
  const [isHealthProfileOpen, setIsHealthProfileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Set<string>>(new Set());
  const [user, setUser] = useState<any>(null);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    categories: [],
    mealTypes: [],
    difficulty: [],
    cookingTime: {
      min: 0,
      max: 180
    },
    timePreset: null
  });
  const [sortBy, setSortBy] = useState<'popular' | 'healthy' | 'recent' | 'promotions'>('popular');
  
  // Meal Plan State
  const [mealPlanItems, setMealPlanItems] = useState<MealPlanItem[]>([]);

  // Shopping List State
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);

  // Get goals context
  const { 
    goals, 
    achievements, 
    rewards, 
    points, 
    addGoal, 
    updateProgress,
    deleteGoal,
    shareAchievement, 
    claimReward 
  } = useGoals();

  // Get health profile context
  const { profile } = useHealthProfile();

  // Filter recipes based on health profile
  const filteredRecipes = useFilteredRecipes(sampleRecipes, profile);

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Listen for recipe search event
    const handleOpenRecipeSearch = () => {
      setIsSearchOpen(true);
    };

    document.addEventListener('open-recipe-search', handleOpenRecipeSearch);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('open-recipe-search', handleOpenRecipeSearch);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleSaveHealthProfile = (profile: Partial<HealthProfile>) => {
    console.log('Saving health profile:', profile);
  };

  const handleFilterChange = (filters: FilterState) => {
    setActiveFilters(filters);
    console.log('Filters updated:', filters);
  };

  const handleSortChange = () => {
    const sortOptions: Array<'popular' | 'healthy' | 'recent' | 'promotions'> = ['popular', 'healthy', 'recent', 'promotions'];
    const currentIndex = sortOptions.indexOf(sortBy);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    setSortBy(sortOptions[nextIndex]);
  };

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
    const recipe = sampleRecipes.find(r => r.id === mealPlan.recipeId);
    if (!recipe) return;

    const newMealPlanItem: MealPlanItem = {
      id: Date.now().toString(),
      recipe,
      date: new Date(mealPlan.date),
      mealType: mealPlan.mealType,
      servings: mealPlan.servings,
      notes: mealPlan.notes,
      dayOfWeek: new Date(mealPlan.date).getDay()
    };

    setMealPlanItems(prev => [...prev, newMealPlanItem]);
  };

  const handleAddToShoppingList = (recipe: Recipe, servings: number = recipe.servings) => {
    const newItems: ShoppingListItem[] = recipe.ingredients.map(ingredient => ({
      id: crypto.randomUUID(),
      name: ingredient.name,
      amount: (ingredient.amount * servings) / recipe.servings,
      unit: ingredient.unit,
      checked: false,
      category: 'other',
      productName: ingredient.product_name,
      price: ingredient.price,
      promoted: ingredient.promoted
    }));

    setShoppingList(prev => [...prev, ...newItems]);
    setCurrentView('shopping-list');
  };

  const handleMoveMeal = (fromDate: string, toDate: string, mealId: string) => {
    setMealPlanItems(prev => {
      const mealToMove = prev.find(item => item.id === mealId);
      if (!mealToMove) return prev;

      const updatedItems = prev.filter(item => item.id !== mealId);
      const newDate = new Date(toDate);
      
      return [...updatedItems, {
        ...mealToMove,
        date: newDate,
        dayOfWeek: newDate.getDay()
      }];
    });
  };

  const handleDeleteMeal = (mealId: string) => {
    setMealPlanItems(prev => prev.filter(item => item.id !== mealId));
  };

  const handleProductDetected = (product: ProductInfo) => {
    console.log('Product detected:', product);
  };

  const handleSearchResultSelect = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsSearchOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    // Implement sharing functionality
    console.log('Share meal plan');
  };

  // Filter and sort recipes
  const filteredAndSortedRecipes = filteredRecipes
    .filter(recipe => {
      // For favorites view, only show favorited recipes
      if (currentView === 'favorites') {
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
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.likes - a.likes;
        case 'healthy':
          return b.healthScore - a.healthScore;
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'promotions':
          const aPromotions = a.ingredients.filter(i => i.promoted).length;
          const bPromotions = b.ingredients.filter(i => i.promoted).length;
          return bPromotions - aPromotions;
        default:
          return 0;
      }
    });

  const weeklyMealPlan = {
    id: '1',
    weekStartDate: new Date().toISOString(),
    items: mealPlanItems
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'popular':
        return 'Most Popular';
      case 'healthy':
        return 'Healthiest';
      case 'recent':
        return 'Most Recent';
      case 'promotions':
        return 'Most Promotions';
      default:
        return 'Sort';
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F7] pb-20">
      {/* Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="z-40 fixed bottom-20 right-6 bg-[#6264A1] text-white p-4 rounded-full shadow-lg hover:bg-[#465E5A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#6264A1] focus:ring-offset-2"
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Bot */}
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {(currentView === 'home' || currentView === 'favorites') && (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8">
            <div className="flex items-center justify-between gap-4 mb-8">
              <Logo />
              <div className="flex items-center gap-4">
                {user ? (
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleSignOut}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#6264A1] text-white rounded-full shadow-md hover:bg-[#465E5A] active:bg-[#6264A1] focus:outline-none focus:ring-2 focus:ring-[#6264A1] focus:ring-offset-2 transition-all transform hover:scale-105 text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#6264A1] text-white rounded-full shadow-md hover:bg-[#465E5A] active:bg-[#6264A1] focus:outline-none focus:ring-2 focus:ring-[#6264A1] focus:ring-offset-2 transition-all transform hover:scale-105 text-sm"
                  >
                    Sign In
                  </button>
                )}
                <button
                  onClick={() => setIsHealthProfileOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#6264A1] text-white rounded-full shadow-md hover:bg-[#465E5A] active:bg-[#6264A1] focus:outline-none focus:ring-2 focus:ring-[#6264A1] focus:ring-offset-2 transition-all transform hover:scale-105 text-sm"
                  aria-label="Open My Health Profile"
                >
                  <ActivitySquare className="w-4 h-4" />
                  <span>My Health Profile</span>
                </button>
              </div>
            </div>
            
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex-1 relative"
              >
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#465E5A]/50 w-5 h-5" />
                <div className="w-full pl-12 pr-4 py-3 rounded-full bg-white border border-[#465E5A]/15 text-left text-[#465E5A]/50">
                  Search recipes and products...
                </div>
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsFiltersOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#6264A1] text-white hover:bg-[#465E5A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#6264A1] focus:ring-offset-2"
                aria-label="Filter recipes"
              >
                <Filter className="w-4 h-4" />
                <span className="font-medium">Filter</span>
              </button>
              <button
                onClick={handleSortChange}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#6264A1] text-white hover:bg-[#465E5A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#6264A1] focus:ring-offset-2"
                aria-label="Sort recipes"
              >
                <List className="w-4 h-4" />
                <span className="font-medium">{getSortLabel()}</span>
              </button>
            </div>
          </header>

          <main>
            {currentView === 'favorites' && filteredAndSortedRecipes.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-[#465E5A]/50 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-[#465E5A] mb-2">No Favorites Yet</h2>
                <p className="text-[#465E5A]/70">
                  Click the heart icon on any recipe to add it to your favorites
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedRecipes.map(recipe => (
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
          </main>
        </div>
      )}

      {currentView === 'shopping-list' && (
        <ShoppingList 
          mealPlanItems={mealPlanItems} 
          shoppingList={shoppingList} 
        />
      )}

      {currentView === 'meal-plan' && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <WeeklyMealPlanner
            mealPlan={weeklyMealPlan}
            onAddMeal={handleAddToMealPlan}
            onMoveMeal={handleMoveMeal}
            onDeleteMeal={handleDeleteMeal}
            onGenerateGroceryList={() => setCurrentView('shopping-list')}
            onPrint={handlePrint}
            onShare={handleShare}
          />
        </div>
      )}

      {currentView === 'goals' && (
        <GoalsView
          goals={goals}
          achievements={achievements}
          rewards={rewards}
          points={points}
          onAddGoal={addGoal}
          onUpdateProgress={updateProgress}
          onDeleteGoal={deleteGoal}
          onShareAchievement={shareAchievement}
          onClaimReward={claimReward}
        />
      )}

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <HealthProfileModal
        isOpen={isHealthProfileOpen}
        onClose={() => setIsHealthProfileOpen(false)}
        onSave={handleSaveHealthProfile}
      />

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
        onFilterChange={handleFilterChange}
      />

      <ProductScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onProductDetected={handleProductDetected}
      />

      <RecipeSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onResultSelect={handleSearchResultSelect}
      />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-[#465E5A]/15 z-40" aria-label="Main navigation">
        <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
          <button
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#6264A1] ${
              currentView === 'home' ? 'text-[#6264A1]' : 'text-[#465E5A]/50 hover:text-[#6264A1]'
            }`}
            onClick={() => setCurrentView('home')}
            aria-label="Home"
            aria-current={currentView === 'home' ? 'page' : undefined}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </button>

          <button
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#6264A1] ${
              currentView === 'meal-plan' ? 'text-[#6264A1]' : 'text-[#465E5A]/50 hover:text-[#6264A1]'
            }`}
            onClick={() => setCurrentView('meal-plan')}
            aria-label="Meal Plan"
            aria-current={currentView === 'meal-plan' ? 'page' : undefined}
          >
            <CalendarDays className="w-6 h-6" />
            <span className="text-xs font-medium">Meal Plan</span>
          </button>

          <button
            className="flex flex-col items-center justify-center -mt-6 bg-[#6264A1] text-white p-4 rounded-full shadow-lg hover:bg-[#465E5A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#6264A1] focus:ring-offset-2"
            onClick={() => setIsScannerOpen(true)}
            aria-label="Scan"
          >
            <ScanLine className="w-6 h-6" />
            <span className="text-xs font-medium mt-1">Scan</span>
          </button>

          <button
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#6264A1] ${
              currentView === 'shopping-list' ? 'text-[#6264A1]' : 'text-[#465E5A]/50 hover:text-[#6264A1]'
            }`}
            onClick={() => setCurrentView('shopping-list')}
            aria-label="Shopping List"
            aria-current={currentView === 'shopping-list' ? 'page' : undefined}
          >
            <ShoppingBag className="w-6 h-6" />
            <span className="text-xs font-medium">Shopping List</span>
          </button>

          <button
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#6264A1] ${
              currentView === 'favorites' ? 'text-[#6264A1]' : 'text-[#465E5A]/50 hover:text-[#6264A1]'
            }`}
            onClick={() => setCurrentView('favorites')}
            aria-label="Favorites"
            aria-current={currentView === 'favorites' ? 'page' : undefined}
          >
            <Heart className={`w-6 h-6 ${currentView === 'favorites' ? 'fill-current' : ''}`} />
            <span className="text-xs font-medium">Favorites</span>
          </button>

          <button
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#6264A1] ${
              currentView === 'goals' ? 'text-[#6264A1]' : 'text-[#465E5A]/50 hover:text-[#6264A1]'
            }`}
            onClick={() => setCurrentView('goals')}
            aria-label="Goals"
            aria-current={currentView === 'goals' ? 'page' : undefined}
          >
            <Trophy className="w-6 h-6" />
            <span className="text-xs font-medium">Goals</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

function App() {
  return (
    <HealthProfileProvider>
      <GoalsProvider>
        <AppContent />
      </GoalsProvider>
    </HealthProfileProvider>
  );
}

export default App;