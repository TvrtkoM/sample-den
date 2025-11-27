"use client";

import { Search } from "react-feather";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type FormData = {
  search: string;
};

const SampleSearch: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { isValid }
  } = useForm<FormData>();

  const onSubmitHandler: SubmitHandler<FormData> = (data) => {
    console.log("Searching for", data.search);
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
