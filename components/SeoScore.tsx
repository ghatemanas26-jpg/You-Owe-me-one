import React from 'react';

interface SeoScoreProps {
  score: number;
}

const SeoScore: React.FC<SeoScoreProps> = ({ score }) => {
  const size = 120;
  const strokeWidth = 10;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const offset = circumference - (score / 100) * circumference;

  let colorClass = 'stroke-green-cta';
  if (score < 75) colorClass = 'stroke-yellow-400';
  if (score < 40) colorClass = 'stroke-red-500';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="stroke-gray-blue/20"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={center}
          cy={center}
        />
        <circle
          className={`transition-all duration-1000 ease-out ${colorClass}`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={center}
          cy={center}
        />
      </svg>
      <span className="absolute text-3xl font-bold text-off-white">{score}</span>
    </div>
  );
};

export default SeoScore;
