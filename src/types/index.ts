export interface Product {
  id: string
  name: string
  description: string | null
  price: number | null
  image_url: string | null        // legacy single image
  image_urls: string[]            // multiple images (new)
  is_available: boolean
  variant_label: string | null    // e.g. "المقاس" / "اللون"
  variant_options: string[] | null // e.g. ["S","M","L","XL"]
  created_at: string
}

export interface Order {
  id: string
  product_id: string | null
  product_name: string
  customer_name: string
  phone: string
  quantity: number
  variant_selected: string | null
  created_at: string
}

export interface OrderInsert {
  product_id: string | null
  product_name: string
  customer_name: string
  phone: string
  quantity: number
  variant_selected: string | null
}

export interface ProductInsert {
  name: string
  description: string | null
  price: number | null
  image_url: string | null
  image_urls: string[]
  is_available: boolean
  variant_label: string | null
  variant_options: string[] | null
}
