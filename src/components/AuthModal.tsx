import React, { useState } from 'react';
import { X, Mail, Lock, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  if (!isOpen) return null;

  const checkNetworkConnection = () => {
    return navigator.onLine;
  };

  const handleAuthRequest = async (authFn: () => Promise<any>, maxRetries = 3): Promise<any> => {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const result = await authFn();
        if (!result.error) {
          return result;
        }
        lastError = result.error;
        
        // Don't retry for invalid credentials
        if (result.error.message.includes('Invalid login credentials')) {
          throw result.error;
        }
      } catch (error) {
        lastError = error as Error;
        if (error instanceof Error && error.message.includes('Invalid login credentials')) {
          throw error;
        }
      }
      
      // Exponential backoff delay
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
    
    throw lastError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!checkNetworkConnection()) {
      setError('No internet connection. Please check your network and try again.');
      return;
    }

    setIsLoading(true);
    setRetryCount(0);

    try {
      if (isSignUp) {
        await handleAuthRequest(() => 
          supabase.auth.signUp({ 
            email, 
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`
            }
          })
        );
        setError('Please check your email to confirm your account before signing in.');
      } else {
        await handleAuthRequest(() => 
          supabase.auth.signInWithPassword({ email, password })
        );
        onSuccess?.();
        onClose();
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          setError('Unable to connect to the authentication server. Please check your internet connection and try again in a few moments.');
        } else if (err.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.');
        } else if (err.message.includes('Email not confirmed')) {
          setError('Please check your email to confirm your account before signing in.');
        } else if (err.message.includes('rate limit')) {
          setError('Too many attempts. Please wait a few minutes before trying again.');
        } else if (err.message.includes('Service unavailable')) {
          setError('The authentication service is temporarily unavailable. Please try again in a few moments.');
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-racing">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 -m-2 text-racing-50 hover:text-racing rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-racing-75 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-racing-50 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 rounded-lg border-2 border-primary focus:outline-none focus:ring-2 focus:ring-racing focus:border-racing"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-racing-75 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-racing-50 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 rounded-lg border-2 border-primary focus:outline-none focus:ring-2 focus:ring-racing focus:border-racing"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 bg-racing text-white rounded-lg hover:bg-racing-75 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>

            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full text-sm text-racing hover:text-royal transition-colors"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}