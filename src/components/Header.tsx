import { ShoppingCart, HeartPulse, Bell } from 'lucide-react';
import { UserMenu } from './UserMenu';
import { GlobalSearch } from './GlobalSearch';
import { Recipe } from '../types';
import { Logo } from './Logo';

interface HeaderProps {
  onOpenHealthProfile: () => void;
  onOpenShoppingList: () => void;
  onRecipeSelect: (recipe: Recipe) => void;
}

export function Header({ onOpenHealthProfile, onOpenShoppingList, onRecipeSelect }: HeaderProps) {
  return (
    <header className="bg-white border-b border-[#465E5A]/15 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          <div className="flex items-center gap-3 flex-shrink-0">
            <Logo />
            <div className="hidden sm:block">
              <p className="text-xs text-[#465E5A]/70">Your GLP-1 Nutrition Companion</p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-1 max-w-4xl">
            <GlobalSearch onRecipeSelect={onRecipeSelect} />
          </div>

          <nav className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onOpenShoppingList}
              className="flex items-center gap-2 px-3 py-2 text-[#465E5A] hover:bg-[#E5F2E4] transition-colors rounded-lg"
              title="My Shopping List"
            >
              <ShoppingCart className="w-5 h-5 text-[#6264A1]" />
              <span className="hidden xl:inline">My Shopping List</span>
            </button>
            <button
              onClick={onOpenHealthProfile}
              className="flex items-center gap-2 px-3 py-2 text-[#465E5A] hover:bg-[#E5F2E4] transition-colors rounded-lg"
              title="My Health Profile"
            >
              <HeartPulse className="w-5 h-5 text-[#6264A1]" />
              <span className="hidden xl:inline">My Health Profile</span>
            </button>
          </nav>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              className="p-2 text-[#465E5A] hover:bg-[#E5F2E4] transition-colors rounded-lg relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-[#6264A1]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <UserMenu onOpenHealthProfile={onOpenHealthProfile} />
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="lg:hidden px-4 pb-3">
        <GlobalSearch onRecipeSelect={onRecipeSelect} />
      </div>
    </header>
  );
}
