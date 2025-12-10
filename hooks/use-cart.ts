import { signIn, useSession } from '@/lib/auth-client'
import { addToCart, fetchCart, removeFromCart } from '@/lib/fetch/cart'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const CART_QUERY_KEY = ['cart']

export function useCart() {
  return useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: fetchCart,
    staleTime: 1000 * 60 * 5,
  })
}

export function useCartItems() {
  const { data } = useCart()
  return data?.items ?? []
}

export function useCartSize() {
  const items = useCartItems()
  return items.length
}

export function useIsInCart(sampleId: string) {
  const items = useCartItems()
  return items.includes(sampleId)
}

export function useAddToCart() {
  const queryClient = useQueryClient()
  const { data: session } = useSession()

  return useMutation({
    mutationFn: async (sampleId: string) => {
      // If no session, create anonymous user first
      if (!session) {
        await signIn.anonymous()
      }
      return addToCart(sampleId)
    },
    onMutate: async (sampleId) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY })
      const previous = queryClient.getQueryData<{ items: string[] }>(CART_QUERY_KEY)

      queryClient.setQueryData<{ items: string[] }>(CART_QUERY_KEY, (old) => ({
        items: [...(old?.items ?? []), sampleId],
      }))

      return { previous }
    },
    onError: (_err, _sampleId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
    },
  })
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: removeFromCart,
    onMutate: async (sampleId) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY })
      const previous = queryClient.getQueryData<{ items: string[] }>(CART_QUERY_KEY)

      queryClient.setQueryData<{ items: string[] }>(CART_QUERY_KEY, (old) => ({
        items: (old?.items ?? []).filter((id) => id !== sampleId),
      }))

      return { previous }
    },
    onError: (_err, _sampleId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
    },
  })
}

export function useToggleCartItem() {
  const { data } = useCart()
  const addToCart = useAddToCart()
  const removeFromCart = useRemoveFromCart()

  return (sampleId: string) => {
    const isInCart = data?.items.includes(sampleId) ?? false
    if (isInCart) {
      removeFromCart.mutate(sampleId)
    } else {
      addToCart.mutate(sampleId)
    }
  }
}
