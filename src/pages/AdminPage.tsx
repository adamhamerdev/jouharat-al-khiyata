import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'
import AdminProductList from '@/components/AdminProductList'

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session))
    return () => subscription.unsubscribe()
  }, [])

  async function handleLogin() {
    setLoading(true)
    setLoginError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setLoginError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
    setLoading(false)
  }

  if (!session) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--brand-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ background: '#fff', borderRadius: '20px', padding: '36px 32px', width: '100%', maxWidth: '380px', border: '0.5px solid var(--pink-border)', boxShadow: '0 4px 24px rgba(122,26,58,0.08)' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ color: 'var(--gold)', fontSize: '28px', marginBottom: '6px' }}>◆</div>
            <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-dark)', fontSize: '24px', margin: '0 0 4px' }}>
              لوحة التحكم
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>جوهرة الخياطة</p>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '5px' }}>
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              dir="ltr"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--pink-border)', fontFamily: 'var(--font-body)', fontSize: '14px', outline: 'none', background: 'var(--brand-surface)', textAlign: 'right', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '5px' }}>
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleLogin() }}
              dir="ltr"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--pink-border)', fontFamily: 'var(--font-body)', fontSize: '14px', outline: 'none', background: 'var(--brand-surface)', boxSizing: 'border-box' }}
            />
          </div>

          {loginError && (
            <p style={{ color: '#c0304a', fontSize: '13px', textAlign: 'center', margin: '0 0 14px', padding: '8px', background: '#fdecea', borderRadius: '6px' }}>
              {loginError}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ width: '100%', background: 'var(--brand-dark)', color: 'var(--gold-light)', fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 700, padding: '13px', borderRadius: '10px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'جارٍ الدخول...' : 'دخول'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--brand-light)' }}>
      <div style={{ background: 'var(--brand-dark)', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 12px rgba(122,26,58,0.18)' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', fontSize: '18px', fontWeight: 700 }}>لوحة التحكم</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>جوهرة الخياطة</div>
        </div>
        <button
          onClick={() => supabase.auth.signOut()}
          style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-body)', fontSize: '13px', padding: '7px 18px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer' }}
        >
          خروج
        </button>
      </div>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '36px 24px' }}>
        <AdminProductList />
      </div>
    </div>
  )
}
