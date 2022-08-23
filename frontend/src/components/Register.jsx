import axios from 'axios';
import React, { useState } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import loader2 from "../images/lgoinload.gif"


function Register() {
  const navigate=useNavigate();
  const [image, setimage] = useState()
  const [selectedimage, setselectedimage] = useState()
  const [username, setusername] = useState('')
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [confirmpassword, setconfirmpassword] = useState('')
const [loading, setloading] = useState(false)

  const err = (msg) => {

    toast.error(msg, {
      'position': 'bottom-right',
      'theme': 'colored'
    })
  }
  const imagehandler = (e) => {
    const file = e.target.files[0]
    setimage(file)
    const Reader = new FileReader()
    Reader.readAsDataURL(file)
    Reader.onload = () => {
      setselectedimage(Reader.result)
    }
  }

  const handlevalidate = () => {
    if (!username || !email || !password || !selectedimage) {
      err('provide all details')
      return false;
    }

    if (password!==confirmpassword) {
      err('password and confirm apssword are not matching')
      return false;
    }
    if (password.length < 8) {
      err('password must be greater than 8 characters')
      return false;
    }
    if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
      err('you can upload only images')
      return false;
    }
    return true
  }


  const handleSubmit = async (e)=>{
    e.preventDefault();
    const v =handlevalidate();
    if (v) {
      setloading(true);
      
      const res = await axios.post('https://messsaging-app.herokuapp.com/api/signup',{
        name :username,
        email:email,
        password:password,
        confirmPassword:confirmpassword,
        "file": selectedimage
      })
            if (res.data.success===true) {
                setloading(false)
                navigate('/login')
              }
              else if(res.data.success===false) {
                err(res.message)
                setloading(false)
              }
        }
  }


  return (
    <div className='register-page'>
        <div className="register-container">
            <form className='reg-form'>
              <h2>SIGN UP</h2>
              <div className="block" >
              <label className='form-label' for="name">Name</label>
              <input className='form-input' id='name' type="text" name='name' value={username} onChange={(e) => { setusername(e.target.value) }}  placeholder='john doe' />
              </div>
              <div className="block">
              <label className='form-label' for="email">Email</label>
              <input className='form-input' id= "email" type="email" name='email' value={email} onChange={(e) => { setemail(e.target.value) }} placeholder='johndoe@example.com' />
              </div>              
              <div className="block">
              <label className='form-label' for="password">Password</label>
              <input className='form-input' id="password" type="password" name='password' value={password} onChange={(e) => { setpassword(e.target.value) }}  placeholder='Top secret' />
              </div>              
              <div className="block">
              <label className='form-label' for="confirmPassword">Confrim Password</label>
              <input className='form-input' id="confirmPassword" type="password" name='confirmPassword' value={confirmpassword} onChange={(e) => { setconfirmpassword(e.target.value) }}  placeholder='confirmPassword' />
              </div>  
              <input required id='myprofile' onChange={imagehandler } type='file' name='myfile' />         
            </form>
            <div className="foot">
            {loading ? <div className='load-btn' ><img className='l_reg' src={loader2} alt='loader' /></div> 
            : <button type="submit" onClick={handleSubmit} className='btn'>Register</button>}
              
              <label className='form-label' >Already have an account ?
              <button className="toreg"  onClick={()=>{navigate("/login")}}>
                Log In
              </button>
              </label>
              <ToastContainer/>
            </div>
        </div>
    </div>
  )
}

export default Register