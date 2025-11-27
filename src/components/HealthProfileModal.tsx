import { useState } from 'react';
import { X, AlertCircle, Info, Check } from 'lucide-react';
import { DietType, DietaryRestriction, HealthProfile, NutritionalPreference } from '../types';
import { useHealthProfile } from '../contexts/HealthProfileContext';

interface HealthProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: Partial<HealthProfile>) => void;
}

const dietTypes: { value: DietType; label: string; emoji: string; description: string }[] = [
  { value: 'omnivore', label: 'Omnivore', emoji: '🍽️', description: 'Includes both plant and animal products' },
  { value: 'vegetarian', label: 'Vegetarian', emoji: '🥗', description: 'Excludes meat and fish' },
  { value: 'vegan', label: 'Vegan', emoji: '🌱', description: 'Excludes all animal products' },
  { value: 'pescatarian', label: 'Pescatarian', emoji: '🐟', description: 'Includes fish, no other meat' },
];

const faithDiets = [
  { value: 'kosher', label: 'Kosher', emoji: '✡️' },
  { value: 'halal', label: 'Halal', emoji: '☪️' },
  { value: 'hindu', label: 'Hindu', emoji: '🕉️' },
];

const healthPreferences = [
  { value: 'low-sodium', label: 'Low Sodium', emoji: '🧂' },
  { value: 'low-sugar', label: 'Low Sugar', emoji: '🍬' },
  { value: 'high-protein', label: 'High Protein', emoji: '🥩' },
  { value: 'high-fibre', label: 'High Fibre', emoji: '🌾' },
  { value: 'low-carb', label: 'Low Carb', emoji: '🥖' },
];

const commonAllergens = [
  'Peanuts', 'Tree Nuts', 'Dairy', 'Eggs', 'Soy', 'Wheat', 'Fish', 'Shellfish', 'Sesame'
];

const symptoms = [
  { value: 'nausea', label: 'Nausea', emoji: '🤢' },
  { value: 'reflux', label: 'Reflux/Heartburn', emoji: '🔥' },
  { value: 'constipation', label: 'Constipation', emoji: '😰' },
  { value: 'diarrhoea', label: 'Diarrhoea', emoji: '💨' },
  { value: 'bloating', label: 'Bloating', emoji: '🎈' },
  { value: 'fatigue', label: 'Fatigue', emoji: '😴' },
];

