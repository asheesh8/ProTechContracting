import { motion, useInView } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useRef } from 'react'
import { Phone } from 'lucide-react'

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export default function AboutCTA() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="about" className="py-24 bg-primary clip-diagonal-rev">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={sectionVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left: Story */}
          <div>
            <p className="text-accent text-xs tracking-[0.2em] uppercase font-body mb-4">About Us</p>
            <h2 className="font-heading text-offwhite text-4xl md:text-5xl font-bold mb-6 leading-tight">
              30+ Years of Vermont Craftsmanship
            </h2>
            <p className="text-offwhite/70 font-body text-lg leading-relaxed">
              Since 1993, Pro-Tech Contracting has been Vermont's trusted partner for home remodeling
              and restoration. With three generations of experience and a team that never lets clients
              down, we bring craftsmanship and care to every project — big or small.
            </p>
            <div className="mt-8 flex gap-6">
              <div className="border-l-2 border-accent pl-4">
                <p className="font-heading text-accent text-2xl font-bold">Larry</p>
                <p className="text-offwhite/50 text-sm font-body">Owner & Founder</p>
              </div>
              <div className="border-l-2 border-accent/30 pl-4">
                <p className="font-heading text-offwhite text-2xl font-bold">Family Run</p>
                <p className="text-offwhite/50 text-sm font-body">Since 1993</p>
              </div>
            </div>
          </div>

          {/* Right: CTA Box */}
          <div className="bg-accent rounded-2xl p-8 md:p-10">
            <h3 className="font-heading text-primary text-2xl md:text-3xl font-bold mb-3">
              Ready to Start Your Project?
            </h3>
            <p className="text-primary/70 font-body mb-6">
              Free estimates. No pressure. Just honest advice from Vermont's most trusted contractor.
            </p>
            <a
              href="tel:8023180205"
              className="flex items-center gap-3 text-primary mb-6 group"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Phone size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-body text-xs text-primary/60 uppercase tracking-wide">Call Us</p>
                <p className="font-heading text-2xl font-bold text-primary">(802) 318-0205</p>
              </div>
            </a>
            <button
              onClick={scrollToContact}
              className="w-full bg-primary hover:bg-primary/90 text-accent font-body font-semibold py-4 rounded-lg transition-colors text-sm tracking-wide"
            >
              Get Free Estimate
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
