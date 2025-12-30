import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, updateOrderStatus } from '../../redux/slices/adminOrderSlice';

const OrderManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {user } = useSelector((state)=>state.auth)
  const { orders, loading, error } = useSelector((state) => state.adminOrders)
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/")
    } else {
      dispatch(fetchAllOrders())
    }
  }, [dispatch, user, navigate ])

  // Handler for changing the status (e.g., mark as delivered)
  const handleStatusChange = (orderId, newStatus) => {
   dispatch(updateOrderStatus({id: orderId, status: newStatus}))
  };
  if(loading) return <p>Loading...</p>
  if (error) return <p>Error: { error}</p>

  // Helper function for status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="px-2 py-1 text-xs font-semibold leading-none rounded-full bg-green-100 text-green-800">
            {status}
          </span>
        );
      case 'Processing':
        return (
          <span className="px-2 py-1 text-xs font-semibold leading-none rounded-full bg-blue-100 text-blue-800">
            {status}
          </span>
        );
      case 'Pending Payment':
        return (
          <span className="px-2 py-1 text-xs font-semibold leading-none rounded-full bg-yellow-100 text-yellow-800">
            {status}
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-semibold leading-none rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Order Management</h2>

      {/* Order List Table */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{order._id}</td>
                  <td className="p-4 font-medium text-gray-900">
                    {order.user ? order.user.name : 'Unknown User'}
                  </td>
                  <td className="p-4">{order.createdAt}</td>
                  <td className="p-4">${order.totalPrice.toFixed(2)}</td>
                  <td className="p-4">{getStatusBadge(order.status)}</td>
                  <td className="p-4 flex space-x-2 items-center">
                    {/* View Details Button */}
                    <Link
                      to={`/admin/orders/${order._id}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center"
                      title="View Details"
                    >
                      <FaEye className="mr-1" /> View
                    </Link>

                    {/* Status Update Dropdown (Example: for marking as delivered) */}
                    {order.status !== 'Delivered' && (
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className="p-1 border rounded text-sm"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;
