// Three horizontal bars converging into a chevron arrow
// Represents data streams moving at speed toward a destination
export function MigraitIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.65} viewBox="0 0 80 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ig" x1="0" y1="0" x2="80" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E11D48" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="48" height="9" rx="4.5" fill="url(#ig)" opacity="0.5" />
      <rect x="0" y="21" width="58" height="11" rx="5.5" fill="url(#ig)" />
      <rect x="0" y="43" width="48" height="9" rx="4.5" fill="url(#ig)" opacity="0.5" />
      <polygon points="58,9 80,26 58,43" fill="url(#ig)" />
      <polygon points="62,15 74,26 62,37" fill="#FFFFFF" opacity="0.65" />
    </svg>
  )
}
