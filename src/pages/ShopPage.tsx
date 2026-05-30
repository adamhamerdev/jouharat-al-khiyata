import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Product, OrderInsert } from '@/types'
import ProductCard from '@/components/ProductCard'
import OrderModal from '@/components/OrderModal'

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [orderState, setOrderState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setProducts(data ?? [])
        setLoading(false)
      })
  }, [])

  async function handleOrderSubmit(order: OrderInsert) {
    setOrderState('submitting')
    // Generate ID client-side so we never need to SELECT back the row.
    // Anon users can INSERT orders but not SELECT them (RLS), so
    // .insert().select().single() fails for non-admin sessions (mobile).
    const orderId = crypto.randomUUID()
    const { error } = await supabase.from('orders').insert([{ ...order, id: orderId }])
    if (error) { setOrderState('error'); return }
    try {
      await supabase.functions.invoke('send-order-email', { body: { ...order, order_id: orderId } })
    } catch {
      // Email failure is non-blocking — order is already saved
    }
    setOrderState('success')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--brand-light)' }}>

      {/* Nav */}
      <nav style={{
        background: 'var(--brand-dark)', padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 40,
        boxShadow: '0 2px 12px rgba(122,26,58,0.18)',
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', fontSize: '22px', fontWeight: 700 }}>
            جوهرة الخياطة
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop: '1px' }}>معسكر</div>
        </div>
        <a href="#products" style={{
          color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '14px',
          fontFamily: 'var(--font-body)', fontWeight: 500,
          padding: '6px 14px', borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.2)',
          transition: 'all 0.2s',
        }}>
          المنتجات
        </a>
      </nav>

      {/* Hero */}
      <div style={{
        background: 'var(--brand-surface)', padding: '56px 24px 40px',
        textAlign: 'center', borderBottom: '1px solid var(--pink-border)',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
          background: 'linear-gradient(90deg, transparent, var(--gold), var(--gold-light), var(--gold), transparent)',
        }} />
        <div style={{ color: 'var(--gold)', fontSize: '32px', marginBottom: '10px', lineHeight: 1 }}>◆</div>
        <h1 style={{
          fontFamily: 'var(--font-display)', color: 'var(--brand-dark)',
          fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 700, margin: '0 0 10px',
        }}>
          جوهرة الخياطة
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px', margin: 0, fontFamily: 'var(--font-body)' }}>
          خياطة وتطريز بلمسة أنثوية راقية
        </p>
      </div>

      {/* Products */}
      <div id="products" style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)', color: 'var(--brand-dark)',
          fontSize: '22px', fontWeight: 700, margin: '0 0 28px',
          display: 'flex', alignItems: 'center', gap: '14px',
        }}>
          منتجاتنا
          <span style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, var(--pink-border), transparent)' }} />
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '80px 0', fontSize: '16px' }}>
            جارٍ التحميل...
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '80px 0', fontSize: '16px' }}>
            لا توجد منتجات حالياً، تفضلي لاحقاً 🧵
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '20px',
          }}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} onOrder={setSelectedProduct} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ background: 'var(--brand-dark)', padding: '24px', textAlign: 'center', marginTop: '40px' }}>
        <div style={{ color: 'var(--gold)', fontSize: '16px', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>
          جوهرة الخياطة
        </div>
        <p style={{ color: 'rgba(245,215,142,0.6)', fontSize: '12px', margin: 0 }}>
          معسكر © {new Date().getFullYear()} — جميع الحقوق محفوظة
        </p>
      </footer>

      {/* Order Modal */}
      {selectedProduct && orderState !== 'success' && (
        <OrderModal
          product={selectedProduct}
          onClose={() => { setSelectedProduct(null); setOrderState('idle') }}
          onSubmit={handleOrderSubmit}
        />
      )}

      {/* Success Modal */}
      {orderState === 'success' && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 50, padding: '1rem',
        }}>
          <div style={{
            background: '#fff', borderRadius: '20px', padding: '40px 32px',
            textAlign: 'center', maxWidth: '360px', width: '100%',
            border: '0.5px solid var(--pink-border)',
          }}>
            <div style={{ fontSize: '52px', marginBottom: '14px' }}>✅</div>
            <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-dark)', fontSize: '22px', margin: '0 0 10px' }}>
              تم استلام طلبك!
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '0 0 24px', lineHeight: 1.6 }}>
              سنتواصل معك قريباً على رقم هاتفك 📞
            </p>
            <button
              onClick={() => { setSelectedProduct(null); setOrderState('idle') }}
              style={{
                background: 'var(--brand-dark)', color: 'var(--gold-light)',
                fontFamily: 'var(--font-body)', fontWeight: 700,
                padding: '12px 32px', borderRadius: '10px', border: 'none',
                cursor: 'pointer', fontSize: '15px',
              }}
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* Error toast */}
      {orderState === 'error' && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px',
          background: '#c0304a', color: '#fff',
          padding: '12px 20px', borderRadius: '10px',
          fontFamily: 'var(--font-body)', fontSize: '14px',
          zIndex: 60,
        }}>
          حدث خطأ، يرجى المحاولة مجدداً
          <button onClick={() => setOrderState('idle')} style={{ background: 'none', border: 'none', color: '#fff', marginRight: '10px', cursor: 'pointer', fontSize: '16px' }}>×</button>
        </div>
      )}
    </div>
  )
}
