import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductSchema } from "@/schema/product.schema";
import type { Product } from "@/types/product.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAllCategories } from "@/services/category.service";
import { getProduct, updateProduct } from "@/services/product.service";
import FilemanagerModal from "@/components/modals/FilemanagerModal";

export default function ProductUpdate() {
  const [gallaries, setGallaries] = useState<number[]>([]);
  const [fileManagerModal, setFileManagerModal] = useState<boolean>(false);
  const [fileManagerType, setFileManagerType] = useState<string>("thumbnail");
  const { id } = useParams();
  const { data: product } = useQuery({
    queryKey: ["products", id],
    queryFn: () => getProduct(+id!),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues,
  } = useForm({
    resolver: zodResolver(createProductSchema),
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: Partial<Product>) => updateProduct(+id!, data),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getAllCategories(),
    initialData: [],
  });

  const onSubmit = (data: Partial<Product>) => {
    mutation.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        toast.success("Update product success");
      },
      onError: () => {
        toast.error("Update product failed");
      },
    });
  };

  useEffect(() => {
    if (!product) {
      return;
    }

    setValue("name", product.name);
    setValue("price", product.price);
    setValue("salePrice", product.salePrice);
    setValue("shortDescription", product.shortDescription);
    setValue("description", JSON.parse(product.description));
    setValue("thumbnail", product.thumbnail);
    product.images.forEach((img, index) => {
      setValue(`images.${index}`, img.image);
    });
    setValue("categoryId", product.categoryId);
    setValue("status", product.status);

    const setGallaryImage = () => {
      setGallaries(product.images.map(() => Date.now()));
    };
    setGallaryImage();
  }, [product, setValue]);

  return (
    <div>
      <h1 className="mb-5 font-medium text-3xl">Update Product</h1>
      <div className="bg-white p-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="name" className="block mb-1 font-medium">
              Name
            </label>
            <Input
              id="name"
              placeholder="Name..."
              className="shadow-none outline-0 focus-visible:ring-0"
              {...register("name")}
            />
            {errors.name?.message && (
              <span className="text-red-700">{errors.name?.message}</span>
            )}
          </div>

          <div className="flex gap-3">
            <div className="flex-1 mb-3">
              <label htmlFor="price" className="block mb-1 font-medium">
                Price
              </label>
              <Input
                id="price"
                type="number"
                placeholder="Price..."
                className="shadow-none outline-0 focus-visible:ring-0"
                {...register("price")}
              />
              {errors.price?.message && (
                <span className="text-red-700">{errors.price?.message}</span>
              )}
            </div>
            <div className="flex-1 mb-3">
              <label htmlFor="name" className="block mb-1 font-medium">
                Sale Price
              </label>
              <Input
                id="price"
                type="number"
                placeholder="Sale Price..."
                className="shadow-none outline-0 focus-visible:ring-0"
                {...register("salePrice")}
              />
              {errors.salePrice?.message && (
                <span className="text-red-700">
                  {errors.salePrice?.message}
                </span>
              )}
            </div>
          </div>
          <div className="mb-3">
            <label
              htmlFor="shortDescription"
              className="block mb-1 font-medium"
            >
              Short Description
            </label>
            <Textarea
              className="shadow-none outline-0 focus-visible:ring-0 h-25"
              placeholder="Short Description..."
              {...register("shortDescription")}
            />
            {errors.shortDescription?.message && (
              <span className="text-red-700">
                {errors.shortDescription?.message}
              </span>
            )}
          </div>
          <div className="mb-3">
            <label
              htmlFor="shortDescription"
              className="block mb-1 font-medium"
            >
              Description
            </label>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <ReactQuill
                  value={field.value}
                  onChange={(
                    _contentHTML: unknown,
                    _delta: unknown,
                    _source: unknown,
                    editor: ReactQuill.UnprivilegedEditor,
                  ) => {
                    field.onChange(editor.getContents());
                  }}
                  className="border border-[#ddd] h-75 overflow-auto"
                />
              )}
            />
            {errors.description?.message && (
              <span className="text-red-700">
                {errors.description?.message}
              </span>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="thumbnail" className="block mb-1 font-medium">
              Thumbnail
            </label>
            <div className="flex gap-2">
              <Input
                id="thumbnail"
                type="text"
                placeholder="Thumbnail..."
                className="shadow-none outline-0 focus-visible:ring-0"
                {...register("thumbnail")}
              />
              <Button
                type="button"
                className="bg-[#4880FF]"
                onClick={() => {
                  setFileManagerModal(true);
                  setFileManagerType("thumbnail");
                }}
              >
                Chọn ảnh
              </Button>
            </div>
            {errors.thumbnail?.message && (
              <span className="text-red-700">{errors.thumbnail?.message}</span>
            )}
            {getValues("thumbnail") && (
              <img
                src={`${import.meta.env.VITE_SERVER_UPLOAD}${getValues("thumbnail")}`}
                width={300}
              />
            )}
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-medium">Gallaries</label>
            {gallaries.map((_, index) => (
              <Fragment key={index}>
                <div className="flex gap-2 mb-2">
                  <Input
                    type="text"
                    placeholder="Image..."
                    className="shadow-none outline-0 focus-visible:ring-0"
                    {...register(`images.${index}`)}
                  />

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      className="bg-[#4880FF]"
                      onClick={() => {
                        setFileManagerModal(true);
                        setFileManagerType(`images.${index}`);
                      }}
                    >
                      Chọn ảnh
                    </Button>
                    <Button
                      type="button"
                      variant={"destructive"}
                      onClick={() => {
                        setGallaries(gallaries.filter((_, i) => i !== index));
                      }}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
                {errors.images?.[index]?.message && (
                  <span className="block mb-2 text-red-700">
                    {errors.images[index]?.message}
                  </span>
                )}
                {getValues(`images.${index}`) && (
                  <img
                    className="mb-3"
                    src={`${import.meta.env.VITE_SERVER_UPLOAD}${getValues(`images.${index}`)}`}
                    width={120}
                  />
                )}
              </Fragment>
            ))}

            <Button
              type="button"
              className="bg-[#4880FF] mt-2"
              onClick={() => {
                setGallaries([...gallaries, Date.now()]);
              }}
            >
              Thêm ảnh
            </Button>
          </div>

          <div>
            <label htmlFor="thumbnail" className="block mb-1 font-medium">
              Category
            </label>
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => {
                return (
                  <Select
                    onValueChange={field.onChange}
                    value={
                      field.value?.toString() ?? product?.categoryId.toString()
                    }
                  >
                    <SelectTrigger className="py-5 w-full max-w-48">
                      <SelectValue placeholder="Select a Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">None</SelectItem>
                      {categories.map((category) => (
                        <SelectItem
                          value={category.id.toString()}
                          key={category.id}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              }}
            />
            {errors.categoryId?.message && (
              <span className="text-red-700">{errors.categoryId?.message}</span>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="status" className="block mb-1 font-medium">
              Status
            </label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Switch
                  id="status"
                  checked={field.value ?? product?.status}
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
          <Button className="bg-[#4880FF] disabled:bg-gray-700">
            Save Change
          </Button>
          <Button variant={"destructive"} type="button">
            <Link to={"/products"}>Cancel</Link>
          </Button>
        </form>
      </div>
      <FilemanagerModal
        onSelected={(data: { path: string }) => {
          if (fileManagerType === "thumbnail") {
            setValue("thumbnail", data.path);
          }

          if (fileManagerType.startsWith("images.")) {
            const index = fileManagerType.split(".").slice(-1).join();
            setValue(`images.${+index}`, data.path);
          }
        }}
        open={fileManagerModal}
        onClose={() => setFileManagerModal(false)}
      />
    </div>
  );
}
