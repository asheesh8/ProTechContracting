import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Phone, Mail, MapPin, CheckCircle } from 'lucide-react'

function FacebookIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

const services = [
  'Home Remodeling',
  'Home Restoration',
  'Home Additions',
  'Painting',
  'Deck Services',
  'Siding',
  'Flooring',
  'Drywall',
  'Demolition',
  'Other',
]

const times = ['Morning (8am–12pm)', 'Afternoon (12pm–5pm)', 'Evening (5pm–8pm)', 'Anytime']

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export default function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    description: '',
    bestTime: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Server error')
      setSuccess(true)
    } catch {
      setError('Something went wrong. Please call us directly at (802) 318-0205.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-24 bg-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-accent text-xs tracking-[0.2em] uppercase font-body mb-3">Get In Touch</p>
          <h2 className="font-heading text-primary text-4xl md:text-5xl font-bold">Free Estimate</h2>
          <div className="w-16 h-1 bg-accent mx-auto mt-5" />
        </div>

        <motion.div
          ref={ref}
          variants={sectionVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="font-heading text-primary text-2xl font-bold mb-6">Contact Information</h3>

            <a href="tel:8023180205" className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <Phone size={20} className="text-accent" />
              </div>
              <div>
                <p className="text-muted text-xs uppercase tracking-wide font-body">Phone</p>
                <p className="font-body font-semibold text-primary text-lg">(802) 318-0205</p>
              </div>
            </a>

            <a href="mailto:protechcontracting1@gmail.com" className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <Mail size={20} className="text-accent" />
              </div>
              <div>
                <p className="text-muted text-xs uppercase tracking-wide font-body">Email</p>
                <p className="font-body font-semibold text-primary">protechcontracting1@gmail.com</p>
              </div>
            </a>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <MapPin size={20} className="text-accent" />
              </div>
              <div>
                <p className="text-muted text-xs uppercase tracking-wide font-body">Service Area</p>
                <p className="font-body font-semibold text-primary">Burlington, VT region — 60 mile radius</p>
              </div>
            </div>

            <a
              href="https://www.facebook.com/LarryandTerryProTechVT/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 group"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <FacebookIcon size={20} />
              </div>
              <div>
                <p className="text-muted text-xs uppercase tracking-wide font-body">Facebook</p>
                <p className="font-body font-semibold text-primary">Follow us on Facebook</p>
              </div>
            </a>

            <div className="mt-10 p-6 bg-primary rounded-xl">
              <p className="font-heading text-offwhite text-lg font-bold mb-1">Same-week response</p>
              <p className="text-offwhite/60 font-body text-sm">Larry personally reviews every inquiry and follows up within 24 hours.</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-offwhite rounded-2xl p-8 shadow-sm">
            {success ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <CheckCircle size={56} className="text-accent mb-4" />
                <h3 className="font-heading text-primary text-2xl font-bold mb-2">Message Sent!</h3>
                <p className="text-muted font-body">Thanks! Larry will be in touch within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-body text-muted uppercase tracking-wide mb-1">Name *</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full border border-light-gray rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:border-accent transition-colors bg-white"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-body text-muted uppercase tracking-wide mb-1">Phone</label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      type="tel"
                      className="w-full border border-light-gray rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:border-accent transition-colors bg-white"
                      placeholder="(802) 000-0000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-body text-muted uppercase tracking-wide mb-1">Email *</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    required
                    className="w-full border border-light-gray rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:border-accent transition-colors bg-white"
                    placeholder="you@email.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-body text-muted uppercase tracking-wide mb-1">Service Needed</label>
                  <select
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className="w-full border border-light-gray rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:border-accent transition-colors bg-white"
                  >
                    <option value="">Select a service…</option>
                    {services.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-body text-muted uppercase tracking-wide mb-1">Project Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border border-light-gray rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:border-accent transition-colors bg-white resize-none"
                    placeholder="Tell us about your project…"
                  />
                </div>

                <div>
                  <label className="block text-xs font-body text-muted uppercase tracking-wide mb-1">Best Time to Call</label>
                  <select
                    name="bestTime"
                    value={form.bestTime}
                    onChange={handleChange}
                    className="w-full border border-light-gray rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:border-accent transition-colors bg-white"
                  >
                    <option value="">Select a time…</option>
                    {times.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {error && <p className="text-red-500 text-sm font-body">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-accent hover:bg-accent/90 disabled:opacity-60 text-primary font-body font-semibold py-4 rounded-lg transition-colors text-sm tracking-wide mt-2"
                >
                  {submitting ? 'Sending…' : 'Send My Request'}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
