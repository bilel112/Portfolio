import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

import { certifications, education, heroStats, languages, projects, services, site } from '../../data/site'
import { Lines, Parallax, Reveal } from '../components/motion'
import { WorkCard } from '../components/WorkCard'
import { useLocalTime } from '../components/Nav'
import { cx } from '../lib/cx'

const ease = [0.22, 1, 0.36, 1] as const

export function Home() {
  const time = useLocalTime()
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
        <HeroField />
        <div className="relative mx-auto w-full max-w-[1400px] px-5 pb-10 pt-28 sm:px-8 sm:pb-14">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease }}
            className="mono-label mb-8 flex flex-wrap items-center gap-x-7 gap-y-3 text-faint"
          >
            <span className="inline-flex items-center gap-2 text-fg">
              <span className={cx('round size-1.5 rounded-full bg-accent', site.available && 'animate-pulse-soft')} aria-hidden />
              {site.available ? 'Open to work' : 'Fully booked'}
            </span>
            <span className="tabular-nums">
              {site.location} {time}
            </span>
            <span className="hidden text-accent sm:inline">AI / Data / Systems</span>
            <span className="ml-auto hidden tabular-nums sm:inline">Idx 001</span>
          </motion.div>
          <h1 className="font-display text-signal text-[clamp(64px,13.5vw,210px)]">
            {site.name.split(' ').map((word, i) => (
              <span key={word} className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
                <motion.span className="block" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.1, delay: 0.25 + i * 0.12, ease }}>
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.7, ease }} className="mt-10 border-t border-line pt-6">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,34rem)_1fr] lg:gap-16">
              <p className="max-w-md text-pretty text-[17px] leading-relaxed text-muted sm:text-[19px]">{site.intro}</p>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4 lg:justify-items-end lg:text-right">
                {heroStats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="mono-label text-faint">{stat.label}</dt>
                    <dd className="mt-2 text-[13.5px] leading-snug text-fg/85">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marquee */}
      <div className="relative overflow-hidden border-y border-line bg-surface/40 py-4" aria-hidden>
        <ul className="mono-label flex w-max animate-marquee items-center gap-8 whitespace-nowrap text-muted">
          {[...site.marquee, ...site.marquee].map((item, i) => (
            <li key={i} className="flex items-center gap-8">
              <span className="text-accent/70">/</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Work */}
      <section id="work" className="mx-auto max-w-[1400px] scroll-mt-20 px-5 pt-24 sm:px-8 sm:pt-32">
        <div className="flex items-end justify-between border-b border-line pb-5">
          <Lines as="h2" className="font-display text-[44px] sm:text-[64px]" lines={['Selected work']} />
          <Reveal className="mono-label hidden pb-2 text-faint sm:block">
            {String(projects.length).padStart(2, '0')} files, 2025 to now
          </Reveal>
        </div>
        <div className="mt-12 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:gap-x-8 lg:gap-y-20">
          {projects.map((p, i) => (
            <WorkCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </section>

      {/* About teaser */}
      <section className="mx-auto max-w-[1400px] px-5 pt-32 sm:px-8 sm:pt-44">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <Reveal>
            <Parallax src="/images/Myphoto.JPG" alt={site.name} className="aspect-[3/4] max-w-[460px] rounded-image" strength={6} />
          </Reveal>
          <div className="flex flex-col justify-center">
            <Lines
              as="h2"
              className="font-display text-balance text-[40px] sm:text-[56px] lg:text-[64px]"
              lines={['I make the system', 'and the window', 'into it']}
            />
            <Reveal delay={0.2} className="mt-8 max-w-xl text-pretty text-[17px] leading-relaxed text-muted">
              <p>
                Fifth year of computer engineering at ESPRIT, specialising in data science and AI, with internships at Ooredoo Tunisie and Capgemini behind me. The work I keep choosing starts with a messy dataset and ends with a model somebody actually uses.
              </p>
              <p className="mt-4">I study in {site.location}, and I am looking for a six-month end-of-studies internship from January 2027.</p>
            </Reveal>
            <Reveal delay={0.3} className="mt-8">
              <Link to="/about" className="link-draw inline-flex items-center gap-1.5 text-[15px] font-medium">
                More about me
                <ArrowUpRight className="size-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-[1400px] px-5 pt-32 sm:px-8 sm:pt-44">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-20">
          <div>
            <Lines as="h2" className="font-display text-[40px] sm:text-[56px]" lines={['What I do']} />
            <Reveal delay={0.1} className="mt-4 max-w-xs text-[15px] text-muted">
              From the data to the model, and from the model to the screen.
            </Reveal>
          </div>
          <Services />
        </div>
      </section>

      {/* Record */}
      <section className="mx-auto max-w-[1400px] px-5 pt-32 sm:px-8 sm:pt-44">
        <RecordPanel />
      </section>
    </>
  )
}

// The hero field is a plot, not a painting: a faint measuring grid, cold
// drifts of accent light behind it, sensor noise, and one scan line reading
// down the screen.
function HeroField() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,#000_60%,transparent_96%)]">
      <div className="grid-field absolute inset-0 opacity-80" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.8, ease }} className="absolute inset-0">
        <div className="round absolute -top-[26%] right-[-10%] h-[95%] w-[70%] animate-drift-a rounded-full bg-[radial-gradient(closest-side,rgb(60_224_255/0.30),transparent)] blur-3xl" />
        <div className="round absolute -top-[12%] left-[-14%] h-[80%] w-[62%] animate-drift-b rounded-full bg-[radial-gradient(closest-side,rgb(162_115_255/0.26),transparent)] blur-3xl" />
        <div className="round absolute top-[26%] left-[34%] h-[70%] w-[56%] animate-drift-c rounded-full bg-[radial-gradient(closest-side,rgb(47_92_255/0.32),transparent)] blur-3xl" />
        <div className="round absolute top-[46%] right-[10%] h-[46%] w-[38%] animate-drift-b rounded-full bg-[radial-gradient(closest-side,rgb(60_224_255/0.16),transparent)] blur-3xl" />
      </motion.div>
      <div className="grain absolute inset-0" />
      <div className="absolute inset-x-0 top-0 h-px animate-scan bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />
    </div>
  )
}

