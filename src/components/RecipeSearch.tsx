import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X, Clock, ChefHat, Globe, AlertCircle, Filter, Mic, Loader2 } from 'lucide-react';
import { Recipe } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { sampleRecipes } from '../data/sampleData';

interface SearchProps {
  isOpen: boolean;
  onClose: () => void;
  onResultSelect: (recipe: Recipe) => void;
}

type SortOption = 'relevance' | 'rating' | 'time';

interface SearchFilters {
  dietary: string[];
  cookingTime: number | null;
  difficulty: string | null;
  cuisine: string | null;
}

export function RecipeSearch({ isOpen, onClose, onResultSelect }: SearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Recipe[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [filters, setFilters] = useState<SearchFilters>({
    dietary: [],
    cookingTime: null,
    difficulty: null,
    cuisine: null
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setVoiceSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true; // Enable continuous recording
      recognitionRef.current.interimResults = true; // Get interim results
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        // Get the latest result (continuous mode can have multiple results)
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');
        
        setQuery(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        setVoiceError('Error recognizing speech. Please try again.');
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        // Only set isListening to false if we're not in continuous mode
        // or if there was an error
        if (!recognitionRef.current?.continuous) {
          setIsListening(false);
        } else if (isListening) {
          // If we're still supposed to be listening but recognition ended,
          // restart it (this can happen due to network issues or timeouts)
          try {
            recognitionRef.current?.start();
          } catch (error) {
            setVoiceError('Recognition stopped unexpectedly. Please try again.');
            setIsListening(false);
          }
        }
      };
    }
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setSuggestions([]);
      setShowSuggestions(false);
      setShowFilters(false);
      setIsListening(false);
      
      // Make sure to stop recognition when closing the search
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && debouncedQuery) {
      performSearch();
    }
  }, [debouncedQuery, filters, sortBy, isOpen]);

  // Handle clicks outside search suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const startVoiceRecognition = () => {
    if (!recognitionRef.current) return;

    setVoiceError(null);
    setIsListening(true);
    try {
      recognitionRef.current.start();
    } catch (error) {
      setVoiceError('Error starting voice recognition. Please try again.');
      setIsListening(false);
    }
  };

  const stopVoiceRecognition = () => {
    if (!recognitionRef.current) return;

    recognitionRef.current.stop();
    setIsListening(false);
  };

  const performSearch = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Search in sample data
      let searchResults = sampleRecipes;

      if (debouncedQuery) {
        const searchText = debouncedQuery.toLowerCase();
        searchResults = searchResults.filter(recipe => {
          const nameMatch = recipe.name.toLowerCase().includes(searchText);
          const descriptionMatch = recipe.description.toLowerCase().includes(searchText);
          const ingredientMatch = recipe.ingredients.some(ing => 
            ing.name.toLowerCase().includes(searchText)
          );
          return nameMatch || descriptionMatch || ingredientMatch;
        });
      }

      // Apply filters
      if (filters.dietary.length > 0) {
        searchResults = searchResults.filter(recipe => {
          return filters.dietary.every(diet => {
            switch (diet.toLowerCase()) {
              case 'vegetarian':
                return recipe.dietaryInfo.vegetarian;
              case 'vegan':
                return recipe.dietaryInfo.vegan;
              case 'gluten free':
                return recipe.dietaryInfo.glutenFree;
              case 'dairy free':
                return recipe.dietaryInfo.dairyFree;
              default:
                return true;
            }
          });
        });
      }

      if (filters.cookingTime) {
        searchResults = searchResults.filter(recipe => 
          (recipe.prepTime + recipe.cookTime) <= filters.cookingTime
        );
      }

      if (filters.difficulty) {
        searchResults = searchResults.filter(recipe => 
          recipe.difficulty === filters.difficulty
        );
      }

      if (filters.cuisine) {
        searchResults = searchResults.filter(recipe => 
          recipe.cuisine.toLowerCase() === filters.cuisine.toLowerCase()
        );
      }

      // Apply sorting
      searchResults.sort((a, b) => {
        switch (sortBy) {
          case 'rating':
            return b.likes - a.likes;
          case 'time':
            return (a.prepTime + a.cookTime) - (b.prepTime + b.cookTime);
          case 'relevance':
          default:
            const aNameMatch = a.name.toLowerCase().includes(debouncedQuery.toLowerCase());
            const bNameMatch = b.name.toLowerCase().includes(debouncedQuery.toLowerCase());
            if (aNameMatch && !bNameMatch) return -1;
            if (!aNameMatch && bNameMatch) return 1;
            return b.likes - a.likes;
        }
      });

      setResults(searchResults);

      // Update URL with search params
      const searchParams = new URLSearchParams(window.location.search);
      if (debouncedQuery) {
        searchParams.set('q', debouncedQuery);
      } else {
        searchParams.delete('q');
      }
      window.history.replaceState(null, '', `?${searchParams.toString()}`);

      // Update suggestions
      if (debouncedQuery) {
        const newSuggestions = sampleRecipes
          .map(recipe => recipe.name)
          .filter(name => 
            name.toLowerCase().includes(debouncedQuery.toLowerCase())
          )
          .slice(0, 5);
        setSuggestions(newSuggestions);
      } else {
        setSuggestions([]);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    performSearch();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    performSearch();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl my-8" ref={searchRef}>
        <div className="p-6">
          {/* Search Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-racing">Search Recipes</h2>
            <button
              onClick={onClose}
              className="p-2 -m-2 text-racing-50 hover:text-racing rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Voice Search Error */}
          {voiceError && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{voiceError}</span>
              <button 
                onClick={() => setVoiceError(null)}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="relative mb-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-racing-50 w-5 h-5" />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={handleQueryChange}
                  placeholder="Search recipes by name, ingredients, or description..."
                  className="w-full pl-12 pr-16 py-3 rounded-lg border-2 border-primary focus:outline-none focus:ring-2 focus:ring-racing focus:border-racing transition-colors"
                  autoComplete="off"
                />
                {voiceSupported && (
                  <button
                    type="button"
                    onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors ${
                      isListening 
                        ? 'bg-racing text-white animate-pulse'
                        : 'text-racing-50 hover:text-racing hover:bg-primary'
                    }`}
                    title={isListening ? 'Stop voice search' : 'Start voice search'}
                  >
                    {isListening ? (
                      <Mic className="w-5 h-5" />
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border-2 border-primary hover:border-racing text-racing rounded-lg transition-colors flex items-center gap-2"
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </button>
            </div>

            {/* Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-primary z-10">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-2 text-left hover:bg-primary-25 transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </form>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mb-6 p-4 bg-primary-25 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-racing">Sort & Filter</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-1.5 rounded-lg border-2 border-primary bg-white text-sm"
                >
                  <option value="relevance">Sort by Relevance</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="time">Sort by Time</option>
                </select>
              </div>

              {/* Active Filters */}
              {(filters.dietary.length > 0 || filters.difficulty || filters.cookingTime) && (
                <div className="flex flex-wrap gap-2">
                  {filters.dietary.map((diet) => (
                    <span key={diet} className="px-3 py-1 bg-racing text-white text-sm rounded-full">
                      {diet}
                    </span>
                  ))}
                  {filters.difficulty && (
                    <span className="px-3 py-1 bg-racing text-white text-sm rounded-full capitalize">
                      {filters.difficulty}
                    </span>
                  )}
                  {filters.cookingTime && (
                    <span className="px-3 py-1 bg-racing text-white text-sm rounded-full">
                      Under {filters.cookingTime} min
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Search Results */}
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-racing border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-racing-75">Searching recipes...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <AlertCircle className="w-8 h-8 mx-auto mb-2" />
              <p>{error}</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 text-racing-75">
              <AlertCircle className="w-8 h-8 mx-auto mb-2" />
              <p>No recipes found matching your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => onResultSelect(recipe)}
                  className="flex gap-4 p-4 rounded-lg border-2 border-primary hover:border-racing text-left transition-all"
                >
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-racing mb-1 line-clamp-1">
                      {recipe.name}
                    </h3>
                    <p className="text-sm text-racing-75 mb-2 line-clamp-2">
                      {recipe.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-racing-50">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{recipe.prepTime + recipe.cookTime} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ChefHat className="w-4 h-4" />
                        <span className="capitalize">{recipe.difficulty}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        <span>{recipe.cuisine}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}