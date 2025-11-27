import React from 'react';
import { ShoppingListGenerator } from './ShoppingListGenerator';
import { MealPlanItem, ShoppingListItem } from '../types';

interface ShoppingListProps {
  mealPlanItems: MealPlanItem[];
  shoppingList: ShoppingListItem[];
}

export function ShoppingList({ mealPlanItems, shoppingList }: ShoppingListProps) {
  // Combine items from meal plan and direct shopping list
  const allItems = [
    ...shoppingList,
    ...mealPlanItems.flatMap(item => 
      item.recipe.ingredients.map(ingredient => ({
        id: crypto.randomUUID(),
        name: ingredient.name,
        amount: (ingredient.amount * item.servings) / item.recipe.servings,
        unit: ingredient.unit,
        checked: false,
        category: 'other',
        productName: ingredient.product_name,
        price: ingredient.price,
        promoted: ingredient.promoted
      }))
    )
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ShoppingListGenerator mealPlanItems={mealPlanItems} initialItems={allItems} />
    </div>
  );
}