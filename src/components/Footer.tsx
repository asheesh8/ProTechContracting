import { Link } from 'react-router-dom'
import { Phone, Mail } from 'lucide-react'

function FacebookIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

export default function Footer() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-primary pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <p className="font-heading text-offwhite font-bold text-2xl">ProTech</p>
              <p className="text-accent text-xs tracking-widest uppercase font-body">Contracting</p>
            </div>
            <p className="text-offwhite/50 font-body text-sm leading-relaxed max-w-xs">
              Protect Your Investments With Protech. Vermont's trusted remodeling and restoration contractor since 1993.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body font-semibold text-offwhite text-sm uppercase tracking-widest mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Home', href: '#hero' },
                { label: 'Services', href: '#services' },
                { label: 'About', href: '#about' },
                { label: 'Reviews', href: '#reviews' },
                { label: 'Contact', href: '#contact' },
              ].map(link => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-offwhite/50 hover:text-accent text-sm font-body transition-colors bg-transparent border-0 cursor-pointer p-0"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li>
                <Link to="/blog" className="text-offwhite/50 hover:text-accent text-sm font-body transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body font-semibold text-offwhite text-sm uppercase tracking-widest mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a href="tel:8023180205" className="flex items-center gap-2 text-offwhite/50 hover:text-accent text-sm font-body transition-colors">
                  <Phone size={14} /> (802) 318-0205
                </a>
              </li>
              <li>
                <a href="mailto:protechcontracting1@gmail.com" className="flex items-center gap-2 text-offwhite/50 hover:text-accent text-sm font-body transition-colors">
                  <Mail size={14} /> protechcontracting1@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/LarryandTerryProTechVT/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-offwhite/50 hover:text-accent text-sm font-body transition-colors"
                >
                  <FacebookIcon size={14} /> Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-offwhite/30 text-xs font-body">
            © 2026 Pro-Tech Contracting LLC — Burlington, VT
          </p>
          <p className="text-offwhite/20 text-xs font-body">
            Website by{' '}
            <span className="text-offwhite/30 hover:text-accent transition-colors cursor-default">ArkiTech-Sol</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
