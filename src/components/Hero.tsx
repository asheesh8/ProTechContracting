import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { ArrowDown } from 'lucide-react'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const, delay },
  }),
}

export default function Hero() {
  const scrollToServices = () => {
    document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/brown-house.jpg')`,
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-primary/55" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
          className="text-accent text-xs md:text-sm tracking-[0.25em] uppercase font-body font-medium mb-4"
        >
          Vermont's Trusted Contractor Since 1993
        </motion.p>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.25}
          className="font-heading text-offwhite text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
        >
          Protect Your Investments
          <br />
          <span className="text-accent">With Protech</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.4}
          className="text-offwhite/75 font-body text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Home remodeling, restoration, additions, and more — serving Burlington, VT
          and a 60-mile radius.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.55}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={scrollToContact}
            className="bg-accent hover:bg-accent/90 text-primary font-body font-semibold px-8 py-4 rounded transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 text-sm tracking-wide"
          >
            Get a Free Quote
          </button>
          <button
            onClick={scrollToServices}
            className="border-2 border-offwhite/70 text-offwhite hover:border-accent hover:text-accent font-body font-medium px-8 py-4 rounded transition-all duration-200 text-sm tracking-wide"
          >
            View Our Work
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        onClick={scrollToServices}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-offwhite/50 hover:text-accent transition-colors animate-bounce"
        aria-label="Scroll down"
      >
        <ArrowDown size={24} />
      </motion.button>
    </section>
  )
}
