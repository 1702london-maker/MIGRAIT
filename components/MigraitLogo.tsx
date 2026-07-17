import { MigraitIcon } from './MigraitIcon'

export function MigraitLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const iconSize = size === 'sm' ? 28 : size === 'md' ? 36 : 48
  const textSize = size === 'sm' ? 'text-xl' : size === 'md' ? 'text-2xl' : 'text-4xl'
  return (
    <div className="flex items-center gap-3">
      <MigraitIcon size={iconSize} />
      <span className={`font-black ${textSize} tracking-tight leading-none`}>
        <span className="text-night">migr</span>
        <span className="text-electric">ait</span>
      </span>
    </div>
  )
}
