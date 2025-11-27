import { useState } from 'react';
import { Award, CheckCircle, Info } from 'lucide-react';

export type GlpSuitabilityLevel = 1 | 2 | 3;

interface GlpSuitabilityBadgeProps {
  level: GlpSuitabilityLevel;
  variant?: 'compact' | 'ribbon' | 'full';
  showDetails?: boolean;
}

export function GlpSuitabilityBadge({
  level,
  variant = 'full',
  showDetails = false
}: GlpSuitabilityBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const getLevelConfig = (level: GlpSuitabilityLevel) => {
    switch (level) {
      case 3:
        return {
          label: 'High GLP-1 Suitability',
          shortLabel: 'High',
          score: '★★★',
          color: '#2E7D32',
          bgColor: '#E8F5E9',
          accentColor: '#4CAF50',
          icon: Award,
          benefits: ['High protein 25g+', 'Perfect portions', 'Gentle on digestion'],
          description: 'Expertly crafted for GLP-1 users with optimal protein, portion control, and digestive comfort.',
        };
      case 2:
        return {
          label: 'Good GLP-1 Suitability',
          shortLabel: 'Good',
          score: '★★',
          color: '#F57C00',
          bgColor: '#FFF3E0',
          accentColor: '#FF9800',
          icon: CheckCircle,
          benefits: ['Moderate protein', 'Balanced portions', 'Easy to digest'],
          description: 'Well-suited for GLP-1 users with good nutritional balance and digestive friendliness.',
        };
      case 1:
        return {
          label: 'Basic GLP-1 Suitability',
          shortLabel: 'Basic',
          score: '★',
          color: '#0288D1',
          bgColor: '#E1F5FE',
          accentColor: '#03A9F4',
          icon: Info,
          benefits: ['Meets basic needs', 'Standard portions'],
          description: 'Suitable for GLP-1 users but may need adjustments for optimal results.',
        };
    }
  };

  const config = getLevelConfig(level);
  const Icon = config.icon;

  if (variant === 'compact') {
    return (
      <div
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
        style={{
          backgroundColor: config.bgColor,
          color: config.color,
        }}
      >
        <Icon className="w-3.5 h-3.5" />
        <span>{config.shortLabel}</span>
      </div>
    );
  }

  if (variant === 'ribbon') {
    return (
      <div
        className="relative px-3 py-1.5 text-xs font-medium text-white rounded-r-md"
        style={{ backgroundColor: config.color }}
      >
        <div className="flex items-center gap-1.5">
          <Icon className="w-4 h-4" />
          <span>{config.score}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className="px-3 py-2 rounded-lg border-2"
        style={{
          backgroundColor: config.bgColor,
          borderColor: config.accentColor,
        }}
      >
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5" style={{ color: config.color }} />
          <div>
            <div className="text-sm font-semibold" style={{ color: config.color }}>
              {config.label}
            </div>
            <div className="text-xs" style={{ color: config.color }}>
              {config.score}
            </div>
          </div>
        </div>
      </div>

      {showTooltip && showDetails && (
        <div className="absolute z-10 w-64 p-3 mt-2 bg-white rounded-lg shadow-xl border border-gray-200">
          <p className="text-sm text-gray-700 mb-2">{config.description}</p>
          <ul className="space-y-1">
            {config.benefits.map((benefit, index) => (
              <li key={index} className="text-xs text-gray-600 flex items-start gap-1.5">
                <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: config.color }} />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
