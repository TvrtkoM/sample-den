"use client";

import { useSamplesSearchParams } from "@/lib/search-params/hooks";
import { Search } from "lucide-react";
import { debounce } from "nuqs";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const SampleSearch = () => {
  const [{ search }, setSearchParams] = useSamplesSearchParams({
    limitUrlUpdates: debounce(250)
  });

  return (
    <form className="flex gap-3">
      <div className="relative flex-1">
        <Search
          size={16}
          className="absolute top-1/2 -translate-y-1/2 text-gray-400 left-3"
        />
        <Input
          type="text"
          value={search}
          onChange={(e) => {
            setSearchParams({ search: e.target.value, page: null });
          }}
          placeholder="Search samples..."
          autoComplete="off"
          className="pl-10"
        />
      </div>
      <Button
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          setSearchParams(null);
        }}
      >
        Clear
      </Button>
    </form>
  );
};

export default SampleSearch;
