import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Services from '../components/Services'
import WhyProtech from '../components/WhyProtech'
import Reviews from '../components/Reviews'
import BlogPreview from '../components/BlogPreview'
import AboutCTA from '../components/AboutCTA'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

export default function HomePage() {
  return (
    <div className="font-body">
      <Navbar />
      <Hero />
      <Services />
      <WhyProtech />
      <Reviews />
      <BlogPreview />
      <AboutCTA />
      <Contact />
      <Footer />
    </div>
  )
}
