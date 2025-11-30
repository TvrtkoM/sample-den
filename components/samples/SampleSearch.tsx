"use client";

import { Search } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRouter, useSearchParams } from "next/navigation";

type FormData = {
  search: string;
};

const SampleSearch: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { isValid },
    reset
  } = useForm<FormData>({ defaultValues: { search: "" } });

  const onSubmitHandler: SubmitHandler<FormData> = (data) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", data.search);
    router.push(`/samples?${params.toString()}`);
    reset();
  };

  return (
    <form className="flex gap-3" onSubmit={handleSubmit(onSubmitHandler)}>
      <div className="relative flex-1">
        <Search
          size={16}
          className="absolute top-1/2 -translate-y-1/2 text-gray-400 left-3"
        />
        <Input
          type="text"
          placeholder="Search samples..."
          {...register("search", { required: true })}
          autoComplete="off"
          className="pl-10"
        />
      </div>
      <Button type="submit" variant={"outline"} disabled={!isValid}>
        Search
      </Button>
    </form>
  );
};

export default SampleSearch;
