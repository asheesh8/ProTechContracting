import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Phone } from 'lucide-react'
import clsx from 'clsx'

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [lastY, setLastY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      if (y > lastY && y > 80) {
        setHidden(true)
      } else {
        setHidden(false)
      }
      setLastY(y)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastY])

  const handleNavClick = (href: string) => {
    setOpen(false)
    if (href.startsWith('#')) {
      const el = document.querySelector(href)
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-primary/95 backdrop-blur-md shadow-lg' : 'bg-transparent',
        hidden ? '-translate-y-full' : 'translate-y-0'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex flex-col leading-none" onClick={() => handleNavClick('#hero')}>
          <span className="font-heading text-offwhite font-bold text-xl tracking-tight">ProTech</span>
          <span className="text-accent text-xs tracking-widest uppercase font-body">Contracting</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link =>
            link.href.startsWith('/') ? (
              <Link
                key={link.label}
                to={link.href}
                className="text-offwhite/80 hover:text-accent text-sm font-body tracking-wide transition-colors"
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="text-offwhite/80 hover:text-accent text-sm font-body tracking-wide transition-colors bg-transparent border-0 cursor-pointer"
              >
                {link.label}
              </button>
            )
          )}
        </nav>

        {/* Desktop CTA */}
        <a
          href="tel:8023180205"
          className="hidden md:flex items-center gap-2 bg-accent hover:bg-accent/90 text-primary font-body font-semibold text-sm px-4 py-2 rounded transition-colors"
        >
          <Phone size={14} />
          (802) 318-0205
        </a>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-offwhite p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={clsx(
          'md:hidden bg-primary/98 backdrop-blur-md overflow-hidden transition-all duration-300',
          open ? 'max-h-96' : 'max-h-0'
        )}
      >
        <nav className="flex flex-col px-6 pb-6 gap-4 pt-2">
          {navLinks.map(link =>
            link.href.startsWith('/') ? (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setOpen(false)}
                className="text-offwhite/80 hover:text-accent font-body text-base transition-colors py-1 border-b border-white/10"
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="text-offwhite/80 hover:text-accent font-body text-base transition-colors py-1 border-b border-white/10 text-left bg-transparent border-x-0 border-t-0 cursor-pointer"
              >
                {link.label}
              </button>
            )
          )}
          <a
            href="tel:8023180205"
            className="flex items-center gap-2 bg-accent text-primary font-semibold px-4 py-3 rounded mt-2 w-fit"
          >
            <Phone size={14} />
            (802) 318-0205
          </a>
        </nav>
      </div>
    </header>
  )
}
