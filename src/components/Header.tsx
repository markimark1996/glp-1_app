import { ShoppingCart, HeartPulse } from 'lucide-react';
import { Logo } from './Logo';
import { UserMenu } from './UserMenu';
import { GlobalSearch } from './GlobalSearch';
import { Recipe } from '../types';

interface HeaderProps {
  onOpenHealthProfile: () => void;
  onOpenShoppingList: () => void;
  onRecipeSelect: (recipe: Recipe) => void;
}

export function Header({ onOpenHealthProfile, onOpenShoppingList, onRecipeSelect }: HeaderProps) {
  return (
    <header className="bg-white border-b border-[#465E5A]/15 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Logo />
            <div className="hidden sm:block">
              <p className="text-xs text-[#465E5A]/70">Your GLP-1 Nutrition Companion</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={onOpenShoppingList}
              className="flex items-center gap-2 px-4 py-2 text-[#465E5A] hover:bg-[#E5F2E4] rounded transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-[#6264A1]" />
              <span>My Shopping List</span>
            </button>
            <button
              onClick={onOpenHealthProfile}
              className="flex items-center gap-2 px-4 py-2 text-[#465E5A] hover:bg-[#E5F2E4] rounded transition-colors"
            >
              <HeartPulse className="w-5 h-5 text-[#6264A1]" />
              <span>My Health Profile</span>
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <UserMenu onOpenHealthProfile={onOpenHealthProfile} />
          </div>
        </div>

        <div className="pb-4">
          <GlobalSearch onRecipeSelect={onRecipeSelect} />
        </div>
      </div>
    </header>
  );
}
