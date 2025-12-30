import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaSignOutAlt,
  FaTachometerAlt,
  FaUsers,
  FaClipboardList,
  FaShoppingCart,
  FaStore,
} from 'react-icons/fa'; // Assuming these icons are used
import { useDispatch } from 'react-redux';
import {clearCart} from '../../redux/slices/cartSlice'
import {logout} from '../../redux/authSlice'

const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearCart())
    navigate('/'); 
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 text-white flex-1 min-h-screen">
      {/* Admin Dashboard Header */}
      <div className="p-6">
        <h2 className="text-xl font-medium mb-6 text-center">
          Admin Dashboard
        </h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4">
        {/* Dashboard Link */}
        

        {/* Users Link (Example NavLink 1) */}
        <NavLink
          to="users"
          className={({ isActive }) =>
            `mt-2 flex items-center space-x-2 py-3 px-4 rounded transition-colors duration-200 ${
              isActive
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`
          }
        >
          <FaUsers />
          <span>Users</span>
        </NavLink>

        {/* Products Link (Example NavLink 2) */}
        <NavLink
          to="products"
          className={({ isActive }) =>
            `mt-2 flex items-center space-x-2 py-3 px-4 rounded transition-colors duration-200 ${
              isActive
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`
          }
        >
          <FaClipboardList />
          <span>Products</span>
        </NavLink>

        {/* Orders Link (Example NavLink 3) */}
        <NavLink
          to="orders"
          className={({ isActive }) =>
            `mt-2 flex items-center space-x-2 py-3 px-4 rounded transition-colors duration-200 ${
              isActive
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`
          }
        >
          <FaShoppingCart />
          <span>Orders</span>
        </NavLink>
        <NavLink
          to="shop"
          className={({ isActive }) =>
            `mt-2 flex items-center space-x-2 py-3 px-4 rounded transition-colors duration-200 ${
              isActive
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`
          }
        >
          <FaStore />
          <span>Shop</span>
        </NavLink>

        {/* ... potentially more NavLinks ... */}
      </nav>

      {/* Logout Button */}
      <div className="mt-6 p-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded flex items-center justify-center space-x-2 transition-colors duration-200"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
