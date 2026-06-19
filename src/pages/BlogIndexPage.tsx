import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, Search } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { BlogPost } from '../types'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks} week${weeks !== 1 ? 's' : ''} ago`
  const months = Math.floor(days / 30)
  return `${months} month${months !== 1 ? 's' : ''} ago`
}

const CATEGORIES = ['All', 'Remodeling', 'Restoration', 'Tips & Advice', 'Project Spotlight', 'News', 'Other']

export default function BlogIndexPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .then(({ data }) => {
        if (data) setPosts(data)
        setLoading(false)
      })
  }, [])

  const filtered = posts.filter(p => {
    const matchCat = category === 'All' || p.category === category
    const q = search.toLowerCase()
    const matchSearch = !q || p.title.toLowerCase().includes(q) || (p.excerpt ?? '').toLowerCase().includes(q)
    return matchCat && matchSearch
  })

  return (
    <div className="font-body bg-offwhite min-h-screen">
      <Navbar />

      {/* Header */}
      <div className="pt-32 pb-16 bg-primary text-center">
        <p className="text-accent text-xs tracking-[0.2em] uppercase font-body mb-3">ProTech Blog</p>
        <h1 className="font-heading text-offwhite text-4xl md:text-5xl font-bold mb-4">From The Crew</h1>
        <p className="text-offwhite/60 font-body max-w-xl mx-auto">
          Tips, project updates, and advice from 30+ years in the field
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search posts…"
              className="w-full pl-9 pr-4 py-2.5 border border-light-gray rounded-lg text-sm font-body focus:outline-none focus:border-accent bg-white"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-body font-medium transition-colors ${
                  category === cat
                    ? 'bg-accent text-primary'
                    : 'bg-white border border-light-gray text-muted hover:border-accent hover:text-accent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-muted font-body text-lg">No posts found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(post => (
              <article key={post.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-48 overflow-hidden">
                  {post.cover_image_url ? (
                    <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center">
                      <span className="font-heading text-accent/40 font-bold text-2xl">ProTech</span>
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
                  <h2 className="font-heading font-bold text-primary text-lg mb-2 line-clamp-2">{post.title}</h2>
                  {post.excerpt && <p className="text-muted text-sm font-body leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>}
                  <Link to={`/blog/${post.slug}`} className="inline-flex items-center gap-1 text-accent font-body font-medium text-sm hover:gap-2 transition-all duration-200">
                    Read More <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
