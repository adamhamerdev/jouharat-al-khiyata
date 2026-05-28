export interface Product {
  id: string
  name: string
  description: string | null
  price: number | null
  image_url: string | null
  is_available: boolean
  created_at: string
}

export interface Order {
  id: string
  product_id: string | null
  product_name: string
  customer_name: string
  phone: string
  quantity: number
  created_at: string
}

export interface OrderInsert {
  product_id: string | null
  product_name: string
  customer_name: string
  phone: string
  quantity: number
}

export interface ProductInsert {
  name: string
  description: string | null
  price: number | null
  image_url: string | null
  is_available: boolean
}
