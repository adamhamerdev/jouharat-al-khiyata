import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/types'
import ProductFormModal from './ProductFormModal'

export default function AdminProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  async function loadProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data ?? [])
    setLoading(false)
  }

  useEffect(() => { loadProducts() }, [])

  async function handleDelete(id: string) {
    await supabase.from('products').delete().eq('id', id)
    setConfirmDelete(null)
    loadProducts()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-dark)', fontSize: '22px', margin: 0 }}>
          المنتجات
        </h2>
        <button
          onClick={() => setShowAdd(true)}
          style={{ background: 'var(--brand-dark)', color: 'var(--gold-light)', fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 700, padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}
        >
          + إضافة منتج
        </button>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>جارٍ التحميل...</p>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🧵</div>
          <p style={{ margin: 0 }}>لا توجد منتجات بعد — أضيفي أول منتج!</p>
        </div>
      ) : (
        <div style={{ borderRadius: '12px', border: '0.5px solid var(--pink-border)', overflow: 'hidden' }}>
          {products.map((product, index) => (
            <div
              key={product.id}
              style={{
                padding: '14px 16px',
                borderBottom: index < products.length - 1 ? '0.5px solid var(--pink-border)' : 'none',
                display: 'flex', alignItems: 'center', gap: '14px',
                background: '#fff',
              }}
            >
              {/* Thumbnail */}
              <div style={{ width: '56px', height: '56px', borderRadius: '8px', background: '#f5e8ec', overflow: 'hidden', flexShrink: 0 }}>
                {product.image_url
                  ? <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🧵</div>
                }
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-dark)', fontSize: '15px', fontWeight: 700, marginBottom: '3px' }}>
                  {product.name}
                </div>
                <div style={{ color: 'var(--gold)', fontSize: '13px', fontWeight: 600 }}>
                  {product.price !== null ? `${product.price.toLocaleString()} دج` : 'السعر بالتراضي'}
                </div>
                {!product.is_available && (
                  <span style={{ display: 'inline-block', background: '#fdecea', color: '#c0304a', fontSize: '11px', padding: '2px 8px', borderRadius: '4px', marginTop: '3px' }}>
                    غير متاح
                  </span>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                {confirmDelete === product.id ? (
                  <>
                    <button
                      onClick={() => handleDelete(product.id)}
                      style={{ fontFamily: 'var(--font-body)', fontSize: '12px', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', background: '#fdecea', color: '#c0304a', border: '1px solid #f0ccd5' }}
                    >
                      تأكيد الحذف
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      style={{ fontFamily: 'var(--font-body)', fontSize: '12px', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', background: 'var(--brand-dark)', color: 'var(--gold-light)', border: 'none' }}
                    >
                      إلغاء
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditing(product)}
                      style={{ fontFamily: 'var(--font-body)', fontSize: '12px', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', background: 'var(--brand-dark)', color: 'var(--gold-light)', border: 'none' }}
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => setConfirmDelete(product.id)}
                      style={{ fontFamily: 'var(--font-body)', fontSize: '12px', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', background: '#fff', color: '#c0304a', border: '1px solid var(--pink-border)' }}
                    >
                      حذف
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <ProductFormModal onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); loadProducts() }} />
      )}
      {editing && (
        <ProductFormModal initial={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); loadProducts() }} />
      )}
    </div>
  )
}
