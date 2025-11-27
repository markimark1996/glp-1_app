import { ShoppingCart, HeartPulse } from 'lucide-react';
import { UserMenu } from './UserMenu';

interface HeaderProps {
  onOpenProfileManagement: () => void;
}

export function Header({ onOpenProfileManagement }: HeaderProps) {
  return (
    <header className="bg-white border-b border-[#465E5A]/15 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <HeartPulse className="w-8 h-8 text-[#6264A1]" />
            <div className="hidden sm:block">
              <p className="text-xs text-[#465E5A]/70">Your GLP-1 Nutrition Companion</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-[#465E5A] hover:bg-[#E5F2E4] rounded transition-colors">
              <ShoppingCart className="w-5 h-5 text-[#6264A1]" />
              <span>My Shopping List</span>
            </button>
            <button
              onClick={onOpenProfileManagement}
              className="flex items-center gap-2 px-4 py-2 text-[#465E5A] hover:bg-[#E5F2E4] rounded transition-colors"
            >
              <HeartPulse className="w-5 h-5 text-[#6264A1]" />
              <span>My Health Profile</span>
            </button>
          </nav>

          <UserMenu onOpenProfileManagement={onOpenProfileManagement} />
        </div>
      </div>
    </header>
  );
}
