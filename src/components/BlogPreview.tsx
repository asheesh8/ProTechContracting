import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { ArrowRight, Calendar } from 'lucide-react'
import { supabase, hasSupabase } from '../lib/supabase'
import type { BlogPost } from '../types'

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks} week${weeks !== 1 ? 's' : ''} ago`
  const months = Math.floor(days / 30)
  return `${months} month${months !== 1 ? 's' : ''} ago`
}

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <motion.article variants={cardVariants} className="group bg-offwhite rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        {post.cover_image_url ? (
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center">
            <span className="font-heading text-accent/50 font-bold text-2xl">ProTech</span>
          </div>
        )}
        {post.category && (
          <span className="absolute top-3 left-3 bg-accent text-primary text-xs font-body font-semibold px-3 py-1 rounded-full">
            {post.category}
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-1.5 text-muted text-xs mb-2 font-body">
          <Calendar size={12} />
          {post.published_at ? timeAgo(post.published_at) : 'Recently'}
        </div>
        <h3 className="font-heading font-bold text-primary text-lg mb-2 line-clamp-2">{post.title}</h3>
        {post.excerpt && (
          <p className="text-muted text-sm font-body leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
        )}
        <Link
          to={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1 text-accent font-body font-medium text-sm hover:gap-2 transition-all duration-200"
        >
          Read More <ArrowRight size={14} />
        </Link>
      </div>
    </motion.article>
  )
}

export default function BlogPreview() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    if (!hasSupabase) { setLoading(false); return }

    supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(3)
      .then(({ data, error }) => {
        if (data && !error) setPosts(data)
        setLoading(false)
      })
  }, [])

  if (!loading && posts.length === 0) return null

  return (
    <section id="blog-preview" className="py-24 bg-offwhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-accent text-xs tracking-[0.2em] uppercase font-body mb-3">ProTech Blog</p>
          <h2 className="font-heading text-primary text-4xl md:text-5xl font-bold mb-3">From The Crew</h2>
          <p className="text-muted font-body">Tips, project updates, and advice from 30+ years in the field</p>
          <div className="w-16 h-1 bg-accent mx-auto mt-5" />
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          >
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </motion.div>
        )}

        <div className="text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 border-2 border-accent text-accent hover:bg-accent hover:text-primary font-body font-medium px-6 py-3 rounded transition-all duration-200 text-sm"
          >
            View All Posts <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
