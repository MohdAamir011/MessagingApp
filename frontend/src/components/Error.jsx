
import React from 'react'
import { useNavigate } from 'react-router-dom'
function Error() {
  const navigate=useNavigate()
  return (
    <div className='error'>
      <h1 className='e-h'>OOPS , PAGE NOT FOUND !</h1>
      <button className='backtohome' onClick={()=>{navigate('/')}}>BACK TO HOME</button>
    </div>
  )
}

export default Error