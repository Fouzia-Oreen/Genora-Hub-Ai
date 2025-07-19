import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import genora from '../assets/genora.png'

const Layout = () => {
  const navigate = useNavigate()
  return (
    <div className='flex flex-col items-start justify-start h-screen'>
      <nav>
      <div  className="flex items-center">
        <img
          className="h-9"
          src={genora}
          alt="Genora Logo"
          onClick={() => navigate("/")}
        />
        <span className="bg-gradient-2 text-[26px] text-transparent bg-clip-text font-bold px-2 rounded-lg inline-block">
          Genora.AI
        </span>
      </div>
      </nav>
      <Outlet />
    </div>
  )
}

export default Layout
