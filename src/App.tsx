import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RecipeGrid } from './components/RecipeGrid';
import { MealPlanner } from './components/MealPlanner';
import { Progress } from './components/Progress';
import { BottomNav } from './components/BottomNav';
import { Education } from './components/Education';
import { ChatBot } from './components/ChatBot';
import { ProfileManagement } from './components/ProfileManagement';
import { HealthProfileModal } from './components/HealthProfileModal';
import { ShoppingListModal } from './components/ShoppingListModal';
import { ProductScanner } from './components/ProductScanner';
import { AuthModal } from './components/AuthModal';
import { RecipeModal } from './components/RecipeModal';
import { GoalsProvider } from './contexts/GoalsContext';
import { HealthProfileProvider } from './contexts/HealthProfileContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { MealPlanItem, ShoppingListItem, Recipe } from './types';
import { sampleRecipes } from './data/sampleData';

type View = 'recipes' | 'products' | 'meal-plan' | 'scan' | 'education' | 'goals' | 'favorites';

function PlaceholderView({ title }: { title: string }) {
  return (
    <section className="py-6">
      <div className="mb-6">
        <h2 className="text-[#465E5A]">{title}</h2>
        <p className="text-[#465E5A]/70 text-sm mt-1">Coming soon</p>
      </div>
      <div className="bg-white border border-[#465E5A]/15 p-12 text-center rounded-lg">
        <p className="text-[#465E5A]/60">This section is under development</p>
      </div>
    </section>
  );
}

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('recipes');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isProfileManagementOpen, setIsProfileManagementOpen] = useState(false);
  const [isHealthProfileOpen, setIsHealthProfileOpen] = useState(false);
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [mealPlanItems, setMealPlanItems] = useState<MealPlanItem[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);

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
        onOpenHealthProfile={() => setIsHealthProfileOpen(true)}
        onOpenShoppingList={() => setIsShoppingListOpen(true)}
        onRecipeSelect={(recipe) => setSelectedRecipe(recipe)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingBottom: 'calc(6rem + env(safe-area-inset-bottom))' }}>
        {currentView === 'recipes' && <RecipeGrid onAddToMealPlan={handleAddToMealPlan} />}
        {currentView === 'products' && <PlaceholderView title="Products" />}
        {currentView === 'meal-plan' && (
          <MealPlanner
            mealPlanItems={mealPlanItems}
            onMealPlanChange={setMealPlanItems}
          />
        )}
        {currentView === 'education' && <Education />}
        {currentView === 'goals' && <Progress />}
        {currentView === 'favorites' && <RecipeGrid favoritesOnly onAddToMealPlan={handleAddToMealPlan} />}
      </main>

      <BottomNav
        currentView={currentView}
        onViewChange={handleViewChange}
        onOpenChat={() => setIsChatOpen(true)}
      />

      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <ProfileManagement
        isOpen={isProfileManagementOpen}
        onClose={() => setIsProfileManagementOpen(false)}
      />
      <HealthProfileModal
        isOpen={isHealthProfileOpen}
        onClose={() => setIsHealthProfileOpen(false)}
        onSave={() => setIsHealthProfileOpen(false)}
      />
      <ShoppingListModal
        isOpen={isShoppingListOpen}
        onClose={() => setIsShoppingListOpen(false)}
        mealPlanItems={mealPlanItems}
        shoppingList={shoppingList}
      />
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
