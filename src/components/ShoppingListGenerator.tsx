import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, Check, ChevronDown, Share2, Printer, ShoppingCart, Percent } from 'lucide-react';
import { MealPlanItem, ShoppingListItem } from '../types';

interface ShoppingListGeneratorProps {
  mealPlanItems: MealPlanItem[];
  initialItems?: ShoppingListItem[];
}

interface GroupedIngredient {
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

interface CustomItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: GroupedIngredient['category'];
  checked: boolean;
  selected?: boolean;
  productName?: string;
  price?: string;
  promoted?: boolean;
}

export function ShoppingListGenerator({ mealPlanItems, initialItems = [] }: ShoppingListGeneratorProps) {
  const [groupedIngredients, setGroupedIngredients] = useState<Record<string, GroupedIngredient>>({});
  const [customItems, setCustomItems] = useState<CustomItem[]>([]);
  const [newItem, setNewItem] = useState({ name: '', amount: 1, unit: 'pcs', productName: '', price: '', promoted: false });
  const [selectedCategory, setSelectedCategory] = useState<GroupedIngredient['category']>('other');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['produce', 'meat', 'dairy', 'pantry', 'other']));
  const [allSelected, setAllSelected] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  // Categorize ingredients based on common patterns
  const categorizeIngredient = (name: string): GroupedIngredient['category'] => {
    const lowerName = name.toLowerCase();
    if (lowerName.match(/lettuce|tomato|onion|garlic|vegetable|fruit|herb/)) return 'produce';
    if (lowerName.match(/chicken|beef|fish|pork|meat/)) return 'meat';
    if (lowerName.match(/milk|cheese|yogurt|cream|butter/)) return 'dairy';
    if (lowerName.match(/flour|sugar|oil|spice|rice|pasta/)) return 'pantry';
    return 'other';
  };

  // Calculate total price
  useEffect(() => {
    let total = 0;
    
    // Add up prices from grouped ingredients
    Object.values(groupedIngredients).forEach(ingredient => {
      if (ingredient.price) {
        const priceValue = parseFloat(ingredient.price.replace(/[^0-9.]/g, ''));
        if (!isNaN(priceValue)) {
          total += priceValue;
        }
      }
    });
    
    // Add up prices from custom items
    customItems.forEach(item => {
      if (item.price) {
        const priceValue = parseFloat(item.price.replace(/[^0-9.]/g, ''));
        if (!isNaN(priceValue)) {
          total += priceValue;
        }
      }
    });
    
    setTotalPrice(total);
  }, [groupedIngredients, customItems]);

  // Initialize with items from props
  useEffect(() => {
    const combined: Record<string, GroupedIngredient> = {};

    // Process meal plan items
    mealPlanItems.forEach(mealItem => {
      const recipe = mealItem.recipe;
      const servings = mealItem.servings;

      recipe.ingredients.forEach(ingredient => {
        const key = ingredient.name.toLowerCase();
        const adjustedAmount = (ingredient.amount * servings) / recipe.servings;

        if (!combined[key]) {
          combined[key] = {
            name: ingredient.name,
            amount: 0,
            unit: ingredient.unit,
            checked: false,
            selected: false,
            category: categorizeIngredient(ingredient.name),
            productName: ingredient.product_name,
            price: ingredient.price,
            promoted: ingredient.promoted
          };
        }
        combined[key].amount += adjustedAmount;
      });
    });

    // Also process initial items if provided
    initialItems.forEach(item => {
      const key = item.name.toLowerCase();
      if (!combined[key]) {
        combined[key] = {
          name: item.name,
          amount: 0,
          unit: item.unit,
          checked: false,
          selected: false,
          category: categorizeIngredient(item.name),
          productName: item.productName,
          price: item.price,
          promoted: item.promoted
        };
      }
      combined[key].amount += item.amount;
    });

    setGroupedIngredients(combined);
  }, [mealPlanItems, initialItems]);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleIngredient = (name: string) => {
    setGroupedIngredients(prev => ({
      ...prev,
      [name.toLowerCase()]: {
        ...prev[name.toLowerCase()],
        checked: !prev[name.toLowerCase()].checked
      }
    }));
  };

  const toggleCustomItem = (id: string) => {
    setCustomItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const addCustomItem = () => {
    if (newItem.name.trim()) {
      setCustomItems(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          ...newItem,
          category: selectedCategory,
          checked: false,
          selected: false
        }
      ]);
      setNewItem({ name: '', amount: 1, unit: 'pcs', productName: '', price: '', promoted: false });
    }
  };

  const removeCustomItem = (id: string) => {
    setCustomItems(prev => {
      const updatedItems = prev.filter(item => item.id !== id);
      // If all remaining items are selected, keep allSelected true
      const allItemsSelected = updatedItems.every(item => item.selected);
      const anyItemsLeft = updatedItems.length > 0;
      setAllSelected(anyItemsLeft && allItemsSelected);
      return updatedItems;
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const list = Object.values(groupedIngredients)
      .concat(customItems)
      .map(item => {
        let text = `${item.amount} ${item.unit} ${item.name}`;
        if (item.productName) text += ` (${item.productName})`;
        if (item.price) text += ` - ${item.price}`;
        return text;
      })
      .join('\n');

    if (navigator.share) {
      navigator.share({
        title: 'Shopping List',
        text: list
      });
    } else {
      navigator.clipboard.writeText(list);
    }
  };

  const handleAddToCart = () => {
    const selectedIngredients = Object.values(groupedIngredients)
      .filter(ing => ing.selected)
      .map(ing => ({
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit,
        productName: ing.productName,
        price: ing.price
      }));

    const selectedCustomItems = customItems
      .filter(item => item.selected)
      .map(item => ({
        name: item.name,
        amount: item.amount,
        unit: item.unit,
        productName: item.productName,
        price: item.price
      }));

    const cartItems = [...selectedIngredients, ...selectedCustomItems];
    console.log('Adding to cart:', cartItems);
  };

  const handleSelectItem = (name: string, isCustomItem: boolean = false, itemId?: string) => {
    if (isCustomItem && itemId) {
      setCustomItems(prev => {
        const updatedItems = prev.map(item =>
          item.id === itemId
            ? { ...item, selected: !item.selected }
            : item
        );
        // Update allSelected based on all items
        const allItemsSelected = updatedItems.every(item => item.selected) &&
          Object.values(groupedIngredients).every(ing => ing.selected);
        setAllSelected(allItemsSelected);
        return updatedItems;
      });
    } else {
      setGroupedIngredients(prev => {
        const updatedIngredients = {
          ...prev,
          [name.toLowerCase()]: {
            ...prev[name.toLowerCase()],
            selected: !prev[name.toLowerCase()].selected
          }
        };
        // Update allSelected based on all items
        const allIngredientsSelected = Object.values(updatedIngredients).every(ing => ing.selected);
        const allCustomItemsSelected = customItems.every(item => item.selected);
        setAllSelected(allIngredientsSelected && allCustomItemsSelected);
        return updatedIngredients;
      });
    }
  };

  const handleSelectAll = () => {
    const newSelectedState = !allSelected;
    setAllSelected(newSelectedState);

    // Update all ingredients
    setGroupedIngredients(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => {
        updated[key] = { ...updated[key], selected: newSelectedState };
      });
      return updated;
    });

    // Update all custom items
    setCustomItems(prev =>
      prev.map(item => ({ ...item, selected: newSelectedState }))
    );
  };

  const categories: GroupedIngredient['category'][] = ['produce', 'meat', 'dairy', 'pantry', 'other'];

  // Format price to always show currency symbol
  const formatPrice = (price: string) => {
    if (!price) return '';
    if (price.startsWith('$') || price.startsWith('£') || price.startsWith('€')) {
      return price;
    }
    return `£${price}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden print:shadow-none">
      <div className="p-6 border-b border-primary print:hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-racing" />
            <h2 className="text-xl font-bold text-racing">Shopping List</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="p-2 text-racing-50 hover:text-racing rounded-lg transition-colors"
              aria-label="Share shopping list"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 text-racing-50 hover:text-racing rounded-lg transition-colors"
              aria-label="Print shopping list"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={handleAddToCart}
              className="inline-flex items-center gap-2 px-4 py-2 bg-racing text-white rounded-lg hover:bg-racing-75 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Add Selected to Cart</span>
            </button>
          </div>
        </div>

        <div className="mb-4 p-4 bg-primary-25 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="font-medium text-racing">Estimated Total:</span>
            <span className="text-xl font-bold text-racing">£{totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleSelectAll}
            className={`px-4 py-2 rounded-lg transition-colors ${
              allSelected
                ? 'bg-racing text-white hover:bg-racing-75'
                : 'border-2 border-racing text-racing hover:bg-racing-25'
            }`}
          >
            {allSelected ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            addCustomItem();
          }}
          className="flex flex-wrap gap-2"
        >
          <input
            type="text"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            placeholder="Add item..."
            className="flex-1 px-4 py-2 rounded-lg border-2 border-primary focus:outline-none focus:ring-2 focus:ring-racing focus:border-racing"
          />
          <input
            type="number"
            value={newItem.amount}
            onChange={(e) => setNewItem({ ...newItem, amount: Number(e.target.value) })}
            min="1"
            className="w-20 px-4 py-2 rounded-lg border-2 border-primary focus:outline-none focus:ring-2 focus:ring-racing focus:border-racing"
          />
          <select
            value={newItem.unit}
            onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
            className="w-24 px-4 py-2 rounded-lg border-2 border-primary bg-white focus:outline-none focus:ring-2 focus:ring-racing focus:border-racing"
          >
            <option value="pcs">pcs</option>
            <option value="g">g</option>
            <option value="kg">kg</option>
            <option value="ml">ml</option>
            <option value="l">l</option>
            <option value="tbsp">tbsp</option>
            <option value="tsp">tsp</option>
            <option value="cup">cup</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as GroupedIngredient['category'])}
            className="w-32 px-4 py-2 rounded-lg border-2 border-primary bg-white focus:outline-none focus:ring-2 focus:ring-racing focus:border-racing"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={newItem.productName}
            onChange={(e) => setNewItem({ ...newItem, productName: e.target.value })}
            placeholder="Product name (optional)"
            className="flex-1 px-4 py-2 rounded-lg border-2 border-primary focus:outline-none focus:ring-2 focus:ring-racing focus:border-racing"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-racing text-white hover:bg-racing-75 transition-colors"
          >
            Add
          </button>
        </form>
      </div>

      <div className="divide-y divide-primary">
        {categories.map(category => {
          const categoryIngredients = Object.values(groupedIngredients)
            .filter(ing => ing.category === category)
            .sort((a, b) => {
              if (a.promoted && !b.promoted) return -1;
              if (!a.promoted && b.promoted) return 1;
              return 0;
            });

          const categoryCustItems = customItems
            .filter(item => item.category === category)
            .sort((a, b) => {
              if (a.promoted && !b.promoted) return -1;
              if (!a.promoted && b.promoted) return 1;
              return 0;
            });

          if (categoryIngredients.length === 0 && categoryCustItems.length === 0) {
            return null;
          }

          return (
            <div key={category} className="print:break-inside-avoid">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full px-6 py-3 bg-primary-25 flex items-center justify-between font-medium text-racing print:hidden"
              >
                <span className="capitalize">{category}</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    expandedCategories.has(category) ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div className={`${expandedCategories.has(category) ? '' : 'hidden print:block'}`}>
                {categoryIngredients.map(ingredient => (
                  <div
                    key={ingredient.name}
                    className="px-6 py-3 flex items-center gap-3 group hover:bg-primary-25 transition-colors"
                  >
                    <button
                      onClick={() => toggleIngredient(ingredient.name)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors print:hidden
                        ${ingredient.checked
                          ? 'bg-racing border-racing text-white'
                          : 'border-racing-50 hover:border-racing'
                        }`}
                    >
                      {ingredient.checked && <Check className="w-4 h-4" />}
                    </button>
                    <div className={`flex-1 ${ingredient.checked ? 'line-through text-racing-50' : ''}`}>
                      <div className="flex items-center gap-2">
                        <span>
                          {ingredient.amount} {ingredient.unit} {ingredient.name}
                        </span>
                        {ingredient.promoted && (
                          <div className="w-5 h-5 rounded-full bg-blue-800 flex items-center justify-center">
                            <Percent className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      {(ingredient.productName || ingredient.price) && (
                        <div className="text-sm text-racing-75 mt-1">
                          {ingredient.productName && <span>{ingredient.productName}</span>}
                          {ingredient.price && (
                            <span className="ml-2 font-medium text-racing">
                              {formatPrice(ingredient.price)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleSelectItem(ingredient.name)}
                      className={`ml-auto px-4 py-1.5 rounded-lg transition-colors print:hidden ${
                        ingredient.selected
                          ? 'bg-racing text-white hover:bg-racing-75'
                          : 'border-2 border-racing text-racing hover:bg-racing-25'
                      }`}
                    >
                      {ingredient.selected ? 'Selected' : 'Select'}
                    </button>
                  </div>
                ))}
                {categoryCustItems.map(item => (
                  <div
                    key={item.id}
                    className="px-6 py-3 flex items-center gap-3 group hover:bg-primary-25 transition-colors"
                  >
                    <button
                      onClick={() => toggleCustomItem(item.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors print:hidden
                        ${item.checked
                          ? 'bg-racing border-racing text-white'
                          : 'border-racing-50 hover:border-racing'
                        }`}
                    >
                      {item.checked && <Check className="w-4 h-4" />}
                    </button>
                    <div className={`flex-1 ${item.checked ? 'line-through text-racing-50' : ''}`}>
                      <div className="flex items-center gap-2">
                        <span>
                          {item.amount} {item.unit} {item.name}
                        </span>
                        {item.promoted && (
                          <div className="w-5 h-5 rounded-full bg-blue-800 flex items-center justify-center">
                            <Percent className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      {(item.productName || item.price) && (
                        <div className="text-sm text-racing-75 mt-1">
                          {item.productName && <span>{item.productName}</span>}
                          {item.price && (
                            <span className="ml-2 font-medium text-racing">
                              {formatPrice(item.price)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleSelectItem(item.name, true, item.id)}
                      className={`ml-auto px-4 py-1.5 rounded-lg transition-colors print:hidden ${
                        item.selected
                          ? 'bg-racing text-white hover:bg-racing-75'
                          : 'border-2 border-racing text-racing hover:bg-racing-25'
                      }`}
                    >
                      {item.selected ? 'Selected' : 'Select'}
                    </button>
                    <button
                      onClick={() => removeCustomItem(item.id)}
                      className="p-2 -m-2 text-racing-50 opacity-0 group-hover:opacity-100 hover:text-racing transition-all print:hidden"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}