import { useState } from 'react';
import { UtensilsCrossed, ShoppingBag } from 'lucide-react';
import { RecipeSearch } from './RecipeSearch';

type DiscoverTab = 'recipes' | 'products';

export function Discover() {
  const [activeTab, setActiveTab] = useState<DiscoverTab>('recipes');

  return (
    <div className="min-h-screen bg-[#F4F6F7] pb-20">
      <div className="sticky top-0 z-10 bg-white border-b border-[#465E5A]/15">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-center gap-1 pt-6">
            <button
              onClick={() => setActiveTab('recipes')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'recipes'
                  ? 'text-[#6264A1] border-b-2 border-[#6264A1]'
                  : 'text-[#465E5A]/60 hover:text-[#465E5A]'
              }`}
            >
              <UtensilsCrossed className="w-5 h-5" />
              Recipes
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'products'
                  ? 'text-[#6264A1] border-b-2 border-[#6264A1]'
                  : 'text-[#465E5A]/60 hover:text-[#465E5A]'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              Products
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {activeTab === 'recipes' && <RecipeSearch />}

        {activeTab === 'products' && (
          <div className="p-6">
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-[#9697C0]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-[#6264A1]" />
              </div>
              <h3 className="text-xl font-semibold text-[#465E5A] mb-2">Products Coming Soon</h3>
              <p className="text-[#465E5A]/60 max-w-md mx-auto">
                We're working on bringing you a curated selection of GLP-1 friendly products.
                Check back soon!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
