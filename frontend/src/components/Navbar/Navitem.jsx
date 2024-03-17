import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navitem(item) {

  return (
    <>

      <div id='dropdown' className='relative'>
        <div className='basis-3/5  tracking-widest text-3xl font-bold cursor-pointer'>{item.name}</div>
          
         
      </div>
    </>

  )
}

export default Navitem