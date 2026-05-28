import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ProductCard from './ProductCard'
import type { Product } from '@/types'

const baseProduct: Product = {
  id: '1',
  name: 'قفطان مطرز',
  description: 'قفطان جميل',
  price: 4500,
  image_url: null,
  is_available: true,
  created_at: '2026-01-01',
}

describe('ProductCard', () => {
  it('renders product name', () => {
    render(<ProductCard product={baseProduct} onOrder={vi.fn()} />)
    expect(screen.getByText('قفطان مطرز')).toBeInTheDocument()
  })

  it('renders price in DZD when price is set', () => {
    render(<ProductCard product={baseProduct} onOrder={vi.fn()} />)
    expect(screen.getByText(/4[,.\u066C]?500.*دج/)).toBeInTheDocument()
  })

  it('renders "السعر بالتراضي" when price is null', () => {
    const p = { ...baseProduct, price: null }
    render(<ProductCard product={p} onOrder={vi.fn()} />)
    expect(screen.getByText('السعر بالتراضي')).toBeInTheDocument()
  })

  it('renders "اطلبي الآن" button when available', () => {
    render(<ProductCard product={baseProduct} onOrder={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'اطلبي الآن' })).toBeInTheDocument()
  })

  it('shows unavailable state when is_available is false', () => {
    const p = { ...baseProduct, is_available: false }
    render(<ProductCard product={p} onOrder={vi.fn()} />)
    expect(screen.getByText('غير متوفر حالياً')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('calls onOrder with product when button clicked', async () => {
    const onOrder = vi.fn()
    const { getByRole } = render(<ProductCard product={baseProduct} onOrder={onOrder} />)
    getByRole('button', { name: 'اطلبي الآن' }).click()
    expect(onOrder).toHaveBeenCalledWith(baseProduct)
  })
})
