import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Initialize Supabase client
const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export async function toggleRecipeLike(recipeId: string): Promise<{ 
  success: boolean; 
  likes: number; 
  isLiked: boolean;
  error?: string;
}> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error('User must be authenticated to like recipes');
    }

    const userId = session.user.id;

    // Check if user has already liked this recipe
    const { data: existingLike } = await supabase
      .from('recipe_likes')
      .select()
      .eq('recipe_id', recipeId)
      .eq('user_id', userId)
      .single();

    let isLiked: boolean;
    
    if (existingLike) {
      // Unlike: Remove the like
      await supabase
        .from('recipe_likes')
        .delete()
        .eq('recipe_id', recipeId)
        .eq('user_id', userId);
      
      isLiked = false;
    } else {
      // Like: Add new like
      await supabase
        .from('recipe_likes')
        .insert([
          { recipe_id: recipeId, user_id: userId }
        ]);
      
      isLiked = true;
    }

    // Get updated like count
    const { count } = await supabase
      .from('recipe_likes')
      .select('*', { count: 'exact', head: true })
      .eq('recipe_id', recipeId);

    return {
      success: true,
      likes: count || 0,
      isLiked
    };
  } catch (error) {
    console.error('Error toggling recipe like:', error);
    return {
      success: false,
      likes: 0,
      isLiked: false,
      error: error instanceof Error ? error.message : 'An error occurred while updating like'
    };
  }
}

export async function getRecipeLikeStatus(recipeId: string): Promise<{
  isLiked: boolean;
  likes: number;
}> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    // Get total likes count
    const { count: totalLikes } = await supabase
      .from('recipe_likes')
      .select('*', { count: 'exact', head: true })
      .eq('recipe_id', recipeId);

    // If user is not authenticated, return only the total likes
    if (!session?.user) {
      return {
        isLiked: false,
        likes: totalLikes || 0
      };
    }

    // Check if user has liked this recipe
    const { data: userLike } = await supabase
      .from('recipe_likes')
      .select()
      .eq('recipe_id', recipeId)
      .eq('user_id', session.user.id)
      .single();

    return {
      isLiked: !!userLike,
      likes: totalLikes || 0
    };
  } catch (error) {
    console.error('Error getting recipe like status:', error);
    return {
      isLiked: false,
      likes: 0
    };
  }
}