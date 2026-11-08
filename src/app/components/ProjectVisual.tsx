import type { Project } from '../../data/site'
import { cx } from '../lib/cx'
import { Parallax } from './motion'

// Projects can ship without photography. Until a cover exists, the card shows
// a plotted placeholder: the measuring grid, one cold glow, and the category in
// mono so the grid still reads as a set of records rather than empty boxes.
export function ProjectVisual({ project, className, strength = 6, label = true }: { project: Project; className?: string; strength?: number; label?: boolean }) {
  if (project.cover) return <Parallax src={project.cover} alt={project.title} className={className} strength={strength} fit="contain" />
  return (
    <div className={cx('relative overflow-hidden', className)} style={{ background: project.tint }}>
      <div aria-hidden className="grid-field absolute inset-0 opacity-80" />
      <div
        aria-hidden
        className="absolute -top-1/3 right-[-20%] size-[70%] rounded-full bg-[radial-gradient(closest-side,rgb(60_224_255/0.22),transparent)] blur-2xl"
      />
      <div
        aria-hidden
        className="absolute bottom-[-30%] left-[-15%] size-[60%] rounded-full bg-[radial-gradient(closest-side,rgb(47_92_255/0.28),transparent)] blur-2xl"
      />
      {label && (
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5 sm:p-7">
          <span className="mono-label text-accent">{project.category}</span>
          <span className="font-display text-[clamp(22px,3.6vw,44px)] leading-[1.02] text-balance text-fg/85">{project.title}</span>
        </div>
      )}
    </div>
  )
}
