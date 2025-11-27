import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User, Loader, Mic, AlertCircle } from 'lucide-react';
import { useHealthProfile } from '../contexts/HealthProfileContext';
import { sampleRecipes } from '../data/sampleData';
import { Recipe } from '../types';

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatBot({ isOpen, onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { profile } = useHealthProfile();
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        
        setInput(transcript);
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

  const getContextForGemini = () => {
    const healthContext = profile ? [
      `User's dietary preferences:`,
      `- Diet type: ${profile.dietType}`,
      profile.restrictions.length > 0 && `- Dietary restrictions: ${profile.restrictions.join(', ')}`,
      profile.allergies.length > 0 && `- Food allergies: ${profile.allergies.join(', ')}`,
      profile.customRestrictions.length > 0 && `- Foods to exclude from suggestions: ${profile.customRestrictions.join(', ')}`,
      profile.isOnGLP1 && `- On GLP-1 treatment: Yes`
    ].filter(Boolean).join('\n') : 'No health profile available.';

    const recipeContext = sampleRecipes.map(recipe => ({
      name: recipe.name,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      dietaryInfo: recipe.dietaryInfo,
      ingredients: recipe.ingredients.map(i => `${i.amount} ${i.unit} ${i.name}`).join(', ')
    }));

    return {
      healthProfile: healthContext,
      availableRecipes: recipeContext
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const context = getContextForGemini();
      
      const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${import.meta.env.VITE_GOOGLE_CLOUD_VISION_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: "model",
              parts: [{
                text: ` Here is the context you need:

                1. Health Profile:
                ${context.healthProfile}
                Start your answer with the health profile, allergies and ingredient exclusions you are considering. Help the user with their question:`
                }]
              },
              {
                role: "user",
                parts: [{
                  text: userMessage
                }]
              }
            ]
          })
        });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const assistantMessage = data.candidates[0]?.content?.parts[0]?.text || 'I apologize, but I am unable to provide a response at the moment.';
      
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I encountered an error while processing your request. Please try again later.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-6 w-96 max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden z-50">
      {/* Header - Fixed */}
      <div className="flex-none p-4 bg-racing text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <h3 className="font-medium">Nutrition Assistant</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Voice Error Message */}
      {voiceError && (
        <div className="p-4 bg-red-50 text-red-600 flex items-center gap-2">
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

      {/* Messages - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-racing-50 p-4">
            <Bot className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">
              Hi! I'm your personal nutrition assistant. I can help you find recipes that match your dietary preferences, provide nutrition advice, and share cooking tips.
            </p>
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-racing text-white flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5" />
              </div>
            )}
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-racing text-white rounded-br-none'
                  : 'bg-primary rounded-bl-none'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-royal text-white flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-racing text-white flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div className="max-w-[80%] p-4 rounded-2xl bg-primary rounded-bl-none">
              <Loader className="w-5 h-5 animate-spin text-racing" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - Fixed */}
      <form onSubmit={handleSubmit} className="flex-none p-4 border-t border-primary">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about recipes, nutrition, or cooking..."
              className="w-full pl-4 pr-12 py-2 rounded-full border-2 border-primary focus:outline-none focus:border-racing"
              disabled={isLoading}
            />
            {voiceSupported && (
              <button
                type="button"
                onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
                disabled={isLoading}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors ${
                  isListening 
                    ? 'bg-racing text-white animate-pulse'
                    : 'text-racing-50 hover:text-racing hover:bg-primary-25'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                title={isListening ? 'Stop voice input' : 'Start voice input'}
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
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2 bg-racing text-white rounded-full hover:bg-racing-75 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}