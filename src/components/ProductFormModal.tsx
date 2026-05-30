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
    initial?.price != null ? String(initial.price) : ''
  )
  const [isAvailable, setIsAvailable] = useState(initial?.is_available ?? true)

  // Multiple images
  const initialUrls = initial?.image_urls?.length
    ? initial.image_urls
    : initial?.image_url
    ? [initial.image_url]
    : []
  const [existingUrls, setExistingUrls] = useState<string[]>(initialUrls)
  const [newFiles, setNewFiles] = useState<File[]>([])

  // Variants
  const [variantLabel, setVariantLabel] = useState(initial?.variant_label ?? '')
  const [variantOptions, setVariantOptions] = useState(
    initial?.variant_options?.join('، ') ?? ''
  )

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function removeExisting(url: string) {
    setExistingUrls(prev => prev.filter(u => u !== url))
  }

  function removeNewFile(index: number) {
    setNewFiles(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSave() {
    if (!name.trim()) { setError('يرجى إدخال اسم المنتج'); return }
    setSaving(true); setError('')

    // Upload new images
    const uploadedUrls: string[] = []
    for (const file of newFiles) {
      const ext = file.name.split('.').pop()
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('product-images').upload(filename, file, { upsert: true })
      if (uploadError) { setError('فشل رفع إحدى الصور'); setSaving(false); return }
      const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(filename)
      uploadedUrls.push(urlData.publicUrl)
    }

    const allUrls = [...existingUrls, ...uploadedUrls]

    // Parse variant options from comma/semicolon separated string
    const parsedOptions = variantOptions
      .split(/[,،;؛\n]/)
      .map(o => o.trim())
      .filter(Boolean)

    const productData: ProductInsert = {
      name: name.trim(),
      description: description.trim() || null,
      price: price ? parseFloat(price) : null,
      image_url: allUrls[0] ?? null,     // keep legacy field in sync
      image_urls: allUrls,
      is_available: isAvailable,
      variant_label: variantLabel.trim() || null,
      variant_options: parsedOptions.length > 0 ? parsedOptions : null,
    }

    if (initial?.id) {
      const { error: e } = await supabase.from('products').update(productData).eq('id', initial.id)
      if (e) { setError('فشل تحديث المنتج'); setSaving(false); return }
    } else {
      const { error: e } = await supabase.from('products').insert([productData])
      if (e) { setError('فشل إضافة المنتج'); setSaving(false); return }
    }

    setSaving(false); onSaved()
  }

  const totalImages = existingUrls.length + newFiles.length

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}
    >
      <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '500px', border: '0.5px solid var(--pink-border)', maxHeight: '92vh', overflowY: 'auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-dark)', fontSize: '18px', margin: 0 }}>
            {initial?.id ? '✏️ تعديل المنتج' : '➕ إضافة منتج جديد'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-muted)' }}>×</button>
        </div>

        {/* Name */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '5px' }}>اسم المنتج *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: قفطان مطرز" style={inputStyle} />
        </div>

        {/* Description */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '5px' }}>الوصف (اختياري)</label>
          <textarea value={description ?? ''} onChange={(e) => setDescription(e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
        </div>

        {/* Price */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '5px' }}>
            السعر (دج) — <span style={{ fontStyle: 'italic' }}>اتركه فارغاً للسعر بالتراضي</span>
          </label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="مثال: 4500" dir="ltr" style={{ ...inputStyle, textAlign: 'right' }} />
        </div>

        {/* Images section */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '8px' }}>
            الصور ({totalImages} صورة)
          </label>

          {/* Existing image thumbnails */}
          {existingUrls.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
              {existingUrls.map((url, i) => (
                <div key={i} style={{ position: 'relative', width: '72px', height: '72px' }}>
                  <img src={url} alt="" style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--pink-border)' }} />
                  <button
                    onClick={() => removeExisting(url)}
                    style={{ position: 'absolute', top: '-6px', left: '-6px', width: '20px', height: '20px', background: '#c0304a', color: '#fff', border: 'none', borderRadius: '50%', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
                  >×</button>
                </div>
              ))}
            </div>
          )}

          {/* New file previews */}
          {newFiles.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
              {newFiles.map((file, i) => (
                <div key={i} style={{ position: 'relative', width: '72px', height: '72px' }}>
                  <img src={URL.createObjectURL(file)} alt="" style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '8px', border: '2px dashed var(--gold)' }} />
                  <button
                    onClick={() => removeNewFile(i)}
                    style={{ position: 'absolute', top: '-6px', left: '-6px', width: '20px', height: '20px', background: '#c0304a', color: '#fff', border: 'none', borderRadius: '50%', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
                  >×</button>
                </div>
              ))}
            </div>
          )}

          <label style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'var(--brand-surface)', border: '1px dashed var(--pink-border)',
            borderRadius: '8px', padding: '10px 14px', cursor: 'pointer',
            color: 'var(--text-muted)', fontSize: '13px',
          }}>
            📎 إضافة صور (يمكن اختيار أكثر من صورة)
            <input
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files) setNewFiles(prev => [...prev, ...Array.from(e.target.files!)])
              }}
            />
          </label>
        </div>

        {/* Variants section */}
        <div style={{ marginBottom: '14px', background: 'var(--brand-surface)', borderRadius: '10px', padding: '14px', border: '0.5px solid var(--pink-border)' }}>
          <label style={{ display: 'block', color: 'var(--brand-dark)', fontSize: '13px', fontWeight: 700, marginBottom: '10px' }}>
            🏷️ خيارات المنتج (اختياري)
          </label>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px' }}>نوع الخيار</label>
            <input
              value={variantLabel}
              onChange={(e) => setVariantLabel(e.target.value)}
              placeholder="مثال: المقاس / اللون / النوع"
              style={{ ...inputStyle, background: '#fff' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px' }}>الخيارات المتاحة (مفصولة بفاصلة)</label>
            <input
              value={variantOptions}
              onChange={(e) => setVariantOptions(e.target.value)}
              placeholder="مثال: صغير، وسط، كبير، كبير جداً"
              style={{ ...inputStyle, background: '#fff' }}
            />
          </div>
        </div>

        {/* Availability */}
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input type="checkbox" id="available" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: 'var(--brand-dark)' }} />
          <label htmlFor="available" style={{ color: 'var(--brand-dark)', fontSize: '14px', cursor: 'pointer' }}>المنتج متاح للطلب</label>
        </div>

        {error && <p style={{ color: '#c0304a', fontSize: '13px', margin: '0 0 14px', padding: '8px 12px', background: '#fdecea', borderRadius: '6px' }}>{error}</p>}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: 'var(--brand-dark)', color: 'var(--gold-light)', fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 700, padding: '11px', borderRadius: '10px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'جارٍ الحفظ...' : 'حفظ'}
          </button>
          <button onClick={onClose} style={{ flex: 1, background: '#fff', color: 'var(--brand-dark)', fontFamily: 'var(--font-body)', fontSize: '14px', padding: '11px', borderRadius: '10px', border: '1px solid var(--pink-border)', cursor: 'pointer' }}>
            إلغاء
          </button>
        </div>
      </div>
    </div>
  )
}
