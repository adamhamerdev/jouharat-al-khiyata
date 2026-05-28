import type { Product } from '@/types'

interface Props {
  product: Product
  onOrder: (product: Product) => void
}

export default function ProductCard({ product, onOrder }: Props) {
  const { name, description, price, image_url, is_available } = product

  return (
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      border: '0.5px solid var(--pink-border)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        height: '200px',
        background: '#f5e8ec',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {image_url ? (
          <img
            src={image_url}
            alt={name}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '48px',
          }}>
            🧵
          </div>
        )}
        {!is_available && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff',
            fontFamily: 'var(--font-display)',
            fontSize: '16px',
            fontWeight: 600,
          }}>
            غير متوفر حالياً
          </div>
        )}
      </div>

      <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--brand-dark)',
          fontSize: '16px',
          fontWeight: 700,
          margin: 0,
        }}>
          {name}
        </h3>

        {description && (
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>
            {description}
          </p>
        )}

        <div style={{ marginTop: 'auto' }}>
          {price !== null ? (
            <p style={{ color: 'var(--gold)', fontSize: '15px', fontWeight: 700, margin: '0 0 10px' }}>
              {price.toLocaleString('ar-DZ')} دج
            </p>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic', margin: '0 0 10px' }}>
              السعر بالتراضي
            </p>
          )}

          <button
            onClick={() => onOrder(product)}
            disabled={!is_available}
            style={{
              width: '100%',
              background: is_available ? 'var(--brand-dark)' : '#ccc',
              color: is_available ? 'var(--gold-light)' : '#888',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              fontWeight: 700,
              padding: '9px',
              borderRadius: '8px',
              border: 'none',
              cursor: is_available ? 'pointer' : 'not-allowed',
            }}
          >
            اطلبي الآن
          </button>
        </div>
      </div>
    </div>
  )
}
