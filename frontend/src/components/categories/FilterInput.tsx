import { useSearchParams } from "react-router-dom";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ChangeEvent } from "react";
import { debounce } from "@/utils/utils";

export default function FilterInput() {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className="flex gap-3 mb-3 bg-white p-3 items-center">
      <Select
        onValueChange={(value) => {
          setSearchParams({
            status: value,
            s: searchParams.get("s") ?? "",
          });
        }}
      >
        <SelectTrigger className="w-full max-w-48 py-5">
          <SelectValue placeholder="Select a status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="publish">Publish</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
        </SelectContent>
      </Select>
      <Input
        placeholder="Search..."
        className="py-5"
        onChange={debounce((e: ChangeEvent<HTMLInputElement>) => {
          setSearchParams({
            status: searchParams.get("status") ?? "all",
            s: e.target.value,
          });
        })}
      />
    </div>
  );
}
