import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Eye, Trash2, Upload, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import RichEditor from '../../components/RichEditor'
import type { BlogPost, ServiceCategory } from '../../types'

const CATEGORIES: ServiceCategory[] = ['Remodeling', 'Restoration', 'Tips & Advice', 'Project Spotlight', 'News', 'Other']

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

interface PostEditorProps {
  existingPost?: BlogPost
}

export default function PostEditor({ existingPost }: PostEditorProps) {
  const navigate = useNavigate()
  const [title, setTitle] = useState(existingPost?.title ?? '')
  const [slug, setSlug] = useState(existingPost?.slug ?? '')
  const [slugEdited, setSlugEdited] = useState(!!existingPost)
  const [category, setCategory] = useState(existingPost?.category ?? '')
  const [excerpt, setExcerpt] = useState(existingPost?.excerpt ?? '')
  const [content, setContent] = useState(existingPost?.content ?? '')
  const [published, setPublished] = useState(existingPost?.published ?? false)
  const [coverUrl, setCoverUrl] = useState(existingPost?.cover_image_url ?? '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [autoSaveMsg, setAutoSaveMsg] = useState('')
  const [toast, setToast] = useState('')
  const [deleteModal, setDeleteModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const autoSaveTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  // Auto slug from title
  useEffect(() => {
    if (!slugEdited) {
      setSlug(slugify(title))
    }
  }, [title, slugEdited])

  // Auto save every 30s
  const autoSave = useCallback(async () => {
    if (!title && !content) return
    const data = { title, slug, category: category || null, excerpt: excerpt || null, content, published, cover_image_url: coverUrl || null }
    if (existingPost) {
      await supabase.from('blog_posts').update(data).eq('id', existingPost.id)
    } else {
      // only insert if we have enough data
      if (!title || !content) return
    }
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    setAutoSaveMsg(`Auto-saved ${time}`)
  }, [title, slug, category, excerpt, content, published, coverUrl, existingPost])

  useEffect(() => {
    autoSaveTimer.current = setInterval(autoSave, 30000)
    return () => { if (autoSaveTimer.current) clearInterval(autoSaveTimer.current) }
  }, [autoSave])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const path = `covers/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('blog-images').upload(path, file)
    if (!error) {
      const { data } = supabase.storage.from('blog-images').getPublicUrl(path)
      setCoverUrl(data.publicUrl)
    }
    setUploading(false)
  }

  const save = async (publish?: boolean) => {
    if (!title || !content) {
      setToast('Title and content are required.')
      setTimeout(() => setToast(''), 3000)
      return
    }
    setSaving(true)

    const isPublishing = publish ?? published
    const data = {
      title,
      slug: slug || slugify(title),
      category: category || null,
      excerpt: excerpt || null,
      content,
      published: isPublishing,
      cover_image_url: coverUrl || null,
      published_at: isPublishing && !existingPost?.published_at ? new Date().toISOString() : existingPost?.published_at ?? null,
    }

    let error
    if (existingPost) {
      ;({ error } = await supabase.from('blog_posts').update(data).eq('id', existingPost.id))
    } else {
      ;({ error } = await supabase.from('blog_posts').insert(data))
    }

    setSaving(false)
    if (error) {
      setToast(`Error: ${error.message}`)
      setTimeout(() => setToast(''), 4000)
      return
    }

    if (publish) {
      navigate('/admin/dashboard')
    } else {
      setToast('Saved ✓')
      setTimeout(() => setToast(''), 2000)
    }
  }

  const deletePost = async () => {
    if (!existingPost) return
    await supabase.from('blog_posts').delete().eq('id', existingPost.id)
    navigate('/admin/dashboard')
  }

  const previewSlug = slug || slugify(title)

  return (
    <div className="min-h-screen bg-light-gray font-body">
      {/* Header */}
      <header className="bg-primary px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 text-offwhite/60 hover:text-accent text-sm transition-colors"
        >
          <ArrowLeft size={15} /> Dashboard
        </button>
        <div className="flex items-center gap-3">
          {autoSaveMsg && <span className="text-offwhite/30 text-xs hidden sm:inline">{autoSaveMsg}</span>}
          <button
            onClick={() => save(false)}
            disabled={saving}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-offwhite px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <Save size={14} /> Save Draft
          </button>
          {existingPost && (
            <a
              href={`/blog/${previewSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-offwhite px-4 py-2 rounded-lg text-sm transition-colors"
            >
              <Eye size={14} /> Preview
            </a>
          )}
          <button
            onClick={() => save(true)}
            disabled={saving}
            className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-primary font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Publish
          </button>
        </div>
      </header>

      {toast && (
        <div className="fixed top-20 right-4 bg-primary text-offwhite px-4 py-2.5 rounded-lg shadow-lg text-sm z-50 font-body">
          {toast}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">

        {/* Title */}
        <div>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Post title…"
            className="w-full bg-transparent font-heading text-primary text-3xl md:text-4xl font-bold focus:outline-none placeholder-muted/40 border-b-2 border-light-gray focus:border-accent transition-colors pb-2"
          />
          <p className="text-muted text-xs mt-1 font-body">
            URL: /blog/
            <input
              value={slug}
              onChange={e => { setSlug(e.target.value); setSlugEdited(true) }}
              className="bg-transparent border-b border-dashed border-muted/40 focus:outline-none focus:border-accent transition-colors text-xs w-64 ml-0.5"
            />
          </p>
        </div>

        {/* Meta row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted uppercase tracking-wide mb-1">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full border border-light-gray rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent bg-white"
            >
              <option value="">Select category…</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-end gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => setPublished(!published)}
                className={`relative w-12 h-6 rounded-full transition-colors ${published ? 'bg-accent' : 'bg-muted/30'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${published ? 'translate-x-7' : 'translate-x-1'}`} />
              </div>
              <span className="text-sm font-body text-primary">{published ? 'Published' : 'Draft'}</span>
            </label>
          </div>
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-xs text-muted uppercase tracking-wide mb-2">Cover Image</label>
          {coverUrl ? (
            <div className="relative w-full h-48 rounded-xl overflow-hidden">
              <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
              <button
                onClick={() => setCoverUrl('')}
                className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-black/80 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-light-gray hover:border-accent rounded-xl p-8 text-center cursor-pointer transition-colors group"
            >
              <Upload size={24} className="mx-auto text-muted group-hover:text-accent mb-2 transition-colors" />
              <p className="text-muted text-sm font-body">{uploading ? 'Uploading…' : 'Click or drag to upload cover image'}</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Excerpt */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs text-muted uppercase tracking-wide">Excerpt</label>
            <span className="text-xs text-muted">{excerpt.length}/200</span>
          </div>
          <textarea
            value={excerpt}
            onChange={e => setExcerpt(e.target.value.slice(0, 200))}
            rows={2}
            placeholder="Short summary shown on blog card preview…"
            className="w-full border border-light-gray rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent bg-white resize-none font-body"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-xs text-muted uppercase tracking-wide mb-2">Content *</label>
          <RichEditor content={content} onChange={setContent} />
        </div>

        {/* Delete */}
        {existingPost && (
          <div className="pt-4 border-t border-light-gray">
            <button
              onClick={() => setDeleteModal(true)}
              className="flex items-center gap-2 text-red-400 hover:text-red-600 text-sm transition-colors"
            >
              <Trash2 size={15} /> Delete this post
            </button>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full shadow-2xl">
            <h3 className="font-heading text-primary text-xl font-bold mb-2">Delete Post?</h3>
            <p className="text-muted text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal(false)} className="flex-1 border border-light-gray text-muted py-2.5 rounded-lg text-sm">Cancel</button>
              <button onClick={deletePost} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg text-sm font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
