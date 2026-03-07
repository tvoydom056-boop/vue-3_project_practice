import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query"
import type { User } from "@/entities/user"

export function useUsersQuery() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => [],
  })
}

export function useUserQuery(id: number) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => ({ id, name: "", email: "", username: "" } as User),
    enabled: !!id,
  })
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => ({} as User),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => ({} as User),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}
