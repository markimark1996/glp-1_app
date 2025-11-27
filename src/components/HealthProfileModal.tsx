import React, { useState } from 'react';
import { X, AlertCircle, Info, Lock } from 'lucide-react';
import { DietType, DietaryRestriction, HealthProfile, NutritionalPreference } from '../types';
import { useHealthProfile } from '../contexts/HealthProfileContext';

interface HealthProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: Partial<HealthProfile>) => void;
}

const dietTypes: { value: DietType; label: string; description: string }[] = [
  {
    value: 'omnivore',
    label: 'Omnivore',
    description: 'Includes both plant and animal products'
  },
  {
    value: 'vegetarian',
    label: 'Vegetarian',
    description: 'Excludes meat and fish, includes dairy and eggs'
  },
  {
    value: 'vegan',
    label: 'Vegan',
    description: 'Excludes all animal products'
  },
  {
    value: 'pescatarian',
    label: 'Pescatarian',
    description: 'Includes fish but excludes other meats'
  }
];

const dietaryRestrictions: { value: DietaryRestriction; label: string }[] = [
  { value: 'gluten-free', label: 'Gluten-Free' },
  { value: 'dairy-free', label: 'Dairy-Free' },
  { value: 'nut-free', label: 'Nut-Free' },
  { value: 'kosher', label: 'Kosher' },
  { value: 'halal', label: 'Halal' }
];

export function HealthProfileModal({ isOpen, onClose }: HealthProfileModalProps) {
  const { profile: currentProfile, updateProfile } = useHealthProfile();
  const [dietType, setDietType] = useState<DietType>(currentProfile?.dietType || 'omnivore');
  const [restrictions, setRestrictions] = useState<DietaryRestriction[]>(
    currentProfile?.restrictions || []
  );
  const [allergies, setAllergies] = useState<string[]>(currentProfile?.allergies || []);
  const [newAllergy, setNewAllergy] = useState('');
  const [customRestrictions, setCustomRestrictions] = useState<string[]>(
    currentProfile?.customRestrictions || []
  );
  const [newCustomRestriction, setNewCustomRestriction] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [nutritionalPreferences] = useState<NutritionalPreference[]>(
    currentProfile?.nutritionalPreferences || []
  );
  const [error, setError] = useState<string | null>(null);
  const [isOnGLP1, setIsOnGLP1] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      setError(null);
      
      if (showConfirm) {
        await updateProfile({
          dietType,
          restrictions,
          allergies,
          customRestrictions,
          nutritionalPreferences,
          isOnGLP1
        });
        onClose();
      } else {
        setShowConfirm(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
      setShowConfirm(false);
    }
  };

  const handleAddAllergy = () => {
    if (newAllergy.trim() && !allergies.includes(newAllergy.trim())) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy('');
    }
  };

  const handleAddCustomRestriction = () => {
    if (newCustomRestriction.trim() && !customRestrictions.includes(newCustomRestriction.trim())) {
      setCustomRestrictions([...customRestrictions, newCustomRestriction.trim()]);
      setNewCustomRestriction('');
    }
  };

  const handleRestrictionToggle = (restriction: DietaryRestriction) => {
    if (restrictions.includes(restriction)) {
      setRestrictions(restrictions.filter(r => r !== restriction));
    } else {
      setRestrictions([...restrictions, restriction]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl my-8">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-racing">My Health Profile</h2>
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

          <div className="space-y-8">
            {/* Diet Type Selection */}
            <div>
              <h3 className="text-lg font-semibold text-racing mb-4">Core Diet Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dietTypes.map(({ value, label, description }) => (
                  <button
                    key={value}
                    onClick={() => setDietType(value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      dietType === value
                        ? 'border-racing bg-racing text-white'
                        : 'border-primary hover:border-racing text-racing'
                    }`}
                  >
                    <div className="font-medium">{label}</div>
                    <div className={`text-sm mt-1 ${dietType === value ? 'text-white/80' : 'text-racing-50'}`}>
                      {description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary Restrictions */}
            <div>
              <h3 className="text-lg font-semibold text-racing mb-4">Dietary Restrictions</h3>
              <div className="flex flex-wrap gap-3">
                {dietaryRestrictions.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => handleRestrictionToggle(value)}
                    className={`px-4 py-2 rounded-full border-2 transition-all ${
                      restrictions.includes(value)
                        ? 'border-racing bg-racing text-white'
                        : 'border-primary hover:border-racing text-racing'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* GLP-1 Treatment */}
            <div>
              <h3 className="text-lg font-semibold text-racing mb-4">Treatment Information</h3>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-primary hover:border-racing transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isOnGLP1}
                    onChange={(e) => setIsOnGLP1(e.target.checked)}
                    className="w-4 h-4 text-racing rounded focus:ring-racing"
                  />
                  <span className="text-racing">GLP-1 Treatment</span>
                </label>
                <div className="text-sm text-racing-50">
                  <Info className="w-4 h-4 inline-block mr-1" />
                  This helps us tailor portion sizes and meal recommendations
                </div>
              </div>
            </div>

            {/* Allergies */}
            <div>
              <h3 className="text-lg font-semibold text-racing mb-4">Food Allergies</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {allergies.map((allergy, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-primary rounded-full text-racing"
                  >
                    <AlertCircle className="w-4 h-4 text-racing-50" />
                    {allergy}
                    <button
                      onClick={() => setAllergies(allergies.filter((_, i) => i !== index))}
                      className="p-1 -mr-1 text-racing-50 hover:text-racing rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  placeholder="Add allergy..."
                  className="flex-1 px-4 py-2 rounded-lg border-2 border-primary focus:outline-none focus:ring-2 focus:ring-racing focus:border-racing"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddAllergy()}
                />
                <button
                  onClick={handleAddAllergy}
                  className="px-4 py-2 bg-racing text-white rounded-lg hover:bg-racing-75"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Custom Restrictions */}
            <div>
              <h3 className="text-lg font-semibold text-racing mb-4">Custom Restrictions</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {customRestrictions.map((restriction, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-primary rounded-full text-racing"
                  >
                    {restriction}
                    <button
                      onClick={() => setCustomRestrictions(customRestrictions.filter((_, i) => i !== index))}
                      className="p-1 -mr-1 text-racing-50 hover:text-racing rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCustomRestriction}
                  onChange={(e) => setNewCustomRestriction(e.target.value)}
                  placeholder="Add custom restriction..."
                  className="flex-1 px-4 py-2 rounded-lg border-2 border-primary focus:outline-none focus:ring-2 focus:ring-racing focus:border-racing"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustomRestriction()}
                />
                <button
                  onClick={handleAddCustomRestriction}
                  className="px-4 py-2 bg-racing text-white rounded-lg hover:bg-racing-75"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Confirmation Section */}
          {showConfirm && (
            <div className="mt-6 p-4 bg-primary-25 rounded-xl border-2 border-racing">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-racing mt-0.5" />
                <div>
                  <h4 className="font-medium text-racing">Confirm Your Changes</h4>
                  <p className="text-sm text-racing-75 mt-1">
                    These preferences will be used to personalize your recipe recommendations and generate alerts for non-compliant ingredients.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border-2 border-racing text-racing hover:bg-racing-25 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 rounded-lg bg-racing text-white hover:bg-racing-75 transition-colors"
            >
              {showConfirm ? 'Confirm & Save' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}