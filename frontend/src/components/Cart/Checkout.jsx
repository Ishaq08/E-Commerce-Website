// Checkout.jsx (Multi-Payment Integrated Version)
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import XPayForm from './XPayForm';
import { useDispatch, useSelector } from 'react-redux';
import { checkout } from '../../redux/slices/checkoutSlice';


const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {cart, loading, error} = useSelector((state)=>state.cart)
  const {user}= useSelector((state)=>state.auth)

  // New State: Payment Method Selection
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card'); // Default to card

  // State for the client secret and encryption key from the server
  const [piClientSecret, setPiClientSecret] = useState(null);
  const [encryptionKey, setEncryptionKey] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(false);

  // Shipping address state (same as before)
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
  });
  //Ensure cart is loading befor processing
  useEffect(() => {
    if (!cart || !cart.products || cart.products.lenght === 0) {
      navigate("/")
    }
  },[cart, navigate])

  // Handlers (mostly unchanged)
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prevAddress) => ({ ...prevAddress, [name]: value }));
  };

  // Handler for Payment Method selection
  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
    setPiClientSecret(null); // Reset secret when changing method
    setEncryptionKey(null);
  };

  // Handler when the user submits the Shipping Form / Continues to Payment
  const handleContinuePayment = async (e) => {
    e.preventDefault();

    if (selectedPaymentMethod === 'cod') {
      // 1. CASH ON DELIVERY: Create checkout session and navigate
      console.log('COD selected. Creating checkout...');
      const checkoutData = {
        checkoutItems: cart.products.map(product => ({
          productId: product._id || product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: product.quantity || 1,
          color: product.color,
          size: product.size,
        })),
        shippingAddress,
        paymentMethod: 'cod',
        totalPrice: cart.totalPrice,
      };
      try {
        await dispatch(checkout(checkoutData)).unwrap();
        alert('Order placed successfully via Cash on Delivery!');
        navigate('/order-confirmation');
      } catch (error) {
        alert('Failed to place order: ' + error.message);
      }
      return;
    }

    if (
      selectedPaymentMethod === 'card' ||
      selectedPaymentMethod === 'jazzcash' ||
      selectedPaymentMethod === 'easypaisa'
    ) {
      // 2. XPAY/WALLET: Create Payment Intent for online payments
      setLoadingPayment(true);

      // --- MOCK SERVER-SIDE API CALL START ---
      // In a real app, you'd send { amount, payment_method: selectedPaymentMethod } to your server
      setTimeout(() => {
        const MOCK_PI_SECRET = 'pi_mock_1A2B3C_secret_4D5E6F';
        const MOCK_ENCRYPTION_KEY = 'mock_key_XYZ';

        setPiClientSecret(MOCK_PI_SECRET);
        setEncryptionKey(MOCK_ENCRYPTION_KEY);
        setLoadingPayment(false);
        console.log(`Payment Intent Created for ${selectedPaymentMethod}.`);
      }, 1500);
      // --- MOCK SERVER-SIDE API CALL END ---
    }
  };

  const handlePaymentSuccess = (details) => {
    console.log('Payment Successful!', details);
    navigate('/order-confirmation');
  };

  const handlePaymentError = (err) => {
    console.error('Payment confirmation failed:', err);
    alert('Payment failed. Please check your details and try again.');
    setLoadingPayment(false);
  };

  // Helper function to render the payment option block
  const renderPaymentOption = (id, label) => (
    <div className="flex items-center mb-4">
      <input
        type="radio"
        id={id}
        name="paymentMethod"
        value={id}
        checked={selectedPaymentMethod === id}
        onChange={handlePaymentMethodChange}
        className="form-radio h-5 w-5 text-black"
      />
      <label htmlFor={id} className="ml-3 text-lg font-medium">
        {label}
      </label>
    </div>
  );

  const renderOnlinePaymentDetails = () => {
    if (piClientSecret && encryptionKey) {
      // If client secret is ready, render the XPay component
      return (
        <XPayForm
          piClientSecret={piClientSecret}
          encryptionKey={encryptionKey}
          amount={cart.totalPrice}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          paymentMethod={selectedPaymentMethod} // Pass the method to XPayForm for potential customization
        />
      );
    }

    // If client secret is not ready, show the button to generate it
    return (
      <button
        type="submit"
        disabled={loadingPayment}
        className="w-full bg-black text-white py-3 rounded disabled:opacity-50"
      >
        {loadingPayment ? 'Creating Payment Intent...' : 'Continue to Payment'}
      </button>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
      {/* Left Section: Checkout Form */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6">Checkout</h2>

        {/* Note: The form now controls all payment flows */}
        <form onSubmit={handleContinuePayment}>
          {/* ... Address Form Fields (Unchanged) ... */}
          <h3 className="text-lg mb-4">Contact Details</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value="user@example.com"
              className="w-full p-2 border rounded"
              readOnly
            />
          </div>

          <h3 className="text-lg mb-4">Delivery</h3>
          {/* ... Address fields (omitted for brevity) ... */}
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={shippingAddress.firstName}
                onChange={handleShippingChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={shippingAddress.lastName}
                onChange={handleShippingChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={shippingAddress.address}
              onChange={handleShippingChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700">City</label>
              <input
                type="text"
                name="city"
                value={shippingAddress.city}
                onChange={handleShippingChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={shippingAddress.postalCode}
                onChange={handleShippingChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Country</label>
            <input
              type="text"
              name="country"
              value={shippingAddress.country}
              onChange={handleShippingChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone</label>
            <input
              type="tel"
              name="phone"
              value={shippingAddress.phone}
              onChange={handleShippingChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* --- Payment Method Selection --- */}
          <h3 className="text-lg mb-4 mt-6 border-t pt-4">Payment Method</h3>

          {renderPaymentOption('card', 'Credit / Debit Card (via XPay)')}
          {renderPaymentOption('jazzcash', 'JazzCash (Mobile Wallet)')}
          {renderPaymentOption('easypaisa', 'EasyPaisa (Mobile Wallet)')}
          {renderPaymentOption('cod', 'Cash on Delivery (COD)')}

          {/* --- Conditional Payment Action Block --- */}
          <div className="mt-6">
            {/* 1. If COD is selected, the form button is the final "Place Order" button */}
            {selectedPaymentMethod === 'cod' && (
              <button
                type="submit"
                className="w-full bg-green-700 text-white py-3 rounded hover:bg-green-800"
              >
                Place Order (Pay on Delivery)
              </button>
            )}

            {/* 2. If an online method is selected, show the Intent button or the XPay form */}
            {(selectedPaymentMethod === 'card' ||
              selectedPaymentMethod === 'jazzcash' ||
              selectedPaymentMethod === 'easypaisa') &&
              renderOnlinePaymentDetails()}

            {/* If a new payment method is selected but not implemented */}
            {/* Add a specific error or info here if needed */}
          </div>
        </form>
      </div>

      {/* Right Section: Order Summary (Unchanged) */}
      <div className="bg-gray-50 rounded-lg p-6 h-fit sticky top-10">
        <h3 className="text-lg mb-4">Order Summary</h3>
        {/* ... (Order Summary JSX remains the same) ... */}
        {cart.products.map((product, index) => (
          <div
            key={index}
            className="flex items-start justify-between py-2 border-b"
          >
            <div className="flex items-start">
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-24 object-cover mr-4"
              />
              <div>
                <h3 className="text-md">{product.name}</h3>
                <p className="text-gray-500 text-sm">Size: {product.size}</p>
                <p className="text-gray-500 text-sm">Color: {product.color}</p>
              </div>
            </div>
            <p className="text-xl">${product.price?.toLocaleString()}</p>
          </div>
        ))}
        <div className="flex justify-between items-center text-lg mb-4">
          <p>Subtotal</p>
          <p>${cart.totalPrice?.toLocaleString()}</p>
        </div>
        <div className="flex justify-between items-center text-lg">
          <p>Shipping</p>
          <p>Free</p>
        </div>
        <div className="flex justify-between items-center text-lg border-t mt-4 pt-4">
          <p className="font-bold">Total</p>
          <p className="font-bold">${cart.totalPrice?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
