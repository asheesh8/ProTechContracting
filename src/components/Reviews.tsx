import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import StarRating from './StarRating'
import type { Review, PlaceDetails } from '../types'

const FALLBACK_REVIEWS: Review[] = [
  {
    author_name: 'Ronnie Del Pino',
    profile_photo_url: '',
    rating: 5,
    text: 'Reasonable pricing and excellent work! Very easy to communicate with. AND very flexible and responsive to change orders.',
    relative_time_description: '2 years ago',
  },
  {
    author_name: 'Robert Paulsen',
    profile_photo_url: '',
    rating: 5,
    text: 'Protech contracting was amazing to work with. They went above and beyond to help with unexpected repairs needed after significant water damage to my house. They walked me through the process, were honest, fair, responsive and did a great job.',
    relative_time_description: 'a year ago',
  },
  {
    author_name: 'Colin Foster',
    profile_photo_url: '',
    rating: 5,
    text: 'I used Larry and his team to address a little mold issue in my bathroom — essentially removing and replacing some drywall. I couldn\'t have been happier with the process. Timely, affordable, and great communication! Would certainly hire again.',
    relative_time_description: '6 months ago',
  },
  {
    author_name: 'Margaret van Dyke',
    profile_photo_url: '',
    rating: 5,
    text: 'I recently used Pro-Tech to replace a rotten support post on my carport. They were fast, responsive and did great work, replacing the old post and caulking with new, pressure-treated wood, and didn\'t go over the estimate they gave me.',
    relative_time_description: '7 months ago',
  },
  {
    author_name: 'Renee Lavalley',
    profile_photo_url: '',
    rating: 5,
    text: 'Larry went above & beyond to help me out, getting my projects accomplished in a quick & efficient manner! Carpenters, very fast and knowledgeable!! The only company that responded to my request! 🙂',
    relative_time_description: '9 months ago',
  },
  {
    author_name: 'John Hao',
    profile_photo_url: '',
    rating: 5,
    text: 'One porch pillar of my house needed to be replaced because of rot. I called around to get quotes from multiple local companies. Pro Tech Contracting gave me a good price, and offered to work according to my schedule. The owner, Larry, was easy to communicate and work with.',
    relative_time_description: '8 months ago',
  },
]

const GOOGLE_MAPS_URL = 'https://www.google.com/maps/place/Pro-Tech+Contracting/@44.4771,-73.2133,17z/data=!4m8!3m7!1s0x4cca7b6ed5555555:0x1234!8m2!3d44.4771!4d-73.2133!9m1!1b1'

function ReviewCard({ review, delay }: { review: Review; delay: number }) {
  const [expanded, setExpanded] = useState(false)
  const truncated = review.text.length > 180
  const displayText = truncated && !expanded ? review.text.slice(0, 180) + '…' : review.text

  const initials = review.author_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
      className="bg-offwhite rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4 min-w-[280px]"
    >
      <div className="flex items-center gap-3">
        {review.profile_photo_url ? (
          <img
            src={review.profile_photo_url}
            alt={review.author_name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-accent font-heading font-bold text-sm">{initials}</span>
          </div>
        )}
        <div>
          <p className="font-body font-semibold text-primary text-sm">{review.author_name}</p>
          <p className="text-muted text-xs">{review.relative_time_description}</p>
        </div>
      </div>

      <StarRating rating={review.rating} size={14} />

      <p className="font-body text-text-main text-sm leading-relaxed">
        {displayText}
        {truncated && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-accent ml-1 hover:underline text-xs font-medium"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </p>
    </motion.div>
  )
}

export default function Reviews() {
  const [data, setData] = useState<PlaceDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    fetch('/api/reviews')
      .then((r) => r.json())
      .then((d) => {
        if (d.reviews && d.reviews.length > 0) {
          setData(d)
        } else {
          setUsingFallback(true)
        }
      })
      .catch(() => setUsingFallback(true))
      .finally(() => setLoading(false))
  }, [])

  const reviews = usingFallback ? FALLBACK_REVIEWS : (data?.reviews?.slice(0, 5) ?? [])
  const rating = usingFallback ? 5.0 : (data?.rating ?? 5.0)
  const totalRatings = usingFallback ? null : data?.user_ratings_total

  return (
    <section id="reviews" ref={ref} className="py-24 bg-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-accent text-xs tracking-[0.2em] uppercase font-body mb-3">Testimonials</p>
          <h2 className="font-heading text-primary text-4xl md:text-5xl font-bold mb-3">
            What Our Clients Say
          </h2>
          <p className="text-muted font-body">Real reviews from real Vermont homeowners</p>
          <div className="w-16 h-1 bg-accent mx-auto mt-5" />
        </div>

        {/* Summary bar */}
        {inView && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-10"
          >
            <div className="flex items-center gap-2">
              <span className="font-heading text-5xl font-bold text-primary">{rating.toFixed(1)}</span>
              <div className="flex flex-col gap-1">
                <StarRating rating={rating} size={20} />
                {totalRatings && (
                  <span className="text-muted text-xs font-body">{totalRatings} Google reviews</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm">
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-4 h-4"
              />
              <span className="text-xs font-body text-muted">Powered by Google</span>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible flex-nowrap md:flex-wrap pb-4">
            {reviews.map((review, i) => (
              <ReviewCard key={i} review={review} delay={i * 0.1} />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-2 border-accent text-accent hover:bg-accent hover:text-primary font-body font-medium px-6 py-3 rounded transition-all duration-200 text-sm"
          >
            See All Reviews on Google <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  )
}
