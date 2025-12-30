// Sample checkout data (as seen in the first image)

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";

const OrderConfirmationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
const { checkoutDetails: checkout } = useSelector((state) => state.checkout);
  //clear the cart
  useEffect(() => {
    if (checkout && checkout._id) {
      dispatch(clearCart());
    } else {
      navigate("/my-orders")
    }
  }, [checkout, dispatch, navigate])

  return (
    <div className="OrderConfirmationPage">
      <div className="max-w-4xl mx-auto p-6 bg-white">
        <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
          Thank You For Your Order!
        </h1>

        {checkout && (
          <div className="p-6 rounded-lg border">
            <div className="flex justify-between mb-20">
              <div>
                <h2 className="text-xl font-semibold">
                  Order ID: **{checkout._id}**
                </h2>
                <p className="text-lg text-gray-600">
                  Order Date: {new Date(checkout.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold">Estimated Delivery:</h2>
                <p className="text-lg text-gray-600">5-7 Business Days</p>
              </div>
            </div>

            {/* --- Product Details Section --- */}
            <h3 className="text-2xl font-bold mb-4 border-b pb-2">
              Order Summary
            </h3>

            {/* Assuming product is an array, we map over it */}
            {checkout.checkoutItems?.map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 py-4 border-b"
              >
                {/* Product Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md"
                />

                {/* Product Info */}
                <div className="flex-grow">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Color: {item.color}, Size: {item.size}
                  </p>
                </div>

                {/* Quantity and Price */}
                <div className="text-right">
                  <p className="font-medium">Qty: {item.quantity}</p>
                  <p className="font-bold text-lg">
                    ${item.price * item.quantity}
                  </p>
                </div>
              </div>
            ))}

            {/* --- Shipping Address Section --- */}
            <h3 className="text-2xl font-bold mt-8 mb-4 border-b pb-2">
              Shipping Address
            </h3>
            <div className="text-lg">
              <p>{checkout.shippingAddress.address}</p>
              <p>
                {checkout.shippingAddress.city},{' '}
                {checkout.shippingAddress.country}
              </p>
            </div>

            {/* --- Total/Payment Info (Placeholder) --- */}
            <div className="mt-8 pt-4 border-t text-right">
              <p className="text-xl font-bold">Total Paid: $34.99</p>
              <p className="text-sm text-gray-500">
                Payment Method: COD (Assumed from one of the file tabs)
              </p>
            </div>
          </div>
        )}

        {/* Fallback for missing checkout data */}
        {!checkout && (
          <p className="text-center text-red-500">
            Order details could not be loaded.
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
