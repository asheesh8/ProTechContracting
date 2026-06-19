import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Calendar, ArrowLeft, ArrowRight } from 'lucide-react'
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

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [related, setRelated] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()
      .then(({ data, error }) => {
        if (error || !data) { setNotFound(true); setLoading(false); return }
        setPost(data)
        supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .neq('id', data.id)
          .order('published_at', { ascending: false })
          .limit(2)
          .then(({ data: rel }) => { if (rel) setRelated(rel) })
        setLoading(false)
      })
  }, [slug])

  const scrollToContact = () => {
    window.location.href = '/#contact'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (notFound || !post) {
    return (
      <div className="font-body min-h-screen bg-offwhite">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <h1 className="font-heading text-primary text-4xl font-bold mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-accent font-body hover:underline">← Back to Blog</Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="font-body bg-offwhite min-h-screen">
      <Navbar />

      {/* Cover */}
      <div className="relative pt-20">
        {post.cover_image_url ? (
          <div className="relative h-72 md:h-96 overflow-hidden">
            <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-primary/60" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              {post.category && (
                <span className="bg-accent text-primary text-xs font-body font-semibold px-3 py-1 rounded-full mb-4">
                  {post.category}
                </span>
              )}
              <h1 className="font-heading text-offwhite text-3xl md:text-5xl font-bold max-w-3xl leading-tight">
                {post.title}
              </h1>
            </div>
          </div>
        ) : (
          <div className="pt-16 pb-12 bg-primary text-center px-4">
            {post.category && (
              <span className="bg-accent text-primary text-xs font-body font-semibold px-3 py-1 rounded-full mb-4 inline-block">
                {post.category}
              </span>
            )}
            <h1 className="font-heading text-offwhite text-3xl md:text-5xl font-bold max-w-3xl mx-auto leading-tight mt-4">
              {post.title}
            </h1>
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted font-body mb-8">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          <span>›</span>
          <Link to="/blog" className="hover:text-accent transition-colors">Blog</Link>
          <span>›</span>
          <span className="text-primary line-clamp-1">{post.title}</span>
        </nav>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-muted font-body mb-8 pb-8 border-b border-light-gray">
          <span className="font-semibold text-primary">Larry — Pro-Tech Contracting</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Calendar size={13} />
            {post.published_at ? timeAgo(post.published_at) : 'Recently'}
          </span>
        </div>

        {/* Content */}
        <div className="prose-blog">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        {/* CTA */}
        <div className="mt-16 p-8 bg-primary rounded-2xl text-center">
          <h3 className="font-heading text-offwhite text-2xl font-bold mb-2">Need a Contractor?</h3>
          <p className="text-offwhite/60 font-body mb-5 text-sm">Get a free, no-pressure estimate from Vermont's most trusted remodeling team.</p>
          <button
            onClick={scrollToContact}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-primary font-body font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
          >
            Get a Free Estimate <ArrowRight size={14} />
          </button>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <h3 className="font-heading text-primary text-2xl font-bold mb-6">More From The Crew</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {related.map(rel => (
                <Link key={rel.id} to={`/blog/${rel.slug}`} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {rel.cover_image_url ? (
                    <img src={rel.cover_image_url} alt={rel.title} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-36 bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                      <span className="font-heading text-accent/30 font-bold text-xl">ProTech</span>
                    </div>
                  )}
                  <div className="p-4">
                    <p className="font-heading font-bold text-primary text-base line-clamp-2 mb-1">{rel.title}</p>
                    <span className="text-accent text-xs font-body font-medium">Read More →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10">
          <Link to="/blog" className="inline-flex items-center gap-2 text-accent font-body font-medium text-sm hover:gap-3 transition-all duration-200">
            <ArrowLeft size={14} /> Back to Blog
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
