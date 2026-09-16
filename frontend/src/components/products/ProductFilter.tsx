import { useSearchParams } from "react-router-dom";
import {
  SelectContent,
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { debounce } from "@/utils/utils";
import type { ChangeEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "@/services/category.service";

export default function ProductFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentQuery = Object.fromEntries(searchParams.entries());
  const { data: allCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  return (
    <div className="flex items-center gap-3 bg-white mb-3 p-3">
      <Select
        defaultValue={searchParams.get("status") ?? ""}
        onValueChange={(value) => {
          setSearchParams({
            ...currentQuery,
            status: value,
          });
        }}
      >
        <SelectTrigger className="py-5 w-full max-w-48">
          <SelectValue placeholder="Select a status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="publish">Publish</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
        </SelectContent>
      </Select>
      <Select
        defaultValue={searchParams.get("category") ?? ""}
        onValueChange={(value) => {
          setSearchParams({
            ...currentQuery,
            category: value,
          });
        }}
      >
        <SelectTrigger className="py-5 w-full max-w-48">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {allCategories?.map((value) => (
            <SelectItem key={value.id} value={value.id.toString()}>
              {value.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        placeholder="Search..."
        className="py-5"
        defaultValue={searchParams.get("s") ?? ""}
        onChange={debounce((e: ChangeEvent<HTMLInputElement>) => {
          setSearchParams({
            ...currentQuery,
            s: e.target.value,
          });
        })}
      />
    </div>
  );
}
