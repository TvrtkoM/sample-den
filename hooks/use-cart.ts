import { signIn } from '@/lib/auth-client'
import { addToCart, fetchCart, removeFromCart } from '@/lib/fetch/cart'
import { fetchSamplesByIds, fetchSamplesPriceSumByIds } from '@/lib/fetch/samples'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from './use-session'
import { defaultCartPageSize } from '@/lib/constants'

const CART_QUERY_KEY = ['cart']

/** Fetches the raw cart data (list of sample ids) and keeps it fresh on window focus. */
export function useCart() {
  return useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: fetchCart,
    refetchOnWindowFocus: 'always',
  })
}

/** Returns the flat array of sample ids currently in the cart. */
export function useCartIds() {
  const { data } = useCart()
  return data?.items ?? []
}

/** Returns the total number of distinct samples in the cart. */
export function useCartTotalCount() {
  const allIds = useCartIds()
  return allIds.length
}

/** Fetches and returns the summed price of all samples in the cart. */
export function useCartTotalPrice() {
  const ids = useCartIds()

  const sortedIds = [...ids]
  sortedIds.sort()

  return useQuery({
    queryKey: ['cartTotalPrice', sortedIds],
    queryFn: () => fetchSamplesPriceSumByIds(sortedIds),
    placeholderData: keepPreviousData,
    meta: { suppressToast: true },
  })
}

/**
 * Fetches the full sample documents for the given page of the cart.
 * Returns samples in cart insertion order.
 *
 * @param pageNumber - 1-based page index within the cart.
 * @defaultValue pageNumber `1`
 */
export function useCartItems(pageNumber = 1) {
  const allIds = useCartIds()

  const pageIds = allIds.slice((pageNumber - 1) * defaultCartPageSize, pageNumber * defaultCartPageSize)

  return useQuery({
    queryKey: ['cartSamples', pageIds],
    queryFn: async () => {
      const unorderedItems = await fetchSamplesByIds(pageIds)

      const items = pageIds
        .map((id) => unorderedItems.find((item) => item._id === id))
        .filter((item): item is NonNullable<typeof item> => Boolean(item))

      return { samples: items }
    },
    placeholderData: keepPreviousData,
  })
}

/** Returns the number of items currently in the cart. */
export function useCartSize() {
  const items = useCartIds()
  return items.length
}

/**
 * Returns `true` when the given sample is currently in the cart.
 *
 * @param sampleId - Sanity document id of the sample to check.
 */
export function useIsInCart(sampleId: string) {
  const items = useCartIds()
  return items.includes(sampleId)
}

/**
 * Returns a mutation that adds a sample to the cart with optimistic updates.
 * Automatically creates an anonymous session when the user is not signed in.
 */
export function useAddToCart() {
  const queryClient = useQueryClient()
  const { session } = useSession()

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

/**
 * Returns a mutation that removes a sample from the cart with optimistic updates.
 * Intended for use outside the cart drawer (e.g. the store listing toggle button).
 * Rolls back the optimistic update on failure.
 */
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

/**
 * Options for {@link useRemoveFromCartInCart}.
 */
type UseRemoveFromCartInCartOptions = {
  /** Called immediately before the optimistic cart update, useful for triggering removal animations. */
  onRemoveStart?: () => void
}

/**
 * Returns a mutation that removes a sample from the cart for use inside the
 * cart drawer. Calls `onRemoveStart` before applying the optimistic update so
 * the item can animate out before disappearing.
 * Rolls back the optimistic update on failure.
 *
 * @param options - Callback hooks for the removal lifecycle.
 */
export function useRemoveFromCartInCart({ onRemoveStart }: UseRemoveFromCartInCartOptions) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: removeFromCart,
    onMutate: async () => {
      onRemoveStart?.()
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY })
      const previous = queryClient.getQueryData<{ items: string[] }>(CART_QUERY_KEY)
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

/**
 * Returns a callback that adds or removes a sample from the cart depending on
 * whether it is currently present.
 *
 * @returns `(sampleId: string) => void` toggle function.
 */
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
