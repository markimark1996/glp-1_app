import { supabase } from './supabase';
import { sampleRecipes } from '../data/sampleData';

export async function seedRecipes() {
  console.log('Starting recipe seeding...');

  let successCount = 0;
  let errorCount = 0;

  for (const recipe of sampleRecipes) {
    try {
      // Insert main recipe
      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .insert([{
          name: recipe.name,
          description: recipe.description,
          prep_time: recipe.prepTime,
          cook_time: recipe.cookTime,
          servings: recipe.servings,
          image_url: recipe.imageUrl,
          likes: recipe.likes,
          difficulty: recipe.difficulty,
          cuisine: recipe.cuisine,
          health_score: recipe.healthScore,
          created_at: recipe.createdAt,
          updated_at: recipe.updatedAt,
        }])
        .select()
        .single();

      if (recipeError) {
        console.error(`Error inserting recipe ${recipe.name}:`, recipeError);
        errorCount++;
        continue;
      }

      const recipeId = recipeData.id;

      // Insert ingredients
      if (recipe.ingredients && recipe.ingredients.length > 0) {
        const ingredients = recipe.ingredients.map((ing, index) => ({
          recipe_id: recipeId,
          name: ing.name,
          amount: ing.amount,
          unit: ing.unit,
          notes: ing.notes,
          product_name: ing.product_name,
          price: ing.price ? parseFloat(ing.price) : null,
          promoted: ing.promoted ? parseFloat(ing.promoted as any) : null,
          order_index: index,
        }));

        const { error: ingredientsError } = await supabase
          .from('recipe_ingredients')
          .insert(ingredients);

        if (ingredientsError) {
          console.error(`Error inserting ingredients for ${recipe.name}:`, ingredientsError);
        }
      }

      // Insert instructions
      if (recipe.instructions && recipe.instructions.length > 0) {
        const instructions = recipe.instructions.map(inst => ({
          recipe_id: recipeId,
          step_number: inst.step,
          text: inst.text,
          image_url: inst.imageUrl,
        }));

        const { error: instructionsError } = await supabase
          .from('recipe_instructions')
          .insert(instructions);

        if (instructionsError) {
          console.error(`Error inserting instructions for ${recipe.name}:`, instructionsError);
        }
      }

      // Insert dietary info
      const { error: dietaryError } = await supabase
        .from('recipe_dietary_info')
        .insert([{
          recipe_id: recipeId,
          vegetarian: recipe.dietaryInfo.vegetarian,
          vegan: recipe.dietaryInfo.vegan,
          gluten_free: recipe.dietaryInfo.glutenFree,
          dairy_free: recipe.dietaryInfo.dairyFree,
          pescetarian: recipe.dietaryInfo.pescetarian,
          high_protein: recipe.dietaryInfo.highProtein,
          high_fibre: recipe.dietaryInfo.highFibre,
        }]);

      if (dietaryError) {
        console.error(`Error inserting dietary info for ${recipe.name}:`, dietaryError);
      }

      // Insert nutrition
      const { error: nutritionError } = await supabase
        .from('recipe_nutrition')
        .insert([{
          recipe_id: recipeId,
          calories: parseFloat(recipe.nutrition.calories as any),
          protein: parseFloat(recipe.nutrition.protein as any),
          carbs: parseFloat(recipe.nutrition.carbs as any),
          fat: parseFloat(recipe.nutrition.fat as any),
          fiber: parseFloat(recipe.nutrition.fiber as any),
          sugar: parseFloat(recipe.nutrition.sugar as any),
          salt: (recipe.nutrition as any).salt ? parseFloat((recipe.nutrition as any).salt) : null,
        }]);

      if (nutritionError) {
        console.error(`Error inserting nutrition for ${recipe.name}:`, nutritionError);
      }

      // Insert equipment
      if (recipe.equipment && recipe.equipment.length > 0) {
        const equipment = recipe.equipment.map(eq => ({
          recipe_id: recipeId,
          equipment: eq,
        }));

        const { error: equipmentError } = await supabase
          .from('recipe_equipment')
          .insert(equipment);

        if (equipmentError) {
          console.error(`Error inserting equipment for ${recipe.name}:`, equipmentError);
        }
      }

      // Insert tips
      if (recipe.tips && recipe.tips.length > 0) {
        const tips = recipe.tips.map((tip, index) => ({
          recipe_id: recipeId,
          tip,
          order_index: index,
        }));

        const { error: tipsError } = await supabase
          .from('recipe_tips')
          .insert(tips);

        if (tipsError) {
          console.error(`Error inserting tips for ${recipe.name}:`, tipsError);
        }
      }

      // Insert variations
      if (recipe.variations && recipe.variations.length > 0) {
        const variations = recipe.variations.map((variation, index) => ({
          recipe_id: recipeId,
          variation,
          order_index: index,
        }));

        const { error: variationsError } = await supabase
          .from('recipe_variations')
          .insert(variations);

        if (variationsError) {
          console.error(`Error inserting variations for ${recipe.name}:`, variationsError);
        }
      }

      successCount++;
      console.log(`Successfully seeded recipe: ${recipe.name}`);
    } catch (error) {
      console.error(`Error processing recipe ${recipe.name}:`, error);
      errorCount++;
    }
  }

  console.log(`Seeding complete! Success: ${successCount}, Errors: ${errorCount}`);
  return { successCount, errorCount };
}
