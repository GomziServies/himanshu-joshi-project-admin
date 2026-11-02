import React, { useId } from 'react';

const Marigold: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 8 }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill="#EE8F12" />
    <circle cx={x} cy={y} r={r - 1.5} fill="none" stroke="#D27408" strokeWidth="3" strokeDasharray="2 1.6" />
    <circle cx={x} cy={y} r={r * 0.45} fill="#F7A928" />
  </g>
);

const MangoLeaf: React.FC<{ x: number; y: number; length?: number }> = ({ x, y, length = 26 }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d={`M0 0 C7 ${length * 0.25} 7 ${length * 0.7} 0 ${length} C-7 ${length * 0.7} -7 ${length * 0.25} 0 0Z`} fill="#55732F" />
    <path d={`M0 2 L0 ${length - 3}`} stroke="#37501E" strokeWidth="1" />
  </g>
);

/** Marigold and mango-leaf garland. `scale` keeps it from competing with the data below it. */
export const Toran: React.FC<{ className?: string; scale?: number }> = ({ className = '', scale = 1 }) => {
  const id = useId().replace(/:/g, '');
  const height = Math.round(84 * scale);
  return (
    <svg className={`block w-full ${className}`} height={height} aria-hidden="true">
      <defs>
        <pattern id={id} width="132" height="84" patternUnits="userSpaceOnUse" patternTransform={`scale(${scale})`}>
          <path d="M0 8 Q66 40 132 8" fill="none" stroke="#C49A3E" strokeWidth="2" />
          <MangoLeaf x={33} y={21} />
          <MangoLeaf x={66} y={28} length={30} />
          <MangoLeaf x={99} y={21} />
          <Marigold x={20} y={15} r={6} />
          <Marigold x={46} y={22} r={6} />
          <Marigold x={86} y={22} r={6} />
          <Marigold x={112} y={15} r={6} />
          {[0, 132].map((x) => (
            <g key={x}>
              <Marigold x={x} y={10} r={9} />
              <Marigold x={x} y={27} r={8} />
              <Marigold x={x} y={42} r={7} />
              <Marigold x={x} y={55} r={6} />
              <MangoLeaf x={x} y={60} length={22} />
            </g>
          ))}
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={`url(#${id})`} />
    </svg>
  );
};

/** Clay lamp with a live flame. */
export const Diya: React.FC<{ className?: string }> = ({ className = '' }) => {
  const id = useId().replace(/:/g, '');
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0%" stopColor="#FBC252" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FBC252" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-flame`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#D2410C" />
          <stop offset="45%" stopColor="#F7A928" />
          <stop offset="100%" stopColor="#FFF3C4" />
        </linearGradient>
        <linearGradient id={`${id}-clay`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B5652B" />
          <stop offset="100%" stopColor="#6E3514" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="24" r="24" fill={`url(#${id}-glow)`} />
      <path className="flame" d="M32 10 C38 20 40 25 36.5 31 C35 33.5 29 33.5 27.5 31 C24 25 26 20 32 10Z" fill={`url(#${id}-flame)`} />
      <path d="M6 36 C14 40 50 40 58 36 C57 49 46 56 32 56 C18 56 7 49 6 36Z" fill={`url(#${id}-clay)`} />
      <path d="M6 36 C14 40 50 40 58 36 C50 34 14 34 6 36Z" fill="#E7CC85" />
    </svg>
  );
};

function towerTiers(cx: number, baseY: number, height: number, halfWidth: number): React.ReactNode[] {
  const tierHeight = 5;
  const tiers = Math.round(height / tierHeight);
  const parts: React.ReactNode[] = [];
  for (let i = 0; i < tiers; i++) {
    const t = i / tiers;
    const w = halfWidth * (1 - t * t * 0.7);
    const y = baseY - (i + 1) * tierHeight;
    parts.push(<rect key={`t${i}`} x={cx - w} y={y} width={w * 2} height={tierHeight - 0.7} />);
  }
  const topY = baseY - height;
  const topW = halfWidth * 0.34;
  parts.push(
    <ellipse key="amalaka" cx={cx} cy={topY - 5} rx={topW} ry="6" />,
    <path key="kalash" d={`M${cx - 5} ${topY - 10} C${cx - 8} ${topY - 18} ${cx - 2} ${topY - 22} ${cx} ${topY - 30} C${cx + 2} ${topY - 22} ${cx + 8} ${topY - 18} ${cx + 5} ${topY - 10}Z`} />
  );
  return parts;
}

/** Three-tower temple silhouette, sized for the foot of the sidebar. */
export const TempleSkyline: React.FC<{ className?: string; fill?: string }> = ({
  className = '',
  fill = '#2F1B11'
}) => (
  <svg className={`block w-full ${className}`} viewBox="330 0 540 190" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
    <g fill={fill}>
      <rect x="330" y="172" width="540" height="18" />
      {towerTiers(600, 172, 124, 74)}
      {towerTiers(440, 172, 76, 48)}
      {towerTiers(760, 172, 76, 48)}
      <rect x="598.5" y="4" width="3" height="16" />
    </g>
    <path d="M601 5 L632 12 L601 19Z" fill="#D27408" />
  </svg>
);
