import { motion, useInView } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'

const services = [
  {
    name: 'Home Remodeling',
    image: '/images/renovations.jpg',
    description: 'Over 30 years building a reputation as excellent remodelers — complete overhauls to customized additions.',
  },
  {
    name: 'Home Restoration',
    image: '/images/home-restorations.jpg',
    description: 'Three generations of work in the home building industry. The premier restoration solution in Vermont.',
  },
  {
    name: 'Home Additions',
    image: '/images/additions.jpg',
    description: 'Specializing in home and room additions — sun rooms, new wings, whatever you need.',
  },
  {
    name: 'Painting',
    image: '/images/painting.jpg',
    description: 'Interior and exterior painting at the highest quality level. Every detail attended to.',
  },
  {
    name: 'Deck Services',
    image: '/images/decks.jpg',
    description: 'Custom deck installation that boosts curb appeal and adds outdoor living space.',
  },
  {
    name: 'Siding',
    image: '/images/siding.jpg',
    description: 'Professional siding that reduces maintenance, protects from water damage, and increases property value.',
  },
  {
    name: 'Flooring',
    image: '/images/flooring.jpg',
    description: 'Carpet, tile, hardwoods, and laminates — all types of flooring installation.',
  },
  {
    name: 'Drywall',
    image: '/images/drywall.jpg',
    description: 'Small repairs to new construction — all drywall needs covered.',
  },
  {
    name: 'Demolition',
    image: '/images/demolition.jpg',
    description: 'Home cleanouts to commercial teardowns. Call for pricing.',
  },
]

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

function ServiceCard({ service }: { service: typeof services[0] }) {
  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.div
      variants={cardVariants}
      className="group bg-offwhite rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-default"
    >
      <div className="overflow-hidden h-48">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300/C8A96E/1A1A1A?text=ProTech'
          }}
        />
      </div>
      <div className="p-5">
        <h3 className="font-heading font-bold text-primary text-lg mb-2">{service.name}</h3>
        <p className="text-muted font-body text-sm leading-relaxed mb-4">{service.description}</p>
        <button
          onClick={scrollToContact}
          className="inline-flex items-center gap-1 text-accent font-body font-medium text-sm hover:gap-2 transition-all duration-200"
        >
          Get a Quote <ArrowRight size={14} />
        </button>
      </div>
    </motion.div>
  )
}

export default function Services() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="services" className="py-24 bg-light-gray clip-diagonal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-accent text-xs tracking-[0.2em] uppercase font-body mb-3">What We Do</p>
          <h2 className="font-heading text-primary text-4xl md:text-5xl font-bold">Our Services</h2>
          <div className="w-16 h-1 bg-accent mx-auto mt-5" />
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => (
            <ServiceCard key={service.name} service={service} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
