import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify'
import loader from "../images/lgoinload.gif"

function Login() {
  const navigate =useNavigate();
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [loading, setloading] = useState(false)
  

const err = (msg) => {

  toast.error(msg, {
      'position': 'bottom-right',
      'theme': 'colored'
  })
}

const validate = () => {
  if (!email) {
      err('provide email')
      return false
  }
  else if (!password) {
      err('provide password')
      return false
  }
  return true
}

  const handleSubmit = async (e)=>{
    e.preventDefault();
    const v = validate()
  if (v) {
setloading(true)
          
      const res = await axios.post('https://messsaging-app.herokuapp.com/api/login',{
        email:email,
          password:password,
        });
      if (res.data.success) {
          setloading(false)
          navigate('/')
        }
        else {
          err(res.data.message)
          setloading(false)
        }
  }
  }
    return (
    <div className='login-page'>
        <div className="login-container">
            <form className='login-form'>
              <h2>LOG IN</h2>
              <div className="block" >
              <label className='form-label' for="email">Email</label>
              <input className='form-input' id='email' type="text" name='email' value={email} onChange={(e) => { setemail(e.target.value) }}   placeholder='johndoe@gmail.com' />
              </div>            
              <div className="block">
              <label className='form-label' for="password">Password</label>
              <input className='form-input' id="password" type="password" name='password'  value={password}  onChange={(e) => { setpassword(e.target.value) }} placeholder='Password' />
              </div>                           
            </form>
            <div className="foot">
            {loading ? <div className='load-btn' ><img className='l_reg' src={loader} alt='loader' /></div> 
            : <button type="submit" onClick={handleSubmit} className='btn'>Log In</button>}
            <label className='form-label' >Don't have an account ?
              <button className="toreg"  onClick={()=>{navigate("/register")}}>
                Sign Up
              </button>
              </label>
              </div>
            </div>
            <ToastContainer />
    </div>
  )
}

export default Login