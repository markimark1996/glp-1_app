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
      className={`p-2 bg-[#DDEFDC] border border-[#465E5A]/15 transition-all print:p-1 print:text-xs ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start gap-2 print:gap-1">
        <button className="p-1 -m-1 text-[#465E5A]/60 cursor-grab active:cursor-grabbing print:hidden">
          <GripVertical className="w-3 h-3" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1 print:mb-0">
            <span className="text-xs font-medium text-[#465E5A]/70 capitalize print:text-[10px]">
              {meal.mealType}
            </span>
            <button
              onClick={onDelete}
              className="p-1 -m-1 text-[#465E5A]/60 hover:text-[#465E5A] print:hidden"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          <h4 className="text-sm font-medium text-[#465E5A] truncate print:text-[10px]">
            {meal.recipe.name}
          </h4>

          <div className="flex items-center gap-2 mt-1 text-xs text-[#465E5A]/60 print:text-[9px] print:mt-0">
            <span>{meal.servings} serving{meal.servings !== 1 ? 's' : ''}</span>
            <span>•</span>
            <span>{meal.recipe.nutrition.calories} cal</span>
          </div>
        </div>
      </div>
    </div>
  );
}