"use client";

import AppPagination from "../AppPagination";
import { Button } from "../ui/button";

type CartFooterProps = {
  pageNum: number;
  setPageNum: (pageNum: number) => void;
  totalPages: number;
};

const CartFooter = ({ pageNum, setPageNum, totalPages }: CartFooterProps) => {
  return (
    <div className="flex flex-col">
      {totalPages > 1 && (
        <div className="border-t py-4">
          <AppPagination
            pageNum={pageNum}
            onPageChange={setPageNum}
            totalPages={totalPages}
          />
        </div>
      )}
      <div className="flex flex-col gap-4 px-4 py-4 border-t h-52">
        <div className="text-xl">
          <span className="font-bold">Total:</span> 100 $
        </div>
        <Button size={"lg"} className="text-xl">
          Go to checkout
        </Button>
      </div>
    </div>
  );
};

export default CartFooter;
