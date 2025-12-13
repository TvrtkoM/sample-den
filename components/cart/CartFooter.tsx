"use client";

import { Button } from "../ui/button";

const CartFooter = () => {
  return (
    <div className="flex flex-col gap-4 px-4 py-4 border-t h-52">
      <div className="text-xl">
        <span className="font-bold">Total:</span> 100 $
      </div>
      <Button size={"lg"} className="text-xl">
        Go to checkout
      </Button>
    </div>
  );
};

export default CartFooter;
