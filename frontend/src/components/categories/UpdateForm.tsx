import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { crateCategorySchema } from "@/schema/category.schema";
import { instance } from "@/lib/axios";
import type { Category } from "@/types/category.type";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { updateCategory } from "@/services/category.service";
type Props = {
  onSuccess: () => void;
  id: number;
};
const getCategory = async (id: number) => {
  const response = await instance.get(`/categories/${id}`);
  return response.data.data;
};
export default function UpdateForm({ onSuccess, id }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({
    resolver: zodResolver(crateCategorySchema),
  });
  const {
    data: category,
    error: errorData,
    isLoading,
  } = useQuery({
    queryKey: ["categories", id],
    queryFn: () => getCategory(id),
    initialData: {},
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateCategory(id),
  });
  const onSubmit = async (data: Partial<Category>) => {
    mutation.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        onSuccess();
        toast.success("Update category success");
      },
      onError: () => {
        toast.error("Update category failed");
      },
    });
  };

  useEffect(() => {
    setValue("name", category.name);
    setValue("status", category.status);
  }, [category]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset disabled={isLoading} className="disabled:bg-gray-200 p-3">
        {errorData ? (
          <p>{errorData.message}</p>
        ) : (
          <>
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
          </>
        )}
      </fieldset>
    </form>
  );
}
