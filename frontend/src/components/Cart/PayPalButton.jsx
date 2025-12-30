import React from 'react';

import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

// Define onError for consistency with the usage in Checkout.jsx

const onError = (err) => {
  console.error('PayPal Error:', err);

  alert('Payment failed. Try again.');
};

const PayPalButton = ({ amount, onSuccess, onError }) => {
  // Get client ID from environment variables
  const clientID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  return (
    <PayPalScriptProvider options={{ 'client-id': clientID }}>
      <PayPalButtons
        style={{ layout: 'vertical' }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: parseFloat(amount).toFixed(2), // Ensure amount is passed as a string
                },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          // Capture the payment and then call the custom onSuccess handler

          return actions.order.capture().then((details) => {
            onSuccess(details);
          });
        }}
        onError={onError} // Pass down the custom error handler
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;

// Sample checkout data (as seen in the first image)

const checkout = {
  product: [
    {
      productId: '2',

      name: 'T-shirt',

      color: 'black',

      size: 'M',

      price: 120,

      quantity: 2,

      image: 'https://picsum.photos/150?random=1',
    },

    {
      productId: '1',

      name: 'Jacket',

      color: 'black',

      size: 'M',

      price: 150,

      quantity: 1,

      image: 'https://picsum.photos/150/?random=2',
    },
  ],

  shippingAddress: {
    address: '123 Fashion Street',

    city: 'New York',

    country: 'USA',
  },

  _id: 'ORD-987654321',

  orderDate: new Date().toLocaleDateString('en-US'),
};

const OrderConfirmationPage = () => {
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
                  Order Date: {checkout.orderDate}
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

            {checkout.product.map((item, index) => (
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
              <p className="text-xl font-bold">Total Paid: $240</p>

              <p className="text-sm text-gray-500">
                Payment Method: PayPal (Assumed from one of the file tabs)
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
