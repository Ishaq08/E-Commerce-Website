import React from 'react'
import Topbar from '../Layout/Topbar'
import Navbar from './Navbar'

const Header = () => {
  return (
    <header className='border-b border-gray-200'>
      <div>
        {/* Topbar */}
        <Topbar />
        {/* navbar */}
        <Navbar />
        {/* Cart Drawer */}
      </div>
    </header>
  );
}

export default Header