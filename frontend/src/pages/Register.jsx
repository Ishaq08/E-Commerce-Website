import React, { useEffect, useState } from 'react';
// Assuming you are using 'react-router-dom' for the Link component
import { Link, useLocation, useNavigate } from 'react-router-dom';
import register from '../assets/register.webp';
import { registerUser } from '../redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { mergeCart } from '../redux/slices/cartSlice';


const Register = () => {
  // State for form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
   const navigate = useNavigate();
   const location = useLocation();
   const { user, guestId } = useSelector((state) => state.auth);
   const { cart } = useSelector((state) => state.cart);

   const redirect = new URLSearchParams(location.search).get('redirect') || '/';
   const isCheckoutRedirect = redirect.includes('checkout');

  //  useEffect(() => {
  //    if (user) {
  //      if (cart?.products.length > 0 && guestId) {
  //        dispatch(mergeCart({ guestId, user })).then(() => {
  //          navigate(isCheckoutRedirect ? '/checkout' : '/');
  //        });
  //      } else {
  //        navigate(isCheckoutRedirect ? '/checkout' : '/');
  //      }
  //    }
  //  }, [navigate, guestId, cart, isCheckoutRedirect, dispatch]);
  
  useEffect(() => {
    if (user) {
      const performNavigation = () => {
        navigate(isCheckoutRedirect ? '/checkout' : '/');
      };

      // If there are items in a guest cart, merge them first
      if (cart?.products?.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          performNavigation();
        });
      } else {
        // If no cart items, just go home/checkout
        performNavigation();
      }
    }
  }, [user, cart, guestId, navigate, isCheckoutRedirect, dispatch]);

  // Function to handle form submission (you would add API logic here)
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser({ name, email, password }));
  };

  return (
    <div className="h-screen flex">
      {/* Login Form Section (w-full on mobile, w-1/2 on md+) */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <form
          className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm"
          onSubmit={handleSubmit}
        >
          {/* Header */}
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-medium mb-2">Peridot</h2>
            {/*  */}
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">Hey there! 👋</h2>
          <p className="text-center text-sm text-gray-600 mb-6">
            Enter your username and password to Login
                  </p>
                  {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your Name"
              required
            />
          </div>
          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your email address"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Sign Up
          </button>

          {/* Register Link */}
          <p className="mt-6 text-center text-sm">
            Don't have an account?{''}
            {/* Make sure to import Link from 'react-router-dom' */}
            <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-blue-500 ml-1 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>

      {/* Side Image Panel (hidden on small screens, block on md+) */}
      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-auto flex flex-col justify-center items-center">
          <img
            src={register}
            alt="Login to Account"
            className="h-[750px] w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
