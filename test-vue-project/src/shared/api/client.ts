import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

export class ApiClient {
  private client: AxiosInstance

  constructor(baseURL: string = 'https://jsonplaceholder.typicode.com') {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token here if needed
        // const token = localStorage.getItem('token')
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`
        // }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle global errors here
        console.error('API Error:', error)
        return Promise.reject(error)
      }
    )
  }

  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config)
    return response.data
  }

  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config)
    return response.data
  }

  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config)
    return response.data
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config)
    return response.data
  }

  async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(url, data, config)
    return response.data
  }
}

// Mock API client for development
export class MockApiClient extends ApiClient {
  private mockDelay = 300

  constructor() {
    super('')
  }

  private simulateDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, this.mockDelay))
  }

  async get<T = unknown>(url: string, _config?: AxiosRequestConfig): Promise<T> { // eslint-disable-line @typescript-eslint/no-unused-vars
    // _config parameter is kept for API compatibility
    await this.simulateDelay()

    // Mock responses based on URL
    if (url.includes('/users')) {
      return this.mockUsers() as T
    } else if (url.includes('/products')) {
      return this.mockProducts() as T
    }

    return [] as unknown as T
  }

  async post<T = unknown>(url: string, data?: unknown, _config?: AxiosRequestConfig): Promise<T> { // eslint-disable-line @typescript-eslint/no-unused-vars
    // _config parameter is kept for API compatibility
    await this.simulateDelay()
    return { id: Date.now(), ...(data as object) } as T
  }

  async put<T = unknown>(url: string, data?: unknown, _config?: AxiosRequestConfig): Promise<T> { // eslint-disable-line @typescript-eslint/no-unused-vars
    // _config parameter is kept for API compatibility
    await this.simulateDelay()
    return data as T
  }

  async delete<T = unknown>(url: string, _config?: AxiosRequestConfig): Promise<T> { // eslint-disable-line @typescript-eslint/no-unused-vars
    // _config parameter is kept for API compatibility
    await this.simulateDelay()
    // Mock delete - in real implementation, url would be used
    console.log(`Mock delete request to: ${url}`)
    return {} as T
  }

  private mockUsers() {
    return [
      { id: 1, name: 'John Doe', email: 'john@example.com', username: 'johndoe' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', username: 'janesmith' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', username: 'bobjohnson' },
    ]
  }

  private mockProducts() {
    return [
      { id: 1, title: 'Product 1', description: 'Description 1', price: 100, stock: 10, category: 'Category 1' },
      { id: 2, title: 'Product 2', description: 'Description 2', price: 200, stock: 5, category: 'Category 2' },
      { id: 3, title: 'Product 3', description: 'Description 3', price: 150, stock: 20, category: 'Category 1' },
    ]
  }
}

// Export singleton instance
export const apiClient = import.meta.env.DEV
  ? new MockApiClient()
  : new ApiClient()
