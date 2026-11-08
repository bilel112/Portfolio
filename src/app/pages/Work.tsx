import { motion } from 'motion/react'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router'

import { bySlug, projects } from '../../data/site'
import { Lines, Parallax, Reveal } from '../components/motion'
import { ProjectVisual } from '../components/ProjectVisual'

const ease = [0.22, 1, 0.36, 1] as const

export function Work() {
  const { slug } = useParams()
  const project = slug ? bySlug(slug) : undefined
  if (!project) return <Navigate to="/" replace />
  const index = projects.findIndex((p) => p.slug === project.slug)
  const next = projects[(index + 1) % projects.length]

  return (
    <article className="mx-auto max-w-[1400px] px-5 pt-28 sm:px-8 sm:pt-36">
      <Link to="/#work" className="mono-label inline-flex h-9 items-center gap-1.5 text-muted transition-colors hover:text-fg">
        <ArrowLeft className="size-4" />
        All work
      </Link>

      <div className="mt-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <Lines as="h1" className="font-display text-[clamp(56px,10vw,150px)]" lines={[project.title]} />
        <Reveal delay={0.2} className="max-w-md text-pretty text-[17px] leading-relaxed text-muted lg:pb-4">
          {project.summary}
        </Reveal>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.2, ease }}
        className="mt-12 overflow-hidden rounded-[32px]"
        style={{ background: project.tint, aspectRatio: project.cover ? project.coverAspectRatio : undefined }}
      >
        <ProjectVisual project={project} className={project.cover ? 'size-full' : 'aspect-[16/10] sm:aspect-[16/9]'} strength={5} />
      </motion.div>

      <div className="mt-16 grid gap-12 lg:grid-cols-[320px_1fr] lg:gap-24">
        <Reveal>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 text-[14px] lg:grid-cols-1">
            {[
              ['Client', project.client],
              ['Year', project.year],
              ['Role', project.role.join(', ')],
              ['Delivered', project.deliverables.join(', ')],
            ].map(([label, value]) => (
              <div key={label} className="border-t border-line pt-3">
                <dt className="mono-label text-faint">{label}</dt>
                <dd className="mt-2 text-[14.5px] text-fg">{value}</dd>
              </div>
            ))}
            {project.link && (
              <div className="border-t border-line pt-3">
                <a href={project.link} className="link-draw inline-flex items-center gap-1 font-medium">
                  Visit the site
                  <ArrowUpRight className="size-4" />
                </a>
              </div>
            )}
          </dl>
        </Reveal>
        <div className="max-w-2xl">
          {project.body.map((paragraph, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <p className={`text-pretty leading-relaxed text-fg/90 ${i === 0 ? 'font-display text-[28px] leading-[1.2] sm:text-[36px]' : 'mt-6 text-[17px] text-muted'}`}>{paragraph}</p>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {project.gallery?.length
          ? project.gallery.map((image, i) => (
              <Reveal key={image.src} delay={i * 0.1}>
                <Parallax
                  src={image.src}
                  alt={image.alt}
                  className="aspect-[2/1] rounded-image"
                  strength={3}
                  fit="contain"
                  aspectRatio={image.aspectRatio}
                />
              </Reveal>
            ))
          : [0, 1].map((i) => (
              <Reveal key={i} delay={i * 0.1}>
                <ProjectVisual project={project} className="image-frame aspect-[4/3] rounded-image" label={false} />
              </Reveal>
            ))}
      </div>

      <Link to={`/work/${next.slug}`} className="group mt-32 block border-t border-line pt-10">
        <p className="mono-label text-faint">Next project</p>
        <div className="mt-3 flex items-end justify-between gap-6">
          <h2 className="font-display text-[clamp(44px,8vw,120px)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-3">{next.title}</h2>
          <span className="hidden aspect-[4/3] w-[260px] shrink-0 overflow-hidden rounded-[20px] transition-transform duration-700 group-hover:scale-105 sm:block">
            <ProjectVisual project={next} className="size-full" label={false} />
          </span>
        </div>
      </Link>
    </article>
  )
}
