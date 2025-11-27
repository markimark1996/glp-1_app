import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Ensure the URL uses HTTPS and remove any trailing slashes
const secureSupabaseUrl = supabaseUrl.replace(/\/$/, '').replace(/^http:/, 'https:');

if (!secureSupabaseUrl.startsWith('https://')) {
  throw new Error('Supabase URL must use HTTPS protocol');
}

// Implement retry logic for fetch requests
async function retryFetch(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'same-origin', // Changed from 'include' to 'same-origin'
        mode: 'cors',
        headers: {
          ...options?.headers,
          'Cache-Control': 'no-cache',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      
      // Only retry on network errors or 503 status
      if (response.status !== 503) {
        return response;
      }
      
      lastError = new Error(`Service unavailable (attempt ${attempt + 1} of ${maxRetries})`);
    } catch (error) {
      lastError = error as Error;
      // Add exponential backoff delay
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }
  
  throw lastError;
}

export const supabase = createClient<Database>(secureSupabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage,
    storageKey: 'supabase.auth.token',
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  },
  httpOptions: {
    fetch: retryFetch,
    timeout: 30000
  }
});

// Add a network status check utility
export const checkNetworkStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${secureSupabaseUrl}/rest/v1/`, {
      method: 'HEAD',
      headers: {
        'apikey': supabaseAnonKey,
      }
    });
    return response.ok;
  } catch {
    return false;
  }
};