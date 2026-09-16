import { NavLink } from "react-router-dom";
const menus = [
  {
    url: "/",
    text: "Dashboard",
  },
  {
    url: "/categories",
    text: "Categories",
  },
  {
    url: "/products",
    text: "Products",
  },
  {
    url: "/orders",
    text: "Orders",
  },
  {
    url: "/users",
    text: "Users",
  },
];
export default function Nav() {
  const className = ({ isActive }: { isActive: boolean }) => {
    return isActive
      ? "block py-4 bg-[#4880FF] rounded-sm px-3 text-white"
      : "block py-4 px-3";
  };
  return (
    <ul className="mt-5 px-5">
      {menus.map((menu, index) => (
        <li key={index}>
          <NavLink to={menu.url} className={className}>
            {menu.text}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
