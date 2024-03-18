import React from 'react'

function Buttoncomp({
    children,
    type="button",
    bgColor="bg-white",
    textColor="text-[#faa725]",
    fontweight="font-bold",
    margin="mt-4",
   addedclass='',
    ...props}) {
  return (
    <button className={`px-4 py-2 rounded-lg tracking-widest ${bgColor} ${textColor} ${fontweight} ${margin} ${addedclass}`} type={type}  {...props}>{children}</button>
  )
}

export default Buttoncomp