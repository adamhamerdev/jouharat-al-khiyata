import { useState } from 'react'
import type { ProductInsert, Product } from '@/types'
import { supabase } from '@/lib/supabase'

interface Props {
  initial?: Product
  onClose: () => void
  onSaved: () => void
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', borderRadius: '8px',
  border: '1px solid var(--pink-border)', fontFamily: 'var(--font-body)',
  fontSize: '14px', outline: 'none', background: 'var(--brand-surface)',
  boxSizing: 'border-box', color: 'var(--brand-dark)',
}

export default function ProductFormModal({ initial, onClose, onSaved }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [price, setPrice] = useState<string>(
    initial?.price !== null && initial?.price !== undefined ? String(initial.price) : ''
  )
  const [isAvailable, setIsAvailable] = useState(initial?.is_available ?? true)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    if (!name.trim()) { setError('يرجى إدخال اسم المنتج'); return }
    setSaving(true)
    setError('')

    let image_url = initial?.image_url ?? null

    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const filename = `${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filename, imageFile, { upsert: true })
      if (uploadError) { setError('فشل رفع الصورة'); setSaving(false); return }
      const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(filename)
      image_url = urlData.publicUrl
    }

    const productData: ProductInsert = {
      name: name.trim(),
      description: description.trim() || null,
      price: price ? parseFloat(price) : null,
      image_url,
      is_available: isAvailable,
    }

    if (initial?.id) {
      const { error: updateError } = await supabase.from('products').update(productData).eq('id', initial.id)
      if (updateError) { setError('فشل تحديث المنتج'); setSaving(false); return }
    } else {
      const { error: insertError } = await supabase.from('products').insert([productData])
      if (insertError) { setError('فشل إضافة المنتج'); setSaving(false); return }
    }

    setSaving(false)
    onSaved()
  }

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}
    >
      <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '480px', border: '0.5px solid var(--pink-border)', maxHeight: '92vh', overflowY: 'auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-dark)', fontSize: '18px', margin: 0 }}>
            {initial?.id ? '✏️ تعديل المنتج' : '➕ إضافة منتج جديد'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-muted)' }}>×</button>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '5px' }}>اسم المنتج *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: قفطان مطرز" style={inputStyle} />
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '5px' }}>الوصف (اختياري)</label>
          <textarea
            value={description ?? ''}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '5px' }}>
            السعر (دج) — <span style={{ fontStyle: 'italic' }}>اتركه فارغاً للسعر بالتراضي</span>
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="مثال: 4500"
            dir="ltr"
            style={{ ...inputStyle, textAlign: 'right' }}
          />
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '5px' }}>صورة المنتج</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--brand-dark)' }} />
          {initial?.image_url && !imageFile && (
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '5px 0 0' }}>
              📎 يوجد صورة حالية — اختاري صورة جديدة للاستبدال
            </p>
          )}
        </div>

        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="checkbox"
            id="available"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
            style={{ width: '16px', height: '16px', accentColor: 'var(--brand-dark)' }}
          />
          <label htmlFor="available" style={{ color: 'var(--brand-dark)', fontSize: '14px', cursor: 'pointer' }}>
            المنتج متاح للطلب
          </label>
        </div>

        {error && (
          <p style={{ color: '#c0304a', fontSize: '13px', margin: '0 0 14px', padding: '8px 12px', background: '#fdecea', borderRadius: '6px' }}>
            {error}
          </p>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ flex: 1, background: 'var(--brand-dark)', color: 'var(--gold-light)', fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 700, padding: '11px', borderRadius: '10px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'جارٍ الحفظ...' : 'حفظ'}
          </button>
          <button
            onClick={onClose}
            style={{ flex: 1, background: '#fff', color: 'var(--brand-dark)', fontFamily: 'var(--font-body)', fontSize: '14px', padding: '11px', borderRadius: '10px', border: '1px solid var(--pink-border)', cursor: 'pointer' }}
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  )
}
