import React from 'react'
import Navitem from './Navitem';
import { Navigate } from 'react-router-dom'
import './navbar.css'


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
      dropdown: [
        {
          name: "Build Your Own Pizza",
          url: "/build-your-own",
        },
        {
          name: "Signature Pizzas",
          url: "/pizzas",
        },
        {
          name: "Sides & Drinks",
          url: "/sides-drinks",
        },
      ],
    },
    {
      name: "Order Online",
      url: "/order",
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
      <nav className='flex justify-between px-10 py-3 text-orange-500'>
       <img src="./images/logo.png" alt="" className='w-28' id='logo'/>
        <div className='flex gap-10'>
          {Navitems.map((item, index) => {
            return < Navitem key={index} {...item} />
          })}
        </div>
        <div>

          <button className='basis-1/5'>Login/Register</button>
        </div>

      </nav>
     
    </>
  )
}

export default Navbar