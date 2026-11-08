import { motion, useMotionValue, useSpring } from 'motion/react'
import { useRef, useState } from 'react'
import { Link } from 'react-router'

import type { Project } from '../../data/site'
import { cx } from '../lib/cx'
import { ProjectVisual } from './ProjectVisual'

export function WorkCard({ project, index = 0 }: { project: Project; index?: number }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [hover, setHover] = useState(false)
  const x = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 })
  const y = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 })

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.9, delay: (index % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={cx(project.size === 'large' ? 'md:col-span-2' : 'md:col-span-1')}
    >
      <Link
        ref={ref}
        to={`/work/${project.slug}`}
        className="group relative block"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onMouseMove={(e) => {
          const rect = ref.current?.getBoundingClientRect()
          if (!rect) return
          x.set(e.clientX - rect.left)
          y.set(e.clientY - rect.top)
        }}
      >
        <div
          className={cx('relative overflow-hidden rounded-image', project.cover ? '' : project.size === 'large' ? 'aspect-[16/10]' : 'aspect-[4/5] md:aspect-[4/4.6]')}
          style={{ background: project.tint, aspectRatio: project.cover ? project.coverAspectRatio ?? '2 / 1' : undefined }}
        >
          <span className="mono-label absolute left-4 top-4 z-10 rounded-full border border-fg/15 bg-bg/45 px-2.5 py-1 tabular-nums text-fg/75 backdrop-blur-sm">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className={cx('absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]', !project.cover && 'group-hover:scale-[1.03]')}>
            <ProjectVisual project={project} className="size-full" strength={6} />
          </div>
          <motion.span
            aria-hidden
            style={{ x, y }}
            className={cx(
              'pointer-events-none absolute left-0 top-0 hidden -translate-x-1/2 -translate-y-1/2 items-center rounded-[14px] bg-accent px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-bg transition-[opacity,scale] duration-300 md:flex',
              hover ? 'scale-100 opacity-100' : 'scale-75 opacity-0',
            )}
          >
            View project
          </motion.span>
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-line/80 pt-3">
          <h3 className="font-display text-[28px] sm:text-[32px]">{project.title}</h3>
          <p className="mono-label shrink-0 text-muted">
            {project.category}
            <span className="ml-3 tabular-nums text-faint">{project.year}</span>
          </p>
        </div>
      </Link>
    </motion.div>
  )
}
