import React from 'react'
import Navitem from './Navitem';
import { Navigate } from 'react-router-dom'
import './navbar.css'
import Buttoncomp from '../Button/Buttoncomp';


function Navbar() {
  const Navitems = [

    {
      name: "Home",
      url: "/",
      active: true, // Set to true for the initial active link
    },
    {
      name: "Menu",
      url: "#", // Use "#" for dropdown menus (handled in frontend)
     
    },
   
    {
      name: "About Us",
      url: "/about",
    },
    {
      name: "Contact",
      url: "/contact",
    },
  ];

  return (
    <>
      <nav className='flex justify-between px-10 py-3 text-white items-center'>
       <img src="./images/logo.png" alt="" className='w-32' id='logo'/>
        <div className='flex gap-20'>
          {Navitems.map((item, index) => {
            return < Navitem key={index} {...item} />
          })}
        </div>
        <div>

        <Buttoncomp>Register/Sign in</Buttoncomp>
        </div>

      </nav>
     
    </>
  )
}

export default Navbar