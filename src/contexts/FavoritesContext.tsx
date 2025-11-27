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

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        loadFavorites();
      } else if (event === 'SIGNED_OUT') {
        setFavorites(new Set());
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadFavorites = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const { data, error } = await supabase
          .from('recipe_favorites')
          .select('recipe_id')
          .eq('user_id', session.user.id);

        if (error) {
          console.error('Error loading favorites:', error);
        } else if (data) {
          console.log('Loaded favorites:', data);
          setFavorites(new Set(data.map(f => f.recipe_id)));
        }
      } else {
        console.log('No user session, favorites not loaded');
      }
    } catch (error) {
      console.error('Error in loadFavorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async (recipeId: string) => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      // Show sign-in modal
      const event = new CustomEvent('show-auth-modal');
      window.dispatchEvent(event);
      return;
    }

    const recipeIdStr = String(recipeId);
    const isFavorite = favorites.has(recipeIdStr);

    if (isFavorite) {
      // Remove from favorites
      const { error } = await supabase
        .from('recipe_favorites')
        .delete()
        .eq('user_id', session.user.id)
        .eq('recipe_id', recipeIdStr);

      if (!error) {
        const newFavorites = new Set(favorites);
        newFavorites.delete(recipeIdStr);
        setFavorites(newFavorites);
      } else {
        console.error('Error removing favorite:', error);
      }
    } else {
      // Add to favorites
      const { error } = await supabase
        .from('recipe_favorites')
        .insert([
          { user_id: session.user.id, recipe_id: recipeIdStr }
        ]);

      if (!error) {
        const newFavorites = new Set(favorites);
        newFavorites.add(recipeIdStr);
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