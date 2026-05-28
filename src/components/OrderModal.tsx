import { useState } from 'react'
import type { Product, OrderInsert } from '@/types'
import { validateName, validatePhone } from '@/lib/validations'

interface Props {
  product: Product
  onClose: () => void
  onSubmit: (order: OrderInsert) => void
}

export default function OrderModal({ product, onClose, onSubmit }: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({})

  function handleSubmit() {
    const newErrors: { name?: string; phone?: string } = {}
    if (!validateName(name)) newErrors.name = 'يرجى إدخال اسمك الكامل'
    if (!validatePhone(phone)) newErrors.phone = 'رقم الهاتف غير صحيح (يجب أن يبدأ بـ 05، 06، أو 07)'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onSubmit({
      product_id: product.id,
      product_name: product.name,
      customer_name: name.trim(),
      phone,
      quantity,
    })
  }

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 50, padding: '1rem',
      }}
    >
      <div style={{
        background: '#fff', borderRadius: '16px', padding: '24px',
        width: '100%', maxWidth: '420px', border: '0.5px solid var(--pink-border)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--brand-dark)', margin: 0 }}>
            🛍️ {product.name}
          </h2>
          <button onClick={onClose} aria-label="إغلاق" style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-muted)' }}>×</button>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '4px' }}>الاسم الكامل</label>
          <input
            placeholder="اسمك الكامل"
            value={name}
            onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })) }}
            style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${errors.name ? '#c0304a' : 'var(--pink-border)'}`, fontFamily: 'var(--font-body)', fontSize: '14px', outline: 'none', background: 'var(--brand-surface)' }}
          />
          {errors.name && <p style={{ color: '#c0304a', fontSize: '12px', margin: '4px 0 0' }}>{errors.name}</p>}
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '4px' }}>رقم الهاتف</label>
          <input
            placeholder="05XXXXXXXX"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: undefined })) }}
            dir="ltr"
            style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${errors.phone ? '#c0304a' : 'var(--pink-border)'}`, fontFamily: 'var(--font-body)', fontSize: '14px', textAlign: 'right', outline: 'none', background: 'var(--brand-surface)' }}
          />
          {errors.phone && <p style={{ color: '#c0304a', fontSize: '12px', margin: '4px 0 0' }}>{errors.phone}</p>}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '4px' }}>عدد القطع</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--pink-border)', background: '#fff', cursor: 'pointer', fontSize: '16px', color: 'var(--brand-dark)' }}>−</button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              style={{ width: '60px', textAlign: 'center', padding: '6px', borderRadius: '8px', border: '1px solid var(--pink-border)', fontFamily: 'var(--font-body)', fontSize: '14px' }}
            />
            <button onClick={() => setQuantity(q => q + 1)} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--pink-border)', background: '#fff', cursor: 'pointer', fontSize: '16px', color: 'var(--brand-dark)' }}>+</button>
          </div>
        </div>

        <div style={{ background: 'var(--brand-surface)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', border: '0.5px solid var(--pink-border)' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>💳 الدفع نقداً عند الاستلام</span>
        </div>

        <button
          onClick={handleSubmit}
          style={{ width: '100%', background: 'var(--brand-dark)', color: 'var(--gold-light)', fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 700, padding: '12px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}
        >
          تأكيد الطلب ✨
        </button>
      </div>
    </div>
  )
}
