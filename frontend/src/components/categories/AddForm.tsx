import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { crateCategorySchema } from "@/schema/category.schema";
import type { Category } from "@/types/category.type";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "@/services/category.service";
type Props = {
  onSuccess: () => void;
};
export default function AddForm({ onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(crateCategorySchema),
  });
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createCategory,
  });
  const onSubmit = async (data: Partial<Category>) => {
    mutation.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        onSuccess();
        toast.success("Create category success");
      },
      onError: () => {
        toast.error("Create category failed");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3">
        <label htmlFor="name" className="font-medium mb-1 block">
          Name
        </label>
        <Input
          id="name"
          placeholder="Name..."
          className="outline-0 shadow-none focus-visible:ring-0"
          {...register("name")}
        />
        {errors.name?.message && (
          <span className="text-red-700">{errors.name?.message}</span>
        )}
      </div>
      <div className="mb-3">
        <label htmlFor="name" className="font-medium mb-1 block">
          Status
        </label>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              defaultChecked={true}
              className="data-checked:bg-[#4880FF]"
            />
          )}
        />
        {errors.status?.message && (
          <span className="text-red-700">{errors.status?.message}</span>
        )}
      </div>
      <Button
        className="bg-[#4880FF] disabled:bg-gray-700"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Saving..." : "Save Change"}
      </Button>
    </form>
  );
}