export function HealthProfileModal({ isOpen, onClose }: HealthProfileModalProps) {
  const { profile: currentProfile, updateProfile } = useHealthProfile();
  const [activeTab, setActiveTab] = useState<'diet' | 'health' | 'treatment'>('diet');
  const [dietType, setDietType] = useState<DietType>(currentProfile?.dietType || 'omnivore');
  const [restrictions, setRestrictions] = useState<DietaryRestriction[]>(
    currentProfile?.restrictions || []
  );
  const [allergies, setAllergies] = useState<string[]>(currentProfile?.allergies || []);
  const [customRestrictions, setCustomRestrictions] = useState<string[]>(
    currentProfile?.customRestrictions || []
  );
  const [healthPrefs, setHealthPrefs] = useState<string[]>([]);
  const [currentSymptoms, setCurrentSymptoms] = useState<string[]>([]);
  const [isOnGLP1, setIsOnGLP1] = useState(currentProfile?.isOnGLP1 || false);
  const [glp1Medication, setGlp1Medication] = useState('');
  const [weeksSinceStart, setWeeksSinceStart] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      await updateProfile({
        dietType,
        restrictions,
        allergies,
        customRestrictions,
        nutritionalPreferences: healthPrefs as NutritionalPreference[],
        isOnGLP1,
      });

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleRestriction = (restriction: DietaryRestriction) => {
    setRestrictions(prev =>
      prev.includes(restriction)
        ? prev.filter(r => r !== restriction)
        : [...prev, restriction]
    );
  };

  const toggleAllergy = (allergy: string) => {
    setAllergies(prev =>
      prev.includes(allergy)
        ? prev.filter(a => a !== allergy)
        : [...prev, allergy]
    );
  };

  const toggleHealthPref = (pref: string) => {
    setHealthPrefs(prev =>
      prev.includes(pref)
        ? prev.filter(p => p !== pref)
        : [...prev, pref]
    );
  };

  const toggleSymptom = (symptom: string) => {
    setCurrentSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-3xl my-8">
        <div className="sticky top-0 bg-white border-b border-[#465E5A]/15 rounded-t-lg z-10">
          <div className="flex items-center justify-between p-6">
            <div>
              <h2 className="text-2xl font-bold text-[#465E5A]">My Health Profile</h2>
              <p className="text-sm text-[#465E5A]/60 mt-1">
                Personalize your nutrition experience
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#465E5A]/60 hover:text-[#465E5A] hover:bg-[#F4F6F7] rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex gap-2 px-6 pb-4">
            <button
              onClick={() => setActiveTab('diet')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'diet'
                  ? 'bg-[#6264A1] text-white'
                  : 'text-[#465E5A]/60 hover:bg-[#F4F6F7]'
              }`}
            >
              Diet & Allergies
            </button>
            <button
              onClick={() => setActiveTab('health')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'health'
                  ? 'bg-[#6264A1] text-white'
                  : 'text-[#465E5A]/60 hover:bg-[#F4F6F7]'
              }`}
            >
              Health & Nutrition
            </button>
            <button
              onClick={() => setActiveTab('treatment')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'treatment'
                  ? 'bg-[#6264A1] text-white'
                  : 'text-[#465E5A]/60 hover:bg-[#F4F6F7]'
              }`}
            >
              GLP-1 Treatment
            </button>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-8">
            {activeTab === 'diet' && (
              <>
                {/* Core Diet Type */}
                <div>
                  <h3 className="text-lg font-semibold text-[#465E5A] mb-1">Core Diet Type</h3>
                  <p className="text-sm text-[#465E5A]/60 mb-4">
                    Select your primary dietary approach
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {dietTypes.map(({ value, label, emoji, description }) => (
                      <button
                        key={value}
                        onClick={() => setDietType(value)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          dietType === value
                            ? 'border-[#6264A1] bg-[#9697C0]/10'
                            : 'border-[#465E5A]/15 hover:border-[#6264A1]/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{emoji}</span>
                          <div className="flex-1">
                            <div className="font-medium text-[#465E5A]">{label}</div>
                            <div className="text-xs text-[#465E5A]/60 mt-0.5">{description}</div>
                          </div>
                          {dietType === value && (
                            <Check className="w-5 h-5 text-[#6264A1]" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Faith-Based Diets */}
                <div>
                  <h3 className="text-lg font-semibold text-[#465E5A] mb-1">
                    Faith-Based & Ethical Preferences
                  </h3>
                  <p className="text-sm text-[#465E5A]/60 mb-4">Optional dietary guidelines</p>
                  <div className="flex flex-wrap gap-2">
                    {faithDiets.map(({ value, label, emoji }) => (
                      <button
                        key={value}
                        onClick={() => toggleRestriction(value as DietaryRestriction)}
                        className={`px-4 py-2 rounded-full border-2 transition-all ${
                          restrictions.includes(value as DietaryRestriction)
                            ? 'border-[#6264A1] bg-[#6264A1] text-white'
                            : 'border-[#465E5A]/15 text-[#465E5A] hover:border-[#6264A1]/50'
                        }`}
                      >
                        <span className="mr-2">{emoji}</span>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Allergens */}
                <div>
                  <h3 className="text-lg font-semibold text-[#465E5A] mb-1">
                    Allergens & Intolerances
                  </h3>
                  <p className="text-sm text-[#465E5A]/60 mb-4">
                    Select any foods you're allergic to or intolerant of
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {commonAllergens.map(allergen => (
                      <button
                        key={allergen}
                        onClick={() => toggleAllergy(allergen)}
                        className={`px-4 py-2 rounded-full border-2 transition-all ${
                          allergies.includes(allergen)
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-[#465E5A]/15 text-[#465E5A] hover:border-red-300'
                        }`}
                      >
                        {allergen}
                        {allergies.includes(allergen) && (
                          <AlertCircle className="w-4 h-4 inline-block ml-1.5" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'health' && (
              <>
                {/* Health & Nutrition Preferences */}
                <div>
                  <h3 className="text-lg font-semibold text-[#465E5A] mb-1">
                    Health & Nutrition Preferences
                  </h3>
                  <p className="text-sm text-[#465E5A]/60 mb-4">
                    Customize recommendations based on your goals
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {healthPreferences.map(({ value, label, emoji }) => (
                      <button
                        key={value}
                        onClick={() => toggleHealthPref(value)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          healthPrefs.includes(value)
                            ? 'border-[#6264A1] bg-[#9697C0]/10'
                            : 'border-[#465E5A]/15 hover:border-[#6264A1]/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{emoji}</span>
                          <div className="flex-1">
                            <div className="font-medium text-[#465E5A]">{label}</div>
                          </div>
                          {healthPrefs.includes(value) && (
                            <Check className="w-5 h-5 text-[#6264A1]" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Current Symptoms */}
                <div>
                  <h3 className="text-lg font-semibold text-[#465E5A] mb-1">
                    Current Symptoms
                  </h3>
                  <p className="text-sm text-[#465E5A]/60 mb-4">
                    Help us recommend meals that may ease these symptoms
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {symptoms.map(({ value, label, emoji }) => (
                      <button
                        key={value}
                        onClick={() => toggleSymptom(value)}
                        className={`px-4 py-2 rounded-full border-2 transition-all ${
                          currentSymptoms.includes(value)
                            ? 'border-[#6264A1] bg-[#6264A1] text-white'
                            : 'border-[#465E5A]/15 text-[#465E5A] hover:border-[#6264A1]/50'
                        }`}
                      >
                        <span className="mr-2">{emoji}</span>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'treatment' && (
              <>
                {/* GLP-1 Treatment */}
                <div>
                  <h3 className="text-lg font-semibold text-[#465E5A] mb-1">
                    GLP-1 Medication
                  </h3>
                  <p className="text-sm text-[#465E5A]/60 mb-4">
                    Help us tailor portions and meal recommendations
                  </p>

                  <label className="flex items-start gap-3 p-4 rounded-lg border-2 border-[#465E5A]/15 hover:border-[#6264A1]/50 cursor-pointer transition-colors mb-4">
                    <input
                      type="checkbox"
                      checked={isOnGLP1}
                      onChange={(e) => setIsOnGLP1(e.target.checked)}
                      className="mt-1 w-5 h-5 text-[#6264A1] rounded focus:ring-[#6264A1]"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-[#465E5A]">
                        I'm currently taking GLP-1 medication
                      </div>
                      <div className="text-sm text-[#465E5A]/60 mt-1">
                        This helps us recommend appropriate portion sizes and digestive-friendly meals
                      </div>
                    </div>
                  </label>

                  {isOnGLP1 && (
                    <div className="space-y-4 pl-8">
                      <div>
                        <label className="block text-sm font-medium text-[#465E5A] mb-2">
                          Medication Type (Optional)
                        </label>
                        <input
                          type="text"
                          value={glp1Medication}
                          onChange={(e) => setGlp1Medication(e.target.value)}
                          placeholder="e.g., Ozempic, Wegovy, Mounjaro"
                          className="w-full px-4 py-2 rounded-lg border border-[#465E5A]/15 focus:outline-none focus:ring-2 focus:ring-[#6264A1] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#465E5A] mb-2">
                          Weeks Since Starting (Optional)
                        </label>
                        <input
                          type="number"
                          value={weeksSinceStart}
                          onChange={(e) => setWeeksSinceStart(e.target.value)}
                          placeholder="Enter number of weeks"
                          className="w-full px-4 py-2 rounded-lg border border-[#465E5A]/15 focus:outline-none focus:ring-2 focus:ring-[#6264A1] focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Info Box */}
                <div className="p-4 bg-[#C5DFF2]/30 border border-[#C5DFF2] rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-[#6264A1] mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-[#465E5A] mb-1">
                        Privacy & Security
                      </h4>
                      <p className="text-sm text-[#465E5A]/70">
                        Your health information is encrypted and never shared with third parties.
                        We use it only to personalize your nutrition recommendations.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-[#465E5A]/15">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 px-6 py-3 rounded-lg border-2 border-[#465E5A]/15 text-[#465E5A] hover:bg-[#F4F6F7] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 px-6 py-3 rounded-lg bg-[#6264A1] text-white hover:bg-[#465E5A] transition-colors disabled:opacity-50 font-medium"
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
