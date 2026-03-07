import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/entities/user'
import { useUsersQuery, useUserQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation } from './useUserQueries'

export const useUserStore = defineStore('user', () => {
  // UI State (хранится в Pinia)
  const selectedUserId = ref<number | null>(null)
  const searchQuery = ref('')
  const currentPage = ref(1)
  const itemsPerPage = ref(10)
  const sortBy = ref('name')
  const sortDirection = ref<'asc' | 'desc'>('asc')

  // Композабельные функции Vue Query
  const usersQuery = useUsersQuery({ search: searchQuery.value })
  const selectedUserQuery = useUserQuery(selectedUserId.value!)
  const createUserMutation = useCreateUserMutation()
  const updateUserMutation = useUpdateUserMutation()
  const deleteUserMutation = useDeleteUserMutation()

  // Геттеры для UI
  const selectedUser = computed(() => {
    if (!selectedUserId.value) return null
    return selectedUserQuery.data.value
  })

  const hasSelection = computed(() => selectedUserId.value !== null)

  // Геттеры, объединяющие данные
  const users = computed(() => {
    const data = usersQuery.data.value || []

    // Сортировка на клиенте (временное решение)
    if (sortBy.value && sortDirection.value) {
      return [...data].sort((a, b) => {
        const aValue = a[sortBy.value as keyof User]
        const bValue = b[sortBy.value as keyof User]

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection.value === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }

        return 0
      })
    }

    return data
  })

  const loading = computed(() => usersQuery.isLoading.value || selectedUserQuery.isLoading.value)
  const error = computed(() => usersQuery.error.value ? usersQuery.error.value.message : null)
  const userCount = computed(() => users.value.length)

  // Пагинация
  const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return users.value.slice(start, end)
  })

  const totalPages = computed(() => Math.ceil(userCount.value / itemsPerPage.value))

  // Действия для UI
  const selectUser = (userId: number) => {
    selectedUserId.value = userId
  }

  const clearSelection = () => {
    selectedUserId.value = null
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
    // Обновляем запрос с новым поисковым запросом
    usersQuery.refetch()
  }

  const setSort = (field: string, direction: 'asc' | 'desc') => {
    sortBy.value = field
    sortDirection.value = direction
  }

  const setPagination = (page: number, perPage: number) => {
    currentPage.value = page
    itemsPerPage.value = perPage
  }

  const goToNextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }

  const goToPrevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  // Действия для данных (делегируют к Vue Query)
  const fetchUsers = () => {
    usersQuery.refetch()
  }

  const refetchSelectedUser = () => {
    if (selectedUserId.value) {
      selectedUserQuery.refetch()
    }
  }

  const createUser = async (userData: Omit<User, 'id'>) => {
    return createUserMutation.mutateAsync(userData)
  }

  const updateUser = async (id: number, userData: Partial<User>) => {
    return updateUserMutation.mutateAsync({ id, data: userData })
  }

  const deleteUser = async (id: number) => {
    return deleteUserMutation.mutateAsync(id)
  }

  // Вспомогательные геттеры
  const isCreating = computed(() => createUserMutation.isPending.value)
  const isUpdating = computed(() => updateUserMutation.isPending.value)
  const isDeleting = computed(() => deleteUserMutation.isPending.value)

  const createError = computed(() => createUserMutation.error.value?.message)
  const updateError = computed(() => updateUserMutation.error.value?.message)
  const deleteError = computed(() => deleteUserMutation.error.value?.message)

  return {
    // UI State
    selectedUserId,
    searchQuery,
    currentPage,
    itemsPerPage,
    sortBy,
    sortDirection,

    // Геттеры
    selectedUser,
    hasSelection,
    users: paginatedUsers,
    allUsers: users,
    loading,
    error,
    userCount,
    totalPages,

    // UI Actions
    selectUser,
    clearSelection,
    setSearchQuery,
    setSort,
    setPagination,
    goToNextPage,
    goToPrevPage,

    // Data Actions
    fetchUsers,
    refetchSelectedUser,
    createUser,
    updateUser,
    deleteUser,

    // Mutation статусы
    isCreating,
    isUpdating,
    isDeleting,
    createError,
    updateError,
    deleteError,

    // Vue Query объекты (для доступа к дополнительным методам)
    usersQuery,
    selectedUserQuery,
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
  }
})
