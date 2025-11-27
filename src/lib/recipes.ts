import { supabase } from './supabase';
import { Recipe } from '../types';

export async function loadRecipesFromDatabase(): Promise<Recipe[]> {
  try {
    // Fetch all recipes with related data
    const { data: recipesData, error: recipesError } = await supabase
      .from('recipes')
      .select('*');

    if (recipesError) throw recipesError;
    if (!recipesData) return [];

    // Fetch all related data for all recipes
    const recipeIds = recipesData.map(r => r.id);

    const [
      { data: ingredients },
      { data: instructions },
      { data: dietary },
      { data: nutrition },
      { data: equipment },
      { data: tips },
      { data: variations }
    ] = await Promise.all([
      supabase.from('recipe_ingredients').select('*').in('recipe_id', recipeIds),
      supabase.from('recipe_instructions').select('*').in('recipe_id', recipeIds),
      supabase.from('recipe_dietary_info').select('*').in('recipe_id', recipeIds),
      supabase.from('recipe_nutrition').select('*').in('recipe_id', recipeIds),
      supabase.from('recipe_equipment').select('*').in('recipe_id', recipeIds),
      supabase.from('recipe_tips').select('*').in('recipe_id', recipeIds),
      supabase.from('recipe_variations').select('*').in('recipe_id', recipeIds)
    ]);

    // Transform database records into Recipe objects
    const recipes: Recipe[] = recipesData.map(recipe => {
      const recipeIngredients = (ingredients || [])
        .filter(ing => ing.recipe_id === recipe.id)
        .sort((a, b) => a.order_index - b.order_index)
        .map(ing => ({
          name: ing.name,
          amount: parseFloat(ing.amount),
          unit: ing.unit,
          notes: ing.notes,
          product_name: ing.product_name,
          price: ing.price ? ing.price.toString() : undefined,
          promoted: ing.promoted ? ing.promoted.toString() : undefined
        }));

      const recipeInstructions = (instructions || [])
        .filter(inst => inst.recipe_id === recipe.id)
        .sort((a, b) => a.step_number - b.step_number)
        .map(inst => ({
          step: inst.step_number,
          text: inst.text,
          imageUrl: inst.image_url
        }));

      const recipeDietary = (dietary || []).find(d => d.recipe_id === recipe.id);
      const recipeNutrition = (nutrition || []).find(n => n.recipe_id === recipe.id);

      const recipeEquipment = (equipment || [])
        .filter(eq => eq.recipe_id === recipe.id)
        .map(eq => eq.equipment);

      const recipeTips = (tips || [])
        .filter(tip => tip.recipe_id === recipe.id)
        .sort((a, b) => a.order_index - b.order_index)
        .map(tip => tip.tip);

      const recipeVariations = (variations || [])
        .filter(v => v.recipe_id === recipe.id)
        .sort((a, b) => a.order_index - b.order_index)
        .map(v => v.variation);

      return {
        id: recipe.id,
        name: recipe.name,
        description: recipe.description,
        ingredients: recipeIngredients,
        instructions: recipeInstructions,
        prepTime: recipe.prep_time,
        cookTime: recipe.cook_time,
        servings: parseFloat(recipe.servings),
        imageUrl: recipe.image_url,
        likes: recipe.likes,
        difficulty: recipe.difficulty as 'beginner' | 'intermediate' | 'advanced',
        cuisine: recipe.cuisine,
        dietaryInfo: {
          vegetarian: recipeDietary?.vegetarian || false,
          vegan: recipeDietary?.vegan || false,
          glutenFree: recipeDietary?.gluten_free || false,
          dairyFree: recipeDietary?.dairy_free || false,
          pescetarian: recipeDietary?.pescetarian || false,
          highProtein: recipeDietary?.high_protein || false,
          highFibre: recipeDietary?.high_fibre || false
        },
        nutrition: {
          calories: recipeNutrition ? parseFloat(recipeNutrition.calories) : 0,
          protein: recipeNutrition ? parseFloat(recipeNutrition.protein) : 0,
          carbs: recipeNutrition ? parseFloat(recipeNutrition.carbs) : 0,
          fat: recipeNutrition ? parseFloat(recipeNutrition.fat) : 0,
          fiber: recipeNutrition ? parseFloat(recipeNutrition.fiber) : 0,
          sugar: recipeNutrition ? parseFloat(recipeNutrition.sugar) : 0
        },
        storage: {
          instructions: '',
          shelfLife: '',
          reheating: ''
        },
        equipment: recipeEquipment,
        tips: recipeTips,
        variations: recipeVariations,
        createdAt: recipe.created_at,
        updatedAt: recipe.updated_at,
        healthScore: recipe.health_score
      };
    });

    return recipes;
  } catch (error) {
    console.error('Error loading recipes from database:', error);
    return [];
  }
}
