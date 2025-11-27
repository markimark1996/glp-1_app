import { useMemo } from 'react';
import { Recipe, HealthProfile } from '../types';

export function useFilteredRecipes(recipes: Recipe[], profile: HealthProfile | null) {
  return useMemo(() => {
    if (!profile) return recipes;

    return recipes.filter(recipe => {
      // Check dietary type restrictions
      if (profile.dietType === 'vegetarian' && !recipe.dietaryInfo.vegetarian) {
        return false;
      }
      if (profile.dietType === 'vegan' && !recipe.dietaryInfo.vegan) {
        return false;
      }
      if (profile.dietType === 'pescatarian' && !recipe.dietaryInfo.pescetarian) {
        return false;
      }

      // Check of GLP1 restriction
      if (profile.isOnGLP1 && !(recipe.dietaryInfo.highProtein && recipe.dietaryInfo.highFibre)) {
        return false;
      }

      // Check specific dietary restrictions
      for (const restriction of profile.restrictions) {
        switch (restriction.toLowerCase()) {
          case 'gluten-free':
            if (!recipe.dietaryInfo.glutenFree) return false;
            break;
          case 'dairy-free':
            if (!recipe.dietaryInfo.dairyFree) return false;
            break;
        }
      }

      // Check for allergens in ingredients
      const allergens = new Set(profile.allergies.map(a => a.toLowerCase()));
      if (recipe.ingredients.some(ingredient => 
        allergens.has(ingredient.name.toLowerCase()) ||
        allergens.has(ingredient.name.split(' ')[0].toLowerCase())
      )) {
        return false;
      }

      // Check custom restrictions
      const customRestrictions = new Set(profile.customRestrictions.map(r => r.toLowerCase()));
      if (recipe.ingredients.some(ingredient => 
        customRestrictions.has(ingredient.name.toLowerCase()) ||
        customRestrictions.has(ingredient.name.split(' ')[0].toLowerCase())
      )) {
        return false;
      }

      // // Check cooking time preference
      // if (profile.cookingTimeMax && 
      //     (recipe.prepTime + recipe.cookTime) > profile.cookingTimeMax) {
      //   return false;
      // }

      // Check difficulty level
      if (profile.skillLevel === 'beginner' && recipe.difficulty !== 'beginner') {
        return false;
      }
      if (profile.skillLevel === 'intermediate' && recipe.difficulty === 'advanced') {
        return false;
      }

      // // Check nutritional preferences
      // const nutritionalPrefs = profile.nutritionalPreferences || [];
      // for (const pref of nutritionalPrefs) {
      //   if (pref.enabled) {
      //     switch (pref.id) {
      //       case 'high-protein':
      //         if (recipe.nutrition.protein < 15) return false;
      //         break;
      //       case 'high-fiber':
      //         if (recipe.nutrition.fiber < 5) return false;
      //         break;
      //     }
      //   }
      // }

      return true;
    }).sort((a, b) => {
      // Sort by best match to nutritional preferences
      const aScore = getRecipeMatchScore(a, profile);
      const bScore = getRecipeMatchScore(b, profile);
      return bScore - aScore;
    });
  }, [recipes, profile]);
}

function getRecipeMatchScore(recipe: Recipe, profile: HealthProfile): number {
  let score = 0;

  // Score based on nutritional preferences
  const nutritionalPrefs = profile.nutritionalPreferences || [];
  for (const pref of nutritionalPrefs) {
    if (pref.enabled) {
      switch (pref.id) {
        case 'high-protein':
          if (recipe.nutrition.protein >= 15) score += 2;
          break;
        case 'high-fiber':
          if (recipe.nutrition.fiber >= 5) score += 2;
          break;
      }
    }
  }

  // Score based on cooking time match
  if (profile.cookingTimeMax) {
    const timeScore = 1 - ((recipe.prepTime + recipe.cookTime) / profile.cookingTimeMax);
    score += Math.max(0, timeScore);
  }

  // Score based on skill level match
  switch (profile.skillLevel) {
    case 'beginner':
      score += recipe.difficulty === 'beginner' ? 2 : 0;
      break;
    case 'intermediate':
      score += recipe.difficulty === 'intermediate' ? 2 : 
               recipe.difficulty === 'beginner' ? 1 : 0;
      break;
    case 'advanced':
      score += 2;
      break;
  }

  return score;
}