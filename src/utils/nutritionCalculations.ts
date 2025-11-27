export function calculateNutritionWithDV(nutrition: {
  calories: number | string;
  protein: number | string;
  carbs: number | string;
  fat: number | string;
  fiber: number | string;
  sugar: number | string;
  saturatedFat?: number | string;
  sodium?: number | string;
}) {
  const protein = typeof nutrition.protein === 'string' ? parseFloat(nutrition.protein) : nutrition.protein;
  const carbs = typeof nutrition.carbs === 'string' ? parseFloat(nutrition.carbs) : nutrition.carbs;
  const fat = typeof nutrition.fat === 'string' ? parseFloat(nutrition.fat) : nutrition.fat;
  const fiber = typeof nutrition.fiber === 'string' ? parseFloat(nutrition.fiber) : nutrition.fiber;
  const sugar = typeof nutrition.sugar === 'string' ? parseFloat(nutrition.sugar) : nutrition.sugar;
  const saturatedFat = nutrition.saturatedFat
    ? (typeof nutrition.saturatedFat === 'string' ? parseFloat(nutrition.saturatedFat) : nutrition.saturatedFat)
    : undefined;
  const sodium = nutrition.sodium
    ? (typeof nutrition.sodium === 'string' ? parseFloat(nutrition.sodium) : nutrition.sodium)
    : undefined;

  const proteinDV = Math.round((protein / 50) * 100);
  const carbsDV = Math.round((carbs / 300) * 100);
  const fiberDV = Math.round((fiber / 28) * 100);
  const fatDV = Math.round((fat / 78) * 100);
  const sugarDV = Math.round((sugar / 50) * 100);
  const saturatedFatDV = saturatedFat !== undefined ? Math.round((saturatedFat / 20) * 100) : undefined;
  const sodiumDV = sodium !== undefined ? Math.round((sodium / 2300) * 100) : undefined;

  return {
    ...nutrition,
    protein,
    carbs,
    fat,
    fiber,
    sugar,
    saturatedFat,
    sodium,
    proteinDV,
    carbsDV,
    fiberDV,
    fatDV,
    sugarDV,
    saturatedFatDV,
    sodiumDV,
  };
}
