import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { BlogPost } from '../../types'

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserEmail(data.user.email ?? '')
    })
    loadPosts()
  }, [])

  const loadPosts = () => {
    supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setPosts(data); setLoading(false) })
  }

  const togglePublish = async (post: BlogPost) => {
    const updates: Partial<BlogPost> = { published: !post.published }
    if (!post.published && !post.published_at) {
      updates.published_at = new Date().toISOString()
    }
    await supabase.from('blog_posts').update(updates).eq('id', post.id)
    loadPosts()
  }

  const deletePost = async (id: string) => {
    await supabase.from('blog_posts').delete().eq('id', id)
    setDeleteId(null)
    loadPosts()
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  const total = posts.length
  const published = posts.filter(p => p.published).length
  const drafts = total - published

  return (
    <div className="min-h-screen bg-light-gray font-body">
      {/* Header */}
      <header className="bg-primary px-6 py-4 flex items-center justify-between">
        <div>
          <p className="font-heading text-offwhite font-bold text-xl">ProTech Admin</p>
          <p className="text-offwhite/40 text-xs">{userEmail}</p>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-2 text-offwhite/60 hover:text-accent text-sm transition-colors"
        >
          <LogOut size={15} /> Sign Out
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Posts', value: total },
            { label: 'Published', value: published },
            { label: 'Drafts', value: drafts },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm text-center">
              <p className="font-heading text-3xl font-bold text-primary">{s.value}</p>
              <p className="text-muted text-xs mt-1 uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-heading text-primary text-xl font-bold">All Posts</h2>
          <Link
            to="/admin/new"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-primary font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors"
          >
            <Plus size={16} /> New Post
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 text-muted">
              <p>No posts yet.</p>
              <Link to="/admin/new" className="text-accent hover:underline mt-2 inline-block">Create your first post →</Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-light-gray">
                <tr className="text-left text-xs text-muted uppercase tracking-wide">
                  <th className="px-6 py-3">Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id} className="border-b border-light-gray/50 hover:bg-light-gray/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-primary max-w-xs truncate">{post.title}</td>
                    <td className="px-4 py-4 text-muted">{post.category ?? '—'}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${post.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-muted text-xs">{formatDate(post.created_at)}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <Link to={`/admin/edit/${post.id}`} className="p-1.5 text-muted hover:text-accent transition-colors" title="Edit">
                          <Edit size={15} />
                        </Link>
                        <button
                          onClick={() => togglePublish(post)}
                          className="p-1.5 text-muted hover:text-accent transition-colors"
                          title={post.published ? 'Unpublish' : 'Publish'}
                        >
                          {post.published ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                        <button
                          onClick={() => setDeleteId(post.id)}
                          className="p-1.5 text-muted hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full shadow-2xl">
            <h3 className="font-heading text-primary text-xl font-bold mb-2">Delete Post?</h3>
            <p className="text-muted text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 border border-light-gray text-muted py-2.5 rounded-lg text-sm hover:border-primary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deletePost(deleteId)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
