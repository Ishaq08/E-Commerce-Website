// XPayForm.jsx (FIXED for repeated fields)
import React, { useState } from 'react';
import {
  PaymentElement,
  XPay, // Using XPay as the Provider based on your usage
  useXpay,
} from '@xstak/xpay-element-stage-v4';

// Error Boundary Component
class XPayErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('XPay Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-red-500">Payment component failed to load. Please check your configuration.</div>;
    }

    return this.props.children;
  }
}

// The wrapper that provides the XPay context (now merged with the form logic)
const XPayForm = ({
  piClientSecret,
  encryptionKey,
  onSuccess,
  onError,
  paymentMethod,
}) => {
  // 1. XPay configuration object (required by the <XPay> provider)
  const xpayConfig = {
    publishableKey: piClientSecret,
    hmacSecret: encryptionKey,
    accountId: 'default', // Placeholder
  };

  return (
    <XPayErrorBoundary>
      {/* // The XPay component initializes the SDK and must wrap the element usage */}
      <XPay xpay={xpayConfig}>
        {/* Rendering the actual form component inside the Provider */}
        <PaymentFormLogic
          piClientSecret={piClientSecret}
          encryptionKey={encryptionKey}
          onSuccess={onSuccess}
          onError={onError}
          paymentMethod={paymentMethod}
        />
      </XPay>
    </XPayErrorBoundary>
  );
};

// Component containing the form and logic
const PaymentFormLogic = ({
  piClientSecret,
  encryptionKey,
  onSuccess,
  onError,
  paymentMethod,
}) => {
  const xpay = useXpay();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const isCard = paymentMethod === 'card';
  const isWallet =
    paymentMethod === 'jazzcash' || paymentMethod === 'easypaisa';

  // 1. Determine the layout/fields based on the payment method
  const options = {
    override: true,
    // Hide card fields if a wallet is selected, as XPay will handle the wallet redirect/flow
    hideCard: isWallet,
  };

  // 2. The function to confirm the payment
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!xpay || !piClientSecret) {
      setMessage('Payment component is not initialized.');
      return;
    }

    setLoading(true);
    setMessage('Processing payment...');

    try {
      const {
        message: confirmMessage,
        error,
        result,
      } = await xpay.confirmPayment(
        paymentMethod, // Passes the selected method
        piClientSecret,
        { name: 'Customer Name' }, // Placeholder for customer data
        encryptionKey
      );

      if (error) {
        setMessage(`Payment failed: ${error.message}`);
        onError(error);
      } else {
        setMessage('Payment successful! Finalizing order...');
        onSuccess(result || confirmMessage);
      }
    } catch (err) {
      setMessage('An unexpected error occurred during payment.');
      onError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 3. Render the secure card input fields ONLY if card is selected */}
      {isCard && <PaymentElement options={options} />}

      {/* 4. Wallet message */}
      {isWallet && (
        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 mb-4">
          You will be redirected to the {paymentMethod} payment page to complete
          your transaction.
        </div>
      )}

      {/* The Submit Button (used for both Card submission and Wallet redirect trigger) */}
      <button
        type="submit"
        disabled={loading || !xpay}
        className="mt-4 w-full p-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading
          ? 'Processing...'
          : isCard
          ? 'Pay Securely'
          : `Continue to ${paymentMethod}`}
      </button>

      {message && (
        <div
          className={`mt-3 text-sm ${
            message.includes('failed') ? 'text-red-500' : 'text-green-600'
          }`}
        >
          {message}
        </div>
      )}
    </form>
  );
};

export default XPayForm;
