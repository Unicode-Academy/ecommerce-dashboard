import { deleteFile, getFiles, renameFile } from "@/services/file.service";
import Modal from "./Modal";
import { FileManager } from "@cubone/react-file-manager";
import "@cubone/react-file-manager/dist/style.css";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
type FileSelect = { path: string; isDirectory: boolean; name: string };
type Props = {
  open: boolean;
  onClose: () => void;
  onSelected: (file: FileSelect) => void;
};

export default function FilemanagerModal({ open, onClose, onSelected }: Props) {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState<null | FileSelect>(null);
  const refreshFiles = () => {
    getFiles().then((data) => {
      setFiles(data);
    });
  };
  const onSelectionChange = (data: FileSelect[]) => {
    if (!data[0]?.isDirectory) {
      setSelectedFile(data[0]);
    }
  };
  const handleChooseFile = () => {
    if (!selectedFile) {
      return;
    }
    onSelected(selectedFile);
    onClose();
  };
  const onDelete = async () => {
    if (!selectedFile || !selectedFile.isDirectory) {
      return;
    }
    try {
      await deleteFile(selectedFile.name);
      refreshFiles();
    } catch {
      toast.error("Delete file failed");
    }
  };
  const onRename = async (file: FileSelect, newName: string) => {
    if (file.isDirectory) {
      return;
    }
    try {
      await renameFile(file.name, newName);
      refreshFiles();
    } catch {
      toast.error("Rename file failed");
    }
  };
  useEffect(() => {
    getFiles().then((data) => {
      setFiles(data);
    });
  }, []);

  return (
    <Modal size="x-large" open={open} title="File manager" onClose={onClose}>
      <Button
        variant={"outline"}
        className="mb-3"
        disabled={!selectedFile}
        onClick={handleChooseFile}
      >
        Chọn file
      </Button>
      <FileManager
        files={files}
        filePreviewPath={import.meta.env.VITE_SERVER_UPLOAD}
        fileUploadConfig={{
          url: `${import.meta.env.VITE_SERVER_API}/uploads`,
          method: "POST",
        }}
        onRefresh={refreshFiles}
        onFileUploaded={refreshFiles}
        onSelectionChange={onSelectionChange}
        onDelete={onDelete}
        onRename={onRename}
        permissions={{
          create: false, // Disable "Create Folder"
          delete: true,
          rename: true,
          upload: true,
          copy: false,
          move: false,
          download: false,
        }}
      />
    </Modal>
  );
}
