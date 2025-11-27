import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, ChefHat, Leaf, Wheat, Milk, Droplets } from 'lucide-react';
import { Recipe } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { sampleRecipes } from '../data/sampleData';

interface GlobalSearchProps {
  onRecipeSelect: (recipe: Recipe) => void;
}

interface SearchResult {
  type: 'recipe' | 'ingredient' | 'dietary';
  id: string;
  title: string;
  subtitle?: string;
  recipe?: Recipe;
  icon?: React.ReactNode;
}

export function GlobalSearch({ onRecipeSelect }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.trim().length > 0) {
      performSearch(debouncedQuery);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = (searchQuery: string) => {
    const searchText = searchQuery.toLowerCase().trim();
    const searchResults: SearchResult[] = [];
    const seenRecipes = new Set<string>();

    sampleRecipes.forEach(recipe => {
      const nameMatch = recipe.name.toLowerCase().includes(searchText);
      const descriptionMatch = recipe.description.toLowerCase().includes(searchText);

      if (nameMatch || descriptionMatch) {
        if (!seenRecipes.has(recipe.id)) {
          searchResults.push({
            type: 'recipe',
            id: recipe.id,
            title: recipe.name,
            subtitle: `${recipe.prepTime + recipe.cookTime} min · ${recipe.cuisine}`,
            recipe,
            icon: <ChefHat className="w-5 h-5 text-[#6264A1]" />
          });
          seenRecipes.add(recipe.id);
        }
      }

      recipe.ingredients.forEach(ingredient => {
        if (ingredient.name.toLowerCase().includes(searchText)) {
          if (!seenRecipes.has(recipe.id)) {
            searchResults.push({
              type: 'ingredient',
              id: `${recipe.id}-ingredient`,
              title: recipe.name,
              subtitle: `Contains ${ingredient.name}`,
              recipe,
              icon: <Leaf className="w-5 h-5 text-[#6264A1]" />
            });
            seenRecipes.add(recipe.id);
          }
        }
      });
    });

    const dietaryOptions = [
      { key: 'vegetarian', label: 'Vegetarian', icon: <Leaf className="w-5 h-5 text-[#6264A1]" /> },
      { key: 'vegan', label: 'Vegan', icon: <Leaf className="w-5 h-5 text-[#6264A1]" /> },
      { key: 'glutenFree', label: 'Gluten Free', icon: <Wheat className="w-5 h-5 text-[#6264A1]" /> },
      { key: 'dairyFree', label: 'Dairy Free', icon: <Milk className="w-5 h-5 text-[#6264A1]" /> },
      { key: 'lowCarb', label: 'Low Carb', icon: <Droplets className="w-5 h-5 text-[#6264A1]" /> }
    ];

    dietaryOptions.forEach(option => {
      if (option.label.toLowerCase().includes(searchText)) {
        const matchingRecipes = sampleRecipes.filter(recipe => {
          const dietInfo = recipe.dietaryInfo;
          return dietInfo[option.key as keyof typeof dietInfo];
        });

        if (matchingRecipes.length > 0) {
          searchResults.push({
            type: 'dietary',
            id: `dietary-${option.key}`,
            title: option.label,
            subtitle: `${matchingRecipes.length} recipe${matchingRecipes.length !== 1 ? 's' : ''}`,
            icon: option.icon
          });
        }
      }
    });

    setResults(searchResults.slice(0, 8));
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.recipe) {
      onRecipeSelect(result.recipe);
      setQuery('');
      setIsOpen(false);
      setSelectedIndex(-1);
    } else if (result.type === 'dietary') {
      setQuery(result.title);
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div className="relative flex-1 max-w-3xl" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#465E5A]/50 w-5 h-5 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search recipes, ingredients, or dietary needs..."
          className="w-full pl-12 pr-10 py-3 bg-[#F4F6F7] border border-[#465E5A]/20 rounded-lg focus:outline-none focus:border-[#6264A1] focus:bg-white transition-all text-[#465E5A] placeholder:text-[#465E5A]/50"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-[#465E5A]/10 rounded-full transition-colors"
            aria-label="Clear search"
          >
            <X className="w-5 h-5 text-[#465E5A]/50" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-[#465E5A]/15 max-h-[70vh] overflow-y-auto z-50">
          <div className="py-2">
            {results.map((result, index) => (
              <button
                key={result.id}
                onClick={() => handleResultClick(result)}
                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-[#E5F2E4] transition-colors text-left ${
                  index === selectedIndex ? 'bg-[#E5F2E4]' : ''
                }`}
              >
                <div className="flex-shrink-0">
                  {result.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[#465E5A] truncate">
                    {result.title}
                  </div>
                  {result.subtitle && (
                    <div className="text-sm text-[#465E5A]/70 truncate">
                      {result.subtitle}
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {result.type === 'recipe' && result.recipe && (
                    <div className="flex items-center gap-1 text-xs text-[#465E5A]/60">
                      <Clock className="w-4 h-4" />
                      <span>{result.recipe.prepTime + result.recipe.cookTime}m</span>
                    </div>
                  )}
                  {result.type === 'dietary' && (
                    <div className="px-2 py-1 bg-[#6264A1]/10 text-[#6264A1] text-xs rounded-full">
                      Filter
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && query.trim() && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-[#465E5A]/15 z-50">
          <div className="px-4 py-8 text-center text-[#465E5A]/70">
            <Search className="w-8 h-8 mx-auto mb-2 text-[#465E5A]/30" />
            <p>No results found for "{query}"</p>
            <p className="text-sm mt-1">Try searching for recipes, ingredients, or dietary needs</p>
          </div>
        </div>
      )}
    </div>
  );
}
