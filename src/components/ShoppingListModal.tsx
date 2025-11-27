import { X, ShoppingCart } from 'lucide-react';
import { ShoppingList } from './ShoppingList';
import { MealPlanItem, ShoppingListItem } from '../types';

interface ShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealPlanItems: MealPlanItem[];
  shoppingList: ShoppingListItem[];
}

export function ShoppingListModal({ isOpen, onClose, mealPlanItems, shoppingList }: ShoppingListModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg">
        <div className="sticky top-0 bg-[#465E5A] text-white p-6 flex items-center justify-between z-10 rounded-t-lg">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl font-semibold text-white">My Shopping List</h2>
              <p className="text-sm text-white/80 mt-1">Generated from your meal plan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 transition-colors rounded text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <ShoppingList mealPlanItems={mealPlanItems} shoppingList={shoppingList} />
      </div>
    </div>
  );
}
