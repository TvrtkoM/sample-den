'use client'

import { useCartTotalPrice } from '@/hooks/use-cart'
import AppPagination from '../AppPagination'
import { Skeleton } from '../ui/skeleton'
import CheckoutButton from './CheckoutButton'

const CartTotalPrice = () => {
  const { data: totalPrice, isLoading, isError } = useCartTotalPrice()

  if (isLoading) {
    return <Skeleton className="h-7 w-1/2 mx-auto" />
  }

  if (isError) {
    return <p className="text-sm text-red-600 mx-auto h-7 flex items-center">Couldn&apos;t load total</p>
  }

  return (
    <p className="text-xl h-7 text-center">
      <span className="font-bold">Total:</span> {totalPrice} $
    </p>
  )
}

/**
 * Props for {@link CartFooter}.
 */
type CartFooterProps = {
  /** The currently active cart page number. */
  pageNum: number
  /** Called with the new page number when the user changes pages. */
  setPageNum: (pageNum: number) => void
  /** Total number of cart pages. */
  totalPages: number
}

/**
 * Footer section of the cart drawer showing pagination, total price, and the checkout button.
 * Pagination is hidden when there is only a single page of items.
 */
const CartFooter = ({ pageNum, setPageNum, totalPages }: CartFooterProps) => {
  return (
    <div className="flex flex-col">
      {totalPages > 1 && (
        <div className="border-t py-4">
          <AppPagination pageNum={pageNum} onPageChange={setPageNum} totalPages={totalPages} />
        </div>
      )}
      <div className="flex flex-col gap-4 px-4 py-4 border-t h-52">
        <CartTotalPrice />
        <CheckoutButton />
      </div>
    </div>
  )
}

export default CartFooter