function Services() {
  const [open, setOpen] = useState(0)
  return (
    <ul className="border-t border-line">
      {services.map((s, i) => {
        const isOpen = open === i
        return (
          <li key={s.title} className="border-b border-line">
            <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : i)} className="group flex w-full items-center gap-6 py-7 text-left">
              <span className="mono-label w-10 shrink-0 tabular-nums text-faint">0{i + 1}</span>
              <span className={cx('font-display flex-1 text-[32px] transition-colors sm:text-[44px]', isOpen ? 'text-fg' : 'text-fg/60 group-hover:text-fg')}>{s.title}</span>
              <span className={cx('grid size-10 shrink-0 place-items-center rounded-[12px] border border-line-strong transition-colors duration-300', isOpen && 'border-accent bg-accent text-bg')}>
                <Plus className={cx('size-4 transition-transform duration-500', isOpen && 'rotate-45')} />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease }} className="overflow-hidden">
                  <p className="max-w-xl pb-8 pl-16 text-pretty text-[16px] leading-relaxed text-muted">{s.body}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        )
      })}
    </ul>
  )
}

// Education, certifications and languages, kept together as one record panel.
function RecordPanel() {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-line bg-surface px-6 py-12 sm:px-14 sm:py-16">
      <div aria-hidden className="grid-field pointer-events-none absolute inset-0 opacity-70" />
      <div aria-hidden className="pointer-events-none absolute -top-32 right-[-10%] size-[420px] rounded-full bg-[radial-gradient(closest-side,rgb(60_224_255/0.16),transparent)] blur-2xl" />
      <div className="relative">
        <div className="mono-label flex items-center justify-between text-faint">
          <span className="text-accent">Record</span>
          <span className="tabular-nums">
            {site.location} / 2022 to now
          </span>
        </div>
        <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
          <div>
            <h2 className="mono-label text-faint">Education</h2>
            <ol className="mt-4 flex flex-col gap-5">
              {education.map((e) => (
                <li key={e.title}>
                  <p className="text-[15.5px] text-fg">{e.title}</p>
                  <p className="mt-1 text-[14px] leading-snug text-muted">{e.detail}</p>
                  <p className="mono-label mt-1.5 tabular-nums text-faint">{e.period}</p>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="mono-label text-faint">Certifications</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {certifications.map((c) => (
                <li key={c.title} className="text-[14px] leading-snug text-muted">
                  <span className="text-fg/90">{c.issuer}</span> · {c.title}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mono-label text-faint">Languages</h2>
            <ul className="mt-4 flex flex-col gap-2">
              {languages.map((l) => (
                <li key={l.name} className="flex items-baseline justify-between gap-4 border-b border-line/70 pb-2 text-[14px]">
                  <span className="text-fg/90">{l.name}</span>
                  <span className="mono-label text-faint">{l.level}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
