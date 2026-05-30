import { useState } from 'react'
import type { Product } from '@/types'

interface Props {
  product: Product
  onOrder: (product: Product) => void
}

export default function ProductCard({ product, onOrder }: Props) {
  const { name, description, price, image_url, image_urls, is_available, variant_label, variant_options } = product

  // Merge legacy image_url with image_urls array
  const allImages = image_urls?.length
    ? image_urls
    : image_url
    ? [image_url]
    : []

  const [currentIndex, setCurrentIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const hasMultiple = allImages.length > 1

  function prev(e: React.MouseEvent) {
    e.stopPropagation()
    setCurrentIndex(i => (i - 1 + allImages.length) % allImages.length)
  }

  function next(e: React.MouseEvent) {
    e.stopPropagation()
    setCurrentIndex(i => (i + 1) % allImages.length)
  }

  function openLightbox() {
    if (allImages.length === 0) return
    setLightboxIndex(currentIndex)
    setLightboxOpen(true)
  }

  function lightboxPrev(e: React.MouseEvent) {
    e.stopPropagation()
    setLightboxIndex(i => (i - 1 + allImages.length) % allImages.length)
  }

  function lightboxNext(e: React.MouseEvent) {
    e.stopPropagation()
    setLightboxIndex(i => (i + 1) % allImages.length)
  }

  const hasVariants = variant_label && variant_options && variant_options.length > 0

  return (
    <>
      <div style={{
        background: '#fff', borderRadius: '12px',
        border: '0.5px solid var(--pink-border)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
      }}>
        {/* Image carousel */}
        <div
          onClick={openLightbox}
          style={{
            height: '220px', background: '#f5e8ec',
            position: 'relative', overflow: 'hidden',
            cursor: allImages.length > 0 ? 'zoom-in' : 'default',
          }}
        >
          {allImages.length > 0 ? (
            <img
              src={allImages[currentIndex]}
              alt={name}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>
              🧵
            </div>
          )}

          {/* Unavailable overlay */}
          {!is_available && (
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600,
            }}>
              غير متوفر حالياً
            </div>
          )}

          {/* Carousel arrows */}
          {hasMultiple && (
            <>
              <button onClick={prev} style={{
                position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%',
                width: '28px', height: '28px', cursor: 'pointer', fontSize: '13px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--brand-dark)', boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
              }}>›</button>
              <button onClick={next} style={{
                position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%',
                width: '28px', height: '28px', cursor: 'pointer', fontSize: '13px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--brand-dark)', boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
              }}>‹</button>
            </>
          )}

          {/* Dot indicators */}
          {hasMultiple && (
            <div style={{
              position: 'absolute', bottom: '8px', left: 0, right: 0,
              display: 'flex', justifyContent: 'center', gap: '5px',
            }}>
              {allImages.map((_, i) => (
                <div
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setCurrentIndex(i) }}
                  style={{
                    width: i === currentIndex ? '16px' : '6px',
                    height: '6px', borderRadius: '3px',
                    background: i === currentIndex ? 'var(--gold)' : 'rgba(255,255,255,0.7)',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                />
              ))}
            </div>
          )}

          {/* Image count badge */}
          {hasMultiple && (
            <div style={{
              position: 'absolute', top: '8px', left: '8px',
              background: 'rgba(0,0,0,0.45)', color: '#fff',
              fontSize: '11px', padding: '2px 7px', borderRadius: '10px',
              fontFamily: 'var(--font-body)',
            }}>
              {currentIndex + 1}/{allImages.length}
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-dark)', fontSize: '16px', fontWeight: 700, margin: 0 }}>
            {name}
          </h3>

          {description && (
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>
              {description}
            </p>
          )}

          {/* Variant badge (preview only) */}
          {hasVariants && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{variant_label}:</span>
              {variant_options!.slice(0, 3).map(opt => (
                <span key={opt} style={{
                  background: 'var(--brand-surface)', border: '0.5px solid var(--pink-border)',
                  color: 'var(--brand-dark)', fontSize: '11px',
                  padding: '2px 8px', borderRadius: '4px',
                }}>
                  {opt}
                </span>
              ))}
              {variant_options!.length > 3 && (
                <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>+{variant_options!.length - 3}</span>
              )}
            </div>
          )}

          <div style={{ marginTop: 'auto', paddingTop: '6px' }}>
            {price !== null ? (
              <p style={{ color: 'var(--gold)', fontSize: '15px', fontWeight: 700, margin: '0 0 10px' }}>
                {price.toLocaleString()} دج
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
                fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 700,
                padding: '10px', borderRadius: '8px', border: 'none',
                cursor: is_available ? 'pointer' : 'not-allowed',
              }}
            >
              اطلبي الآن
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && allImages.length > 0 && (
        <div
          onClick={() => setLightboxOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100, padding: '16px',
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxOpen(false)}
            style={{
              position: 'absolute', top: '16px', left: '16px',
              background: 'rgba(255,255,255,0.1)', border: 'none',
              color: '#fff', fontSize: '24px', width: '40px', height: '40px',
              borderRadius: '50%', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            ×
          </button>

          {/* Counter */}
          {hasMultiple && (
            <div style={{
              position: 'absolute', top: '20px', right: '20px',
              color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontFamily: 'var(--font-body)',
            }}>
              {lightboxIndex + 1} / {allImages.length}
            </div>
          )}

          {/* Main image */}
          <img
            src={allImages[lightboxIndex]}
            alt={name}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '100%', maxHeight: '90vh',
              objectFit: 'contain', borderRadius: '8px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
            }}
          />

          {/* Lightbox arrows */}
          {hasMultiple && (
            <>
              <button onClick={lightboxNext} style={{
                position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.12)', border: 'none', color: '#fff',
                fontSize: '28px', width: '48px', height: '48px', borderRadius: '50%',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>‹</button>
              <button onClick={lightboxPrev} style={{
                position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.12)', border: 'none', color: '#fff',
                fontSize: '28px', width: '48px', height: '48px', borderRadius: '50%',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>›</button>
            </>
          )}

          {/* Thumbnail strip */}
          {hasMultiple && (
            <div style={{
              position: 'absolute', bottom: '16px', left: 0, right: 0,
              display: 'flex', justifyContent: 'center', gap: '8px', padding: '0 16px',
            }}>
              {allImages.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt=""
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(i) }}
                  style={{
                    width: '52px', height: '52px', objectFit: 'cover',
                    borderRadius: '6px', cursor: 'pointer',
                    border: i === lightboxIndex ? '2px solid var(--gold)' : '2px solid transparent',
                    opacity: i === lightboxIndex ? 1 : 0.6,
                    transition: 'all 0.15s',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
