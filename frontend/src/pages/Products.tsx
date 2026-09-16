import AlertModal from "@/components/modals/AlertModal";
import Pagination from "@/components/pagination/Pagination";
import ProductFilter from "@/components/products/ProductFilter";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteProduct,
  getProducts,
  updateProduct,
} from "@/services/product.service";
import type { SearchParams } from "@/types/category.type";
import type { Product } from "@/types/product.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function Products() {
  const [searchParams] = useSearchParams();
  const filters = Object.fromEntries(
    searchParams.entries(),
  ) as unknown as SearchParams;
  const {
    data: { data: products, totalPage },
    error,
    isLoading,
  } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),
    initialData: {
      data: [],
      totalPage: 0,
    },
  });
  const page = searchParams.get("page") ?? 1;
  const [confirmModal, setConfirmModal] = useState<boolean>(false);
  const [idDelete, setIdDelete] = useState<number>(0);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return deleteProduct(id);
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: Partial<Product>) => {
      return updateProduct(id!, { status });
    },
  });

  const queryClient = useQueryClient();

  const handleChangeStatus = (id: number, status: boolean) => {
    statusMutation.mutate(
      { id, status },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["products"] });
          toast.success("Change status success");
        },
        onError: () => {
          toast.error("Change status failed");
        },
      },
    );
  };
  return (
    <div>
      <h1 className="mb-5 font-medium text-3xl">Products</h1>
      <Button className="bg-[#4880FF] mb-3" size={"lg"}>
        <Link to={"/products/create"}>Thêm mới</Link>
      </Button>
      <ProductFilter />
      {isLoading ? (
        <span className="block py-3">Loading...</span>
      ) : error ? (
        <span className="block py-3">Error: {error.message}</span>
      ) : (
        <>
          <Table className="bg-white p-5 rounded-lg">
            <TableHeader>
              <TableRow>
                <TableHead className="px-3 py-2 w-[5%]">STT</TableHead>
                <TableHead className="px-3 py-2 w-[10%]">Ảnh</TableHead>
                <TableHead className="px-3 py-2">Tên</TableHead>
                <TableHead className="px-3 py-2 w-[10%]">Giá</TableHead>
                <TableHead className="px-3 py-2 w-[10%]">Danh mục</TableHead>
                <TableHead className="px-3 py-2 w-[5%]">Trạng thái</TableHead>
                <TableHead className="w-[10%]">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((item, index) => (
                <TableRow key={item.id} className="">
                  <TableCell className="px-3 py-2">{index + 1}</TableCell>
                  <TableCell className="px-3 py-2">
                    <img
                      src={`${import.meta.env.VITE_SERVER_UPLOAD}/${item.thumbnail}`}
                      className="max-w-full"
                    />
                  </TableCell>
                  <TableCell className="px-3 py-2">{item.name}</TableCell>
                  <TableCell className="px-3 py-2">
                    Giá gốc: {item.price.toLocaleString()}đ <br />
                    Giá KM: {item.salePrice.toLocaleString()}đ
                  </TableCell>
                  <TableCell className="px-3 py-2">
                    {item.category?.name}
                  </TableCell>
                  <TableCell className="px-3 py-2">
                    <Switch
                      id="status"
                      defaultChecked={item.status}
                      onCheckedChange={(checked: boolean) =>
                        handleChangeStatus(item.id, checked)
                      }
                      className="data-checked:bg-[#4880FF]"
                    />
                  </TableCell>
                  <TableCell className="px-3 py-2">
                    <div className="flex gap-2">
                      <Button
                        className="bg-[#4880FF] hover:bg-[rgba(72,127,255,0.65)] text-white cursor-pointer"
                        asChild
                      >
                        <Link to={`/products/update/${item.id}`}>Sửa</Link>
                      </Button>
                      <Button
                        variant={"destructive"}
                        className="cursor-pointer"
                        onClick={() => {
                          setConfirmModal(true);
                          setIdDelete(item.id);
                        }}
                      >
                        Xóa
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination total={totalPage} page={+page} />
          <AlertModal
            title="Bạn có chắc chắn muốn xóa?"
            open={confirmModal}
            onClose={() => setConfirmModal(false)}
            onContinue={() => {
              deleteMutation.mutate(idDelete, {
                onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: ["products"] });
                  toast.success("Delete product success");
                },
                onError: () => {
                  toast.error("Delete product failed");
                },
              });
            }}
          >
            <p>Nếu bấm Continue bạn không thể khôi phục được</p>
          </AlertModal>
        </>
      )}
    </div>
  );
}
