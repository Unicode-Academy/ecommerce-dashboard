import AddForm from "@/components/categories/AddForm";
import FilterInput from "@/components/categories/FilterInput";
import UpdateForm from "@/components/categories/UpdateForm";
import AlertModal from "@/components/modals/AlertModal";
import Modal from "@/components/modals/Modal";
import Pagination from "@/components/pagination/Pagination";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteCategory, getCategories } from "@/services/category.service";
import type { SearchParams } from "@/types/category.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function Categories() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = Object.fromEntries(
    searchParams.entries(),
  ) as unknown as SearchParams;
  const page = searchParams.get("page") ?? 1;
  const {
    data: { data: categories, totalPage },
    error,
    isLoading,
  } = useQuery({
    queryKey: ["categories", filters],
    queryFn: () => getCategories(filters),
    initialData: {
      data: [],
      totalPage: 0,
    },
  });

  const [addModel, setAddModel] = useState<boolean>(false);
  const [updateModel, setUpdateModal] = useState<boolean>(false);
  const [idUpdate, setIdUpdate] = useState<number>(0);
  const [idDelete, setIdDelete] = useState<number>(0);
  const [confirmModal, setConfirmModal] = useState<boolean>(false);
  const mutation = useMutation({
    mutationFn: (id: number) => {
      if (+page > 1 && categories.length === 1) {
        setSearchParams({
          ...filters,
          page: +page - 1,
        } as unknown as SearchParams);
      }
      return deleteCategory(id);
    },
  });
  const queryClient = useQueryClient();

  return (
    <div>
      <h1 className="mb-5 font-medium text-3xl">Categories</h1>
      <Button
        className="bg-[#4880FF] mb-3"
        size={"lg"}
        onClick={() => setAddModel(true)}
      >
        Thêm mới
      </Button>
      <FilterInput />
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
                <TableHead className="px-3 py-2">Tên</TableHead>
                <TableHead className="px-3 py-2">Trạng thái</TableHead>
                <TableHead className="w-[10%]">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="px-3 py-2">{index + 1}</TableCell>
                  <TableCell className="px-3 py-2">{item.name}</TableCell>
                  <TableCell className="px-3 py-2">
                    {item.status ? "Publish" : "Draft"}
                  </TableCell>
                  <TableCell className="flex gap-2 px-3 py-2">
                    <Button
                      onClick={() => {
                        setUpdateModal(true);
                        setIdUpdate(item.id);
                      }}
                      className="bg-[#4880FF] hover:bg-[rgba(72,127,255,0.65)] text-white cursor-pointer"
                    >
                      Sửa
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination total={totalPage} page={+page} />
        </>
      )}
      <Modal
        open={addModel}
        onClose={() => setAddModel(false)}
        title="Add Category"
      >
        <AddForm
          onSuccess={() => {
            setAddModel(false);
            setSearchParams({
              ...filters,
              page: 1,
            } as unknown as SearchParams);
          }}
        />
      </Modal>
      <Modal
        open={updateModel}
        onClose={() => setUpdateModal(false)}
        title="Update Category"
      >
        <UpdateForm id={idUpdate} onSuccess={() => setUpdateModal(false)} />
      </Modal>
      <AlertModal
        title="Bạn có chắc chắn muốn xóa?"
        open={confirmModal}
        onClose={() => setConfirmModal(false)}
        onContinue={() => {
          mutation.mutate(idDelete, {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["categories"] });
              toast.success("Delete category success");
            },
            onError: () => {
              toast.error("Delete category failed");
            },
          });
        }}
      >
        <p>Nếu bấm Continue bạn không thể khôi phục được</p>
      </AlertModal>
    </div>
  );
}
