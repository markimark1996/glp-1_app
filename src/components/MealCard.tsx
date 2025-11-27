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
      className={`p-3 bg-white rounded-lg border border-primary shadow-sm transition-all ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <button className="p-1 -m-1 text-racing-50 cursor-grab active:cursor-grabbing">
          <GripVertical className="w-4 h-4" />
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-sm font-medium text-racing-50 capitalize">
              {meal.mealType}
            </span>
            <button 
              onClick={onDelete}
              className="p-1 -m-1 text-racing-50 hover:text-racing"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <h4 className="font-medium text-racing truncate">
            {meal.recipe.name}
          </h4>
          
          <div className="flex items-center gap-4 mt-2 text-sm text-racing-50">
            <span>{meal.servings} servings</span>
            <span>{meal.recipe.prepTime + meal.recipe.cookTime} min</span>
          </div>
        </div>
      </div>
    </div>
  );
}