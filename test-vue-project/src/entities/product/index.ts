export interface Product {
  id: number
  title: string
  description: string
  price: number
  discountPercentage?: number
  rating?: number
  stock: number
  brand?: string
  category: string
  thumbnail?: string
  images?: string[]
}

export interface ProductFormData extends Omit<Product, 'id' | 'images' | 'rating'> {
  images?: string
}

export const createEmptyProduct = (): ProductFormData => ({
  title: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  brand: '',
  discountPercentage: 0,
})
