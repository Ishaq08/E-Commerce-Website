import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchOrderDetails } from '../redux/slices/orderSlice';

const MyOrdersPage = () => {
  const { id } = useParams();
const dispatch = useDispatch();
const { orderDetails, loading, error } = useSelector((state) => state.orders);


  useEffect(() => {
      dispatch(fetchOrderDetails(id));
    },[dispatch, id])

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) return <p>Loading...</p>;
  if (loading) return <p>Error: {error}</p>;

  


  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Order Details</h2>

      {orderDetails ? (
        <div className="p-4 sm:p-6 rounded-lg border shadow-sm">
          {/* Order Info Section */}
          <div className="flex flex-col sm:flex-row justify-between mb-8">
            {/* LEFT SIDE (UPDATED): Order ID + Date stacked */}
            <div className="">
              <h3 className="text-lg md:text-xl font-semibold">
                Order ID: #{orderDetails._id}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {formatDate(orderDetails.createdAt)}
              </p>
            </div>

            {/* RIGHT SIDE: Status Badges */}
            <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
              <div className="mb-2 text-right">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium 
                    ${
                      orderDetails.isPaid
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                >
                  {orderDetails.isPaid ? 'Approved' : 'Pending'}
                </span>
                <p className="text-xs text-gray-500">Payment Status</p>
              </div>

              <div className="text-right">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium 
                    ${
                      orderDetails.isDelivered
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                >
                  {orderDetails.isDelivered ? 'Delivered' : 'Pending'}
                </span>
                <p className="text-xs text-gray-500">Delivery Status</p>
              </div>
            </div>
          </div>

          {/* Payment / Shipping / Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8 border-t pt-8">
            <div>
              <h4 className="text-lg font-semibold mb-2">Payment Info</h4>
              <p className="text-gray-700">
                Payment Method:{' '}
                <span className="font-medium">
                  {orderDetails.paymentMethod}
                </span>
              </p>
              <p className="text-gray-700">
                Status:{' '}
                <span className="font-medium">
                  {orderDetails.isPaid ? 'Paid' : 'Unpaid'}
                </span>
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2">Shipping Info</h4>
              <p className="text-gray-700">
                Shipping Method:{' '}
                <span className="font-medium">
                  {orderDetails.shippingMethod}
                </span>
              </p>
              <p className="text-gray-700">
                Address:{' '}
                <span className="font-medium">
                  {`${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.country}`}
                </span>
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2">Order Summary</h4>
              <p className="text-gray-700">
                Total Items:{' '}
                <span className="font-medium">
                  {orderDetails.orderItems.reduce(
                    (acc, item) => acc + item.quantity,
                    0
                  )}
                </span>
              </p>
              <p className="text-xl font-bold text-gray-900 mt-2">
                Total Price: ${orderDetails.totalPrice.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Product Table */}
          <div className="overflow-x-auto border rounded-lg">
            <h4 className="text-lg font-semibold p-4 border-b">Products</h4>
            <table className="min-w-full text-left text-gray-600">
              <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Unit Price</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.orderItems.map((item) => (
                  <tr key={item.productId}
                    className="border-b last:border-b-0">
                    <td className="py-4 px-4 flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg mr-4"
                      />
                      <Link
                        to={`/product/${item.productId}`}
                        className="text-blue-500 hover:underline"
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className="py-4 px-4">${item.price.toFixed(2)}</td>
                    <td className="py-4 px-4">{item.quantity}</td>
                    <td className="py-4 px-4 font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Link
            to="/my-order"
            className="text-blue-600 hover:underline mt-6 inline-block"
          >
            Back to Orders
          </Link>
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading order details...</p>
      )}
    </div>
  );
};

export default MyOrdersPage;
