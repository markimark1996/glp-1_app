interface CircularProgressProps {
  current: number;
  target: number;
  label: string;
  unit: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function CircularProgress({
  current,
  target,
  label,
  unit,
  size = 140,
  strokeWidth = 10,
  color = '#6264A1'
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((current / target) * 100, 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getStatusColor = () => {
    if (percentage >= 100) return '#2D7A3E';
    if (percentage >= 80) return color;
    if (percentage >= 50) return '#E8A544';
    return '#C94A4A';
  };

  const statusColor = getStatusColor();

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#EEEBE7"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={statusColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-semibold text-[#465E5A]">
            {current}
          </div>
          <div className="text-xs text-[#465E5A]/60">
            of {target}{unit}
          </div>
        </div>
      </div>

      <div className="mt-3 text-center">
        <p className="text-sm font-medium text-[#465E5A]">{label}</p>
        <p
          className="text-xs mt-1 font-medium"
          style={{ color: statusColor }}
        >
          {percentage >= 100 ? 'Target met' : percentage >= 80 ? 'On track' : percentage >= 50 ? 'Below target' : 'Well below'}
        </p>
      </div>
    </div>
  );
}
