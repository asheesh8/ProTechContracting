import { motion, useInView } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1500
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])

  return (
    <span ref={ref} className="font-heading text-5xl md:text-6xl font-bold text-accent">
      {count}{suffix}
    </span>
  )
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export default function WhyProtech() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about-stats" className="py-24 bg-offwhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={sectionVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-8 border border-light-gray rounded-xl">
              <CountUp target={30} suffix="+" />
              <p className="font-body text-muted mt-2 text-sm tracking-wide uppercase">Years in Business</p>
            </div>
            <div className="text-center p-8 border border-light-gray rounded-xl">
              <div className="font-heading text-5xl md:text-6xl font-bold text-accent">60</div>
              <p className="font-body text-muted mt-2 text-sm tracking-wide uppercase">Mile Service Radius</p>
            </div>
            <div className="text-center p-8 border border-light-gray rounded-xl">
              <CountUp target={1993} />
              <p className="font-body text-muted mt-2 text-sm tracking-wide uppercase">Year Founded</p>
            </div>
          </div>

          {/* Description */}
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-body text-text-main text-lg leading-relaxed">
              Pro-Tech Contracting specializes in Home Remodeling, Home Restoration, Home Additions,
              Deck Installation, Siding Services, Interior and Exterior Painting, Drywall, Kitchen
              and Bathroom Remodeling, Residential and Commercial Demolition, Electrical Work, and much more.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
