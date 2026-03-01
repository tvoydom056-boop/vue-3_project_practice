export interface User {
  id: number
  name: string
  email: string
  phone?: string
  username: string
  address?: {
    street: string
    suite: string
    city: string
    zipcode: string
  }
  company?: {
    name: string
    catchPhrase: string
    bs: string
  }
}

export interface UserFormData extends Omit<User, 'id' | 'address' | 'company'> {
  street?: string
  city?: string
  zipcode?: string
  companyName?: string
}

export const createEmptyUser = (): UserFormData => ({
  name: '',
  email: '',
  phone: '',
  username: '',
})
