import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="container">
      <LoaderCircle className="animate-spin h-10 w-10 text-primary mx-auto mt-20" />
    </div>
  );
}
