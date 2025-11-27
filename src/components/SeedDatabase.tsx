import { useState } from 'react';
import { seedRecipes } from '../lib/seed-recipes';

export function SeedDatabase() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [result, setResult] = useState<{ successCount: number; errorCount: number } | null>(null);

  const handleSeed = async () => {
    setIsSeeding(true);
    setResult(null);
    try {
      const result = await seedRecipes();
      setResult(result);
    } catch (error) {
      console.error('Seeding failed:', error);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <h3 className="text-lg font-semibold mb-2">Database Seeding</h3>
      <button
        onClick={handleSeed}
        disabled={isSeeding}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isSeeding ? 'Seeding...' : 'Seed Recipes Database'}
      </button>
      {result && (
        <div className="mt-2 text-sm">
          <p className="text-green-600">Success: {result.successCount}</p>
          <p className="text-red-600">Errors: {result.errorCount}</p>
        </div>
      )}
    </div>
  );
}
