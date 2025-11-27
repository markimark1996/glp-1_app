import React, { createContext, useContext, useState, useEffect } from 'react';
import { Recipe } from '../types';
import { supabase } from '../lib/supabase';

interface FavoritesContextType {
  favorites: Set<string>;
  toggleFavorite: (recipeId: string) => Promise<void>;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      const { data, error } = await supabase
        .from('recipe_favorites')
        .select('recipe_id')
        .eq('user_id', session.user.id);

      if (!error && data) {
        setFavorites(new Set(data.map(f => f.recipe_id)));
      }
    }
    
    setIsLoading(false);
  };

  const toggleFavorite = async (recipeId: string) => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      // Show sign-in modal
      const event = new CustomEvent('show-auth-modal');
      window.dispatchEvent(event);
      return;
    }

    const isFavorite = favorites.has(recipeId);

    if (isFavorite) {
      // Remove from favorites
      const { error } = await supabase
        .from('recipe_favorites')
        .delete()
        .eq('user_id', session.user.id)
        .eq('recipe_id', recipeId);

      if (!error) {
        const newFavorites = new Set(favorites);
        newFavorites.delete(recipeId);
        setFavorites(newFavorites);
      } else {
        console.error('Error removing favorite:', error);
      }
    } else {
      // Add to favorites
      const { error } = await supabase
        .from('recipe_favorites')
        .insert([
          { user_id: session.user.id, recipe_id: recipeId }
        ]);

      if (!error) {
        const newFavorites = new Set(favorites);
        newFavorites.add(recipeId);
        setFavorites(newFavorites);
      } else {
        console.error('Error adding favorite:', error);
      }
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isLoading }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}