import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navitem(item) {

  return (
    <>
      
      <div >
        <div className='basis-3/5  tracking-widest text-3xl'>{item.name}</div>
        {}
        <div id='dropdownmenu' className={`${item.dropdown ? 'block' : 'hidden'}`}>
          {item.dropdown && item.dropdown.map((sublink, subIndex) => (

            <div href={sublink.url} key={subIndex} className='' id='dropdownitems'>{sublink.name}</div>


          ))}
        </div>
      </div>
    </>

  )
}

export default Navitem