import { ArrowUpRight } from 'lucide-react'

import { education, experience, site, skills } from '../../data/site'
import { Lines, Parallax, Reveal } from '../components/motion'

export function About() {
  return (
    <article className="mx-auto max-w-[1400px] px-5 pt-28 sm:px-8 sm:pt-36">
      <div className="mono-label mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-faint">
        <span className="text-accent">Profile</span>
      </div>
      <Lines as="h1" className="font-display text-balance text-[clamp(44px,7.5vw,112px)]" lines={['Data scientist,', 'building for decisions']} />
      <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-24">
        <Reveal>
          <Parallax src="/images/Myphoto.JPG" alt={site.name} className="aspect-[3/4] rounded-image" strength={6} />
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="link-draw inline-flex items-center gap-1 text-muted hover:text-fg">
                  {s.label}
                  <ArrowUpRight className="size-3.5" />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
        <div>
          <Reveal className="text-pretty text-[19px] leading-relaxed sm:text-[22px]">
            <p>
              I am in my fifth year of computer engineering at ESPRIT, specialising in data science and AI, and I am looking for a six-month end-of-studies internship from January 2027, on machine learning and applied AI.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-8 flex flex-col gap-5 text-[17px] leading-relaxed text-muted">
            <p>
              Most of what I know comes from two internships: at Ooredoo Tunisie, where I built a platform that predicts employee turnover, and at Capgemini, where I trained a model to read facial emotions from a live video feed. Both started with a dataset nobody had cleaned and ended with something a team could use.
            </p>
            <p>
              I like problems where the model has to earn its place: a prediction that changes a decision, an assistant that answers from real documents, a signal that arrives at the right moment. I work mostly in Python, and I care about validation as much as architecture, because a model that cannot be explained to the person acting on it is only half a model.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-16">
            <h2 className="mono-label text-faint">Experience</h2>
            <ol className="mt-4 divide-y divide-line border-y border-line">
              {experience.map((e) => (
                <li key={e.title} className="grid gap-1 py-5 sm:grid-cols-[160px_1fr]">
                  <span className="mono-label tabular-nums text-faint">{e.period}</span>
                  <span>
                    <span className="block text-[16px] font-medium">{e.title}</span>
                    <span className="block text-[14.5px] text-muted">{e.detail}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={0.18} className="mt-12">
            <h2 className="mono-label text-faint">Education</h2>
            <ol className="mt-4 divide-y divide-line border-y border-line">
              {education.map((e) => (
                <li key={e.title} className="grid gap-1 py-5 sm:grid-cols-[160px_1fr]">
                  <span className="mono-label tabular-nums text-faint">{e.period}</span>
                  <span>
                    <span className="block text-[16px] font-medium">{e.title}</span>
                    <span className="block text-[14.5px] text-muted">{e.detail}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={0.2} className="mt-16">
            <h2 className="mono-label text-faint">Toolkit</h2>
            <dl className="mt-4 grid gap-x-10 gap-y-5 sm:grid-cols-2">
              {skills.map((s) => (
                <div key={s.label} className="border-t border-line pt-3">
                  <dt className="mono-label text-faint">{s.label}</dt>
                  <dd className="mt-2 text-[14.5px] leading-snug text-muted">{s.items}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

        </div>
      </div>
    </article>
  )
}
