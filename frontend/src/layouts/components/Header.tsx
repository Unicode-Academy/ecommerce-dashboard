import { Input } from "@/components/ui/input";
import bellIcon from "@/assets/icons/bell-icon.png";
import LanguageSwitch from "./LanguageSwitch";
import Profile from "./Profile";
export default function Header() {
  return (
    <header className="flex justify-between items-center py-3 px-10">
      <div className="w-1/2">
        <Input
          placeholder="Search..."
          className="rounded-full bg-[#F5F6FA] py-5 px-7 w-full"
        />
      </div>
      <div className="flex items-center gap-5">
        <div>
          <img src={bellIcon} alt="Bell Icon" />
        </div>
        <LanguageSwitch />
        <Profile />
      </div>
    </header>
  );
}
