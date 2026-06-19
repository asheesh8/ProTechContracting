import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError('Access denied. Check your credentials.')
      setLoading(false)
      return
    }

    navigate('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 font-body">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="font-heading text-offwhite text-3xl font-bold">ProTech</p>
          <p className="text-accent text-xs tracking-widest uppercase mt-1">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-4">
          <div>
            <label className="block text-offwhite/60 text-xs uppercase tracking-wide mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-offwhite text-sm focus:outline-none focus:border-accent transition-colors placeholder-white/30"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-offwhite/60 text-xs uppercase tracking-wide mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-offwhite text-sm focus:outline-none focus:border-accent transition-colors placeholder-white/30"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent/90 disabled:opacity-60 text-primary font-semibold py-3 rounded-lg transition-colors text-sm mt-2"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-white/20 text-xs mt-8">ProTech Contracting — Admin Only</p>
      </div>
    </div>
  )
}
