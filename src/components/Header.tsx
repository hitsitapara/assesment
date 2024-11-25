import React from 'react'

const  Header:React.FunctionComponent =() =>{
  return (
    <nav className='w-full h-[48px] border-[#D1D1D1] border-b flex items-center justify-start px-[21px]'>
      <img src="/assets/monk-logo.png" alt="monk-logo" />
      <h1 className='font-semibold text-[#7E8185] text-base pl-4'>Monk Upsell & Cross-sell</h1>
    </nav>
  )
}

export default Header
