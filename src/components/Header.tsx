import React from 'react';

// Header component for displaying application header
const Header: React.FunctionComponent = () => {
  return (
    // Navigation bar with specific styling
    <nav className='w-full h-[48px] border-[#D1D1D1] border-b flex items-center justify-start px-[21px]'>
      {/* Application logo */}
      <img
        src='/assets/monk-logo.png'
        alt='monk-logo'
      />
      {/* Application title */}
      <h1 className='font-semibold text-[#7E8185] text-base pl-4'>
        Monk Upsell & Cross-sell
      </h1>
    </nav>
  );
};

export default Header;
