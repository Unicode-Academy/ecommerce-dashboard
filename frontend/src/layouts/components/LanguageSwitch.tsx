import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import englandIcon from "@/assets/icons/england.png";
export default function LanguageSwitch() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex gap-1 items-center">
          <img src={englandIcon} />
          <span className="text-[14px]">English</span>
          <ChevronDown size={"16px"} color="#565656" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>English</DropdownMenuItem>
        <DropdownMenuItem>Vietnamese</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
