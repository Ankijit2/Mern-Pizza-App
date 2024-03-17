import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import './Home.css'
import Buttoncomp from '../../components/Button/Buttoncomp'

function Home() {
  return (
    <div id="home" className='h-screen relative overflow-hidden'>
        <Navbar/>
        <div>
          <img src="./images/pizza.png" className='h-[42rem] absolute right-[-16%] bottom-[-30%]' alt="" />
        </div>
        <div className='text-white mt-36 ml-36 w-2/5' id='slogan'>
          <h1 className='text-6xl font-bold tracking-wide'> Experience the taste of Italy, right here.</h1>
          <p className='text-2xl'>Explore our unique pizzas featuring mouthwatering combinations of fresh toppings and gourmet cheeses.</p>
          <Buttoncomp margin='mt-8 '>Order Now</Buttoncomp>
        </div>
        
    </div>
  )
}

export default Home