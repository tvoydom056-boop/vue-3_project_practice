import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/entities/user'

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const userCount = computed(() => users.value.length)

  // Actions
  const fetchUsers = async () => {
    loading.value = true
    error.value = null
    try {
      // TODO: Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 500))
      users.value = []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch users'
    } finally {
      loading.value = false
    }
  }

  const createUser = async (userData: Omit<User, 'id'>) => {
    loading.value = true
    try {
      // TODO: Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 500))
      const newUser: User = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        username: userData.username,
        phone: userData.phone || undefined
      }
      users.value.push(newUser)
      return newUser
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create user'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (id: number, userData: Partial<User>) => {
    loading.value = true
    try {
      // TODO: Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 500))
      const index = users.value.findIndex(user => user.id === id)
      if (index !== -1) {
        const updatedUser = { ...users.value[index], ...userData }
        // Ensure required fields are present
        if (updatedUser.id && updatedUser.name && updatedUser.email && updatedUser.username) {
          users.value[index] = updatedUser as User
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update user'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (id: number) => {
    loading.value = true
    try {
      // TODO: Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 500))
      users.value = users.value.filter(user => user.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete user'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    users,
    loading,
    error,

    // Getters
    userCount,

    // Actions
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  }
})
