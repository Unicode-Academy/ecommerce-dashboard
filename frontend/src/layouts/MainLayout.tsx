import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export default function MainLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="h-screen bg-[#F5F6FA] p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
