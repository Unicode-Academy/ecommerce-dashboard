import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
type Props = {
  open: boolean;
  onClose: (status?: boolean) => void;
  children: Readonly<React.ReactNode>;
  title: string;
  size?: "default" | "large" | "x-large";
  className?: string;
};
export default function Modal({
  open,
  onClose,
  children,
  title,
  size = "default",
  className,
}: Props) {
  const sizeMap = {
    default: "",
    large: "min-w-1/2",
    "x-large": "min-w-3/4",
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={cn(sizeMap[size], className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription asChild>
            <div className="py-3">{children}</div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
