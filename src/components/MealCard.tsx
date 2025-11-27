import React from 'react';
import { useDrag } from 'react-dnd';
import { GripVertical, X } from 'lucide-react';
import { MealPlanItem } from '../types';

interface MealCardProps {
  meal: MealPlanItem;
  fromDate: string;
  onDelete: () => void;
}

export function MealCard({ meal, fromDate, onDelete }: MealCardProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'MEAL',
    item: {
      id: meal.id,
      fromDate
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  return (
    <div
      ref={drag}
      className={`p-2 bg-[#DDEFDC] border border-[#465E5A]/15 transition-all ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start gap-2">
        <button className="p-1 -m-1 text-[#465E5A]/60 cursor-grab active:cursor-grabbing">
          <GripVertical className="w-3 h-3" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-medium text-[#465E5A]/70 capitalize">
              {meal.mealType}
            </span>
            <button
              onClick={onDelete}
              className="p-1 -m-1 text-[#465E5A]/60 hover:text-[#465E5A]"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          <h4 className="text-sm font-medium text-[#465E5A] truncate">
            {meal.recipe.name}
          </h4>

          <div className="flex items-center gap-2 mt-1 text-xs text-[#465E5A]/60">
            <span>{meal.servings}x</span>
            <span>{meal.recipe.prepTime + meal.recipe.cookTime}m</span>
          </div>
        </div>
      </div>
    </div>
  );
}