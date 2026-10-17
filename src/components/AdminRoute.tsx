import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// Client-side gate only: it decides what to render, not what data is reachable.
// The real protection is row-level security in supabase-schema.sql, which lets
// any *authenticated* user write posts — so keep Supabase sign-ups disabled and
// create the admin account by hand.
export default function AdminRoute() {
  const [checking, setChecking] = useState(true)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuthed(!!data.session)
      setChecking(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (checking) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return authed ? <Outlet /> : <Navigate to="/admin/login" replace />
}
