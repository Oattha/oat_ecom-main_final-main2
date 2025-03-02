import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import useEcomStore from "../store/ecom-store";
import { ChevronDown, ShoppingCart, User } from "lucide-react";

function MainNav() {
  const carts = useEcomStore((s) => s.carts);
  const user = useEcomStore((s) => s.user);
  const logout = useEcomStore((s) => s.logout);
  const orderUpdates = useEcomStore((s) => s.orderUpdates);

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-6">
            <Link to={"/"} className="text-2xl font-bold tracking-wide">
              Oat-Ecom
            </Link>

            <NavLink
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive ? "bg-white text-gray-800" : "hover:bg-white hover:text-gray-800"
                }`
              }
              to={"/"}
            >
              Home
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive ? "bg-white text-gray-800" : "hover:bg-white hover:text-gray-800"
                }`
              }
              to={"/shop"}
            >
              Shop
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `relative px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive ? "bg-white text-gray-800" : "hover:bg-white hover:text-gray-800"
                }`
              }
              to={"/cart"}
            >
              <ShoppingCart size={20} />
              {carts.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
                  {carts.length}
                </span>
              )}
            </NavLink>

            {user && (
              <NavLink
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive ? "bg-white text-gray-800" : "hover:bg-white hover:text-gray-800"
                  }`
                }
                to="/user/order-details"
              >
                Orders
                {orderUpdates.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
                    {orderUpdates.length}
                  </span>
                )}
              </NavLink>
            )}

            <NavLink
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive ? "bg-white text-gray-800" : "hover:bg-white hover:text-gray-800"
                }`
              }
              to="/contact-us"
            >
              ติดต่อเรา
            </NavLink>
          </div>

          {user ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 bg-white text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-200 transition-all"
              >
                <User size={20} />
                <ChevronDown />
              </button>

              {isOpen && (
  <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-50">
    <Link
      to={"/user/profile"}
      className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
    >
      Profile
    </Link>
    <Link
      to={"/user/history"}
      className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
    >
      History
    </Link>
    <button
      onClick={() => {
        logout();
        setIsOpen(false);
      }}
      className="block px-4 py-2 w-full text-left text-gray-800 hover:bg-gray-200"
    >
      Logout
    </button>
  </div>
)}


            </div>
          ) : (
            <div className="flex items-center gap-4">
              <NavLink
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive ? "bg-white text-gray-800" : "hover:bg-white hover:text-gray-800"
                  }`
                }
                to={"/register"}
              >
                Register
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive ? "bg-white text-gray-800" : "hover:bg-white hover:text-gray-800"
                  }`
                }
                to={"/login"}
              >
                Login
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default MainNav;
