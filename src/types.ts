import { DivideIcon as LucideIcon } from 'lucide-react';

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
  prepTime: number;
  cookTime: number;
  servings: number;
  imageUrl: string;
  likes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  cuisine: string;
  dietaryInfo: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
    pescetarian: boolean;
    highProtein: boolean;
    highFibre: boolean;
  };
  dietaryAttributes?: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    saturatedFat?: number;
    sodium?: number;
    proteinDV?: number;
    carbsDV?: number;
    fiberDV?: number;
    fatDV?: number;
    saturatedFatDV?: number;
    sodiumDV?: number;
    sugarDV?: number;
  };
  storage: {
    instructions: string;
    shelfLife: string;
    reheating: string;
  };
  equipment: string[];
  tips: string[];
  variations: string[];
  createdAt: string;
  updatedAt: string;
  healthScore: number;
}

export interface RecipeIngredient {
  name: string;
  amount: number;
  unit: string;
  notes?: string;
  substitutes?: string[];
  product_name?: string;
  price?: string;
  promoted?: boolean;
}

export interface RecipeInstruction {
  step: number;
  text: string;
  tips?: string[];
  imageUrl?: string;
}

export interface MealPlanItem {
  id: string;
  recipe: Recipe;
  date: Date;
  mealType: MealType;
  servings: number;
  notes: string;
  dayOfWeek: number;
}

export interface WeeklyMealPlan {
  id: string;
  weekStartDate: string;
  items: MealPlanItem[];
}

export interface ProductInfo {
  id: string;
  name: string;
  brand: string;
  nutritionalInfo: {
    servingSize: string;
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
    sugar: string;
  };
  ingredients: string[];
  allergens: string[];
  dietaryInfo: {
    vegan: boolean;
    vegetarian: boolean;
    glutenFree: boolean;
    highProtein: boolean;
    highFibre: boolean;
  };
  weight: string;
  manufacturer: string;
  certifications: string[];
  barcode: string;
  imageUrl: string;
}

export type GoalCategory = 'nutrition' | 'hydration';
export type GoalDuration = 'daily' | 'weekly' | 'monthly' | 'quarterly';
export type GoalStatus = 'in_progress' | 'completed' | 'failed';

export interface Goal {
  id: string;
  userId: string;
  category: GoalCategory;
  title: string;
  description: string;
  target: number;
  unit: string;
  duration: GoalDuration;
  startDate: string;
  endDate: string;
  currentProgress: number;
  status: GoalStatus;
  points: number;
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  points: number;
  unlockedAt?: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  pointsCost: number;
  type: 'recipe' | 'template' | 'badge';
  unlocked: boolean;
}

export type DietType = 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian';
export type DietaryRestriction = 'gluten-free' | 'dairy-free' | 'nut-free' | 'kosher' | 'halal';

export interface NutritionalPreference {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  locked: boolean;
}

export interface HealthProfile {
  dietType: DietType;
  restrictions: DietaryRestriction[];
  allergies: string[];
  customRestrictions: string[];
  nutritionalPreferences: NutritionalPreference[];
  isOnGLP1?: boolean;
  caloricTarget?: number;
  cookingTimeMax?: number;
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
  servingsDefault?: number;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  checked: boolean;
  category: 'produce' | 'meat' | 'dairy' | 'pantry' | 'other';
  selected?: boolean;
  productName?: string;
  price?: string;
  promoted?: boolean;
}