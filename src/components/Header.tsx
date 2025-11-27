import { Logo } from './Logo';
import { UserMenu } from './UserMenu';
import { GlobalSearch } from './GlobalSearch';
import { Recipe } from '../types';

interface HeaderProps {
  onRecipeSelect: (recipe: Recipe) => void;
  onDietaryFilterSelect?: (filter: string) => void;
}

export function Header({ onRecipeSelect, onDietaryFilterSelect }: HeaderProps) {
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

          <div className="flex items-center gap-3">
            <UserMenu />
          </div>
        </div>

        <div className="pb-4">
          <GlobalSearch
            onRecipeSelect={onRecipeSelect}
            onDietaryFilterSelect={onDietaryFilterSelect}
          />
        </div>
      </div>
    </header>
  );
}
