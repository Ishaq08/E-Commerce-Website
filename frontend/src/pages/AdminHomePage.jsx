import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminProducts } from "../redux/slices/adminProductSclice"
import { fetchAllOrders } from "../redux/slices/adminOrderSlice"
// // Mock Data (Based on screenshots)
// const mockOrders = [
//   {
//     _id: '23904580034332',
//     user: { name: 'Test' },
//     totalPrice: 110,
//     status: 'Processing',
//   },
//   // Add more mock orders for the table if orders.length > 0
// ];

// Fallback empty orders
// const emptyOrders = [];

const AdminHomePage = () => {
  const dispatch = useDispatch();
  const {products,loading: productsLoading, error: productsError} = useSelector((state)=>state.adminProducts)
  const {orders, totalOrders, totalSales, loading: orderLoading, error: orderError} = useSelector((state)=>state.adminOrders)

  useEffect(() => {
    dispatch(fetchAdminProducts())
    dispatch(fetchAllOrders())
  }, [dispatch])
  // const orders = mockOrders;
  // const totalRevenue = '$100';
  // const totalOrders = '20';
  // const totalProducts = '100';

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      {productsLoading || orderLoading ? (
        <p>Loading..</p>
      ) : productsError ? (
          <p className='text-red-500'> Error fetching Products: { productsError}</p>
      ) : orderError ? (
          <p className='text-red-500'> Error fetching Orders: { orderError}</p>
      ) : (
      <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Card */}
        <div className="p-4 shadow-md rounded-lg bg-white">
          <h2 className="text-xl font-semibold">Revenue</h2>
          <p className="text-2xl mt-2">${totalSales.toFixed(2)}</p>
        </div>

        {/* Total Orders Card */}
        <div className="p-4 shadow-md rounded-lg bg-white">
          <h2 className="text-xl font-semibold">Total Orders</h2>
          <p className="text-2xl mt-2">{totalOrders}</p>
          <Link
            to="/admin/orders"
            className="text-blue-600 hover:underline text-sm block mt-2"
          >
            Manage Orders
          </Link>
        </div>

        {/* Total Products Card */}
        <div className="p-4 shadow-md rounded-lg bg-white">
          <h2 className="text-xl font-semibold">Total Products</h2>
          <p className="text-2xl mt-2">{products?.length || 0}</p>
          <Link
            to="/admin/products"
            className="text-blue-600 hover:underline text-sm block mt-2"
          >
            Manage Products
          </Link>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-left text-gray-500">
            <thead className="bg-gray-100 text-xs uppercase text-gray-700">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Total Price</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    // Optional: onClick={() => navigate(`/admin/orders/${order._id}`)}
                  >
                    <td className="p-4">{order._id}</td>
                    <td className="p-4">{order.user?.name}</td>
                    <td className="p-4">${order.totalPrice.toFixed(2)}</td>
                    <td className="p-4">{order.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No recent orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}
    </div>
  );
};

export default AdminHomePage;
