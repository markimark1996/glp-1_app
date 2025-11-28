import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Discover } from './components/Discover';
import { MealPlanner } from './components/MealPlanner';
import { Profile } from './components/Profile';
import { BottomNav } from './components/BottomNav';
import { RecipeGrid } from './components/RecipeGrid';
import { ChatBot } from './components/ChatBot';
import { ProductScanner } from './components/ProductScanner';
import { AuthModal } from './components/AuthModal';
import { RecipeModal } from './components/RecipeModal';
import { GoalsProvider } from './contexts/GoalsContext';
import { HealthProfileProvider } from './contexts/HealthProfileContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { MealPlanItem, Recipe } from './types';
import { sampleRecipes } from './data/sampleData';

type View = 'discover' | 'meal-plan' | 'scan' | 'favorites' | 'profile';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('discover');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [mealPlanItems, setMealPlanItems] = useState<MealPlanItem[]>([]);
  const [dietaryFilter, setDietaryFilter] = useState<string | null>(null);

  useEffect(() => {
    const handleShowAuthModal = () => {
      setIsAuthModalOpen(true);
    };

    window.addEventListener('show-auth-modal', handleShowAuthModal);
    return () => {
      window.removeEventListener('show-auth-modal', handleShowAuthModal);
    };
  }, []);

  const handleAddToMealPlan = (mealPlan: {
    recipeId: string;
    date: string;
    mealType: any;
    servings: number;
    notes: string;
  }) => {
    console.log('App - handleAddToMealPlan called:', mealPlan);
    const recipe = sampleRecipes.find((r: any) => r.id === mealPlan.recipeId);
    console.log('App - Found recipe:', recipe);
    if (!recipe) {
      console.log('App - Recipe not found!');
      return;
    }

    const selectedDate = new Date(mealPlan.date);
    const newMealItem = {
      id: crypto.randomUUID(),
      recipe,
      date: selectedDate,
      dayOfWeek: selectedDate.getDay(),
      mealType: mealPlan.mealType,
      servings: mealPlan.servings,
      notes: mealPlan.notes
    };

    console.log('App - Adding meal item:', newMealItem);
    setMealPlanItems(prev => {
      const updated = [...prev, newMealItem];
      console.log('App - Updated meal plan items:', updated);
      return updated;
    });
  };

  const handleViewChange = (view: View) => {
    if (view === 'scan') {
      setIsScannerOpen(true);
    } else {
      setCurrentView(view);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F7]">
      <Header
        onRecipeSelect={(recipe) => setSelectedRecipe(recipe)}
        onDietaryFilterSelect={(filter) => {
          setDietaryFilter(filter);
          setCurrentView('discover');
        }}
        onLogoClick={() => setCurrentView('discover')}
      />

      <main className="max-w-7xl mx-auto" style={{ paddingBottom: 'calc(6rem + env(safe-area-inset-bottom))' }}>
        {currentView === 'discover' && (
          <Discover
            dietaryFilter={dietaryFilter}
            onClearDietaryFilter={() => setDietaryFilter(null)}
            onAddToMealPlan={handleAddToMealPlan}
          />
        )}
        {currentView === 'meal-plan' && (
          <MealPlanner
            mealPlanItems={mealPlanItems}
            onMealPlanChange={setMealPlanItems}
          />
        )}
        {currentView === 'favorites' && <RecipeGrid favoritesOnly onAddToMealPlan={handleAddToMealPlan} />}
        {currentView === 'profile' && <Profile />}
      </main>

      <BottomNav
        currentView={currentView}
        onViewChange={handleViewChange}
        onOpenChat={() => setIsChatOpen(true)}
      />

      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <ProductScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onProductDetected={(product) => console.log('Product detected:', product)}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthModalOpen(false);
        }}
      />
      <RecipeModal
        recipe={selectedRecipe}
        isOpen={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        onAddToMealPlan={handleAddToMealPlan}
      />
    </div>
  );
}

function App() {
  return (
    <HealthProfileProvider>
      <GoalsProvider>
        <FavoritesProvider>
          <AppContent />
        </FavoritesProvider>
      </GoalsProvider>
    </HealthProfileProvider>
  );
}

export default App;
