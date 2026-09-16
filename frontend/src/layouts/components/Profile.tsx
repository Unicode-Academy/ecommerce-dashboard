import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import userImg from "@/assets/images/user.png";
export default function Profile() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex gap-1 items-center">
          <img src={userImg} />
          <div>
            <span className="block font-medium text-[14px]">Moni Roy</span>
            <span className="block text-[12px]">Admin</span>
          </div>
          <ChevronDown
            size={"16px"}
            color="#565656"
            className="border border-[#ddd] rounded-[50%]"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Account</DropdownMenuItem>
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
