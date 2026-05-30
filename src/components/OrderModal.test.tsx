import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import OrderModal from './OrderModal'
import type { Product } from '@/types'

const product: Product = {
  id: '1',
  name: 'قفطان مطرز',
  description: null,
  price: 4500,
  image_url: null,
  image_urls: [],
  is_available: true,
  variant_label: null,
  variant_options: null,
  created_at: '2026-01-01',
}

describe('OrderModal', () => {
  it('renders product name in modal title', () => {
    render(<OrderModal product={product} onClose={vi.fn()} onSubmit={vi.fn()} />)
    expect(screen.getByText(/قفطان مطرز/)).toBeInTheDocument()
  })

  it('quantity defaults to 1', () => {
    render(<OrderModal product={product} onClose={vi.fn()} onSubmit={vi.fn()} />)
    expect(screen.getByDisplayValue('1')).toBeInTheDocument()
  })

  it('shows validation error when submitting empty name', async () => {
    render(<OrderModal product={product} onClose={vi.fn()} onSubmit={vi.fn()} />)
    fireEvent.click(screen.getByText(/تأكيد الطلب/))
    await waitFor(() => {
      expect(screen.getByText('يرجى إدخال اسمك الكامل')).toBeInTheDocument()
    })
  })

  it('shows validation error for invalid phone', async () => {
    render(<OrderModal product={product} onClose={vi.fn()} onSubmit={vi.fn()} />)
    fireEvent.change(screen.getByPlaceholderText('اسمك الكامل'), { target: { value: 'فاطمة' } })
    fireEvent.change(screen.getByPlaceholderText('05XXXXXXXX'), { target: { value: '0412345678' } })
    fireEvent.click(screen.getByText(/تأكيد الطلب/))
    await waitFor(() => {
      expect(screen.getByText('رقم الهاتف غير صحيح (يجب أن يبدأ بـ 05، 06، أو 07)')).toBeInTheDocument()
    })
  })

  it('calls onSubmit with correct data when form is valid', async () => {
    const onSubmit = vi.fn()
    render(<OrderModal product={product} onClose={vi.fn()} onSubmit={onSubmit} />)
    fireEvent.change(screen.getByPlaceholderText('اسمك الكامل'), { target: { value: 'فاطمة بن علي' } })
    fireEvent.change(screen.getByPlaceholderText('05XXXXXXXX'), { target: { value: '0550123456' } })
    fireEvent.click(screen.getByText(/تأكيد الطلب/))
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        product_id: '1',
        product_name: 'قفطان مطرز',
        customer_name: 'فاطمة بن علي',
        phone: '0550123456',
        quantity: 1,
        variant_selected: null,
      })
    })
  })
})
