import React, { useEffect, useState } from 'react'
import { FiLogOut, FiSend } from "react-icons/fi";
import { BsEmojiSmileFill } from "react-icons/bs";
import Moment from 'react-moment';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify'
import { GiHamburgerMenu } from "react-icons/gi";
import src from "../images/ghost3.gif"
import { MdArrowDropDown } from "react-icons/md";
import loader from "../images/newloader.gif"
import { AiOutlineSearch } from "react-icons/ai";
import Picker from 'emoji-picker-react';
import { io } from 'socket.io-client';
import ScrollToBottom from 'react-scroll-to-bottom';
axios.defaults.withCredentials = true

function User() {


  const [user, setuser] = useState(null);
  const [searched, setsearched] = useState("");
  const [hamState, sethamState] = useState(false);
  const [Alluser, setAlluser] = useState();
  const [selectedUser, setselectedUser] = useState(null);
  const [message, setmessage] = useState("");
  const [arrivalmessage, setarrivalmessage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [Allmessage, setAllmessage] = useState(null);
  const [out, setout] = useState(false);
  const navigate = useNavigate()
  const [onl, setonl] = useState(null)
  const [socket, setsocket] = useState(null)


  const err = (m) => {

    toast.error(m, {
      'position': 'bottom-right',
      'theme': 'colored'
    })
  }

  const handleShowEmoji = () => {
    setShowEmojiPicker(!showEmojiPicker);
  }

  const showlogoutsection = () => {
    if (out) {
      setout(false);
    }
    else {
      setout(true);
    }
  }
  const handleEmojiClick = (event, emoji) => {
    let m = message;
    m += emoji.emoji;
    setmessage(m);
  }

  const hamHandler = () => {
    if (hamState) {
      sethamState(false);
    }
    else {
      sethamState(true)
    }
  }

  const handleLogout = async () => {
    const resp = await axios.post('https://messsaging-app.herokuapp.com/api/logout')
    if (resp.data.success === true) {
      navigate('/login')
    }
  }

  const getProfile = async () => {
    if (!user) {
      const { data } = await axios.get('https://messsaging-app.herokuapp.com/api/profile', {
        withCredentials: true
      })
      if (data.success === true) {
        setuser(data.message)
      }
      else { navigate('/login') }
    }
  }
  const getAllUser = async () => {
    if (!Alluser) {
      const res = await axios.get('https://messsaging-app.herokuapp.com/api/getalluser', {
        withCredentials: true
      })
        .catch(e => console.log(e));
      const data = await res.data;

      if (data.success === true) {
        setAlluser(data.message)
      }
      else { navigate('/login') }
    }
  }

  const newmsg = async () => {
    if (message === "") {
      err("type a message to send");
    }
    else {
      const obj = {
        sender: user._id,
        reciever: selectedUser._id,
        text: message,
        sendername: user.name,
        createdAt: new Date(Date.now())
      }

      socket.emit('sendmessage', obj)
      setAllmessage((prev) => {
        return (
          [...prev, obj]
        )
      })

      const res = await axios.post('https://messsaging-app.herokuapp.com/api/newmessage', obj)
      if (res.data.success === true) {
        console.log("message sent");
        setmessage("");
      }
      else if (res.data.success === false) {
        console.log(res.data.message)
      }
    }
  }

  const getAllMessage = async () => {
    const res = await axios.post('https://messsaging-app.herokuapp.com/api/getmessage', {
      "reciever": selectedUser
    }, { withCredentials: true })

    if (res.data.success === true) {
      setAllmessage(res.data.message);
    }
    else if (res.data.success === false) {
      console.log(res.data.message)
    }
  }

  useEffect(() => {
    getProfile()
    getAllUser()
  }, [user, Alluser, navigate])

  useEffect(() => {
    getAllMessage();
  }, [selectedUser, arrivalmessage, message])


  useEffect(() => {
    setsocket(io('https://messsaging-app.herokuapp.com', { upgrade: true }))
  }, [])

  useEffect(() => {

    socket?.on('connect', () => {
      console.log('connected successfully')
    })
  }, [socket])

  useEffect(() => {
    socket?.emit('adduser', user?._id)
  }, [user, socket])

  useEffect(() => {
    socket?.on('getmessage', (data) => {
      setarrivalmessage({
        sender: data.sender,
        text: data.text,
        reciever: data.reciever,
        sendername: data.sendername,
        createdAt: new Date(Date.now())
      })

    })

    socket?.on('getuser', (data) => {
      setonl(data)
    })
  })

  useEffect(() => {
    if (selectedUser && user) {
      if (arrivalmessage !== null) {
        if (arrivalmessage.reciever === user._id && arrivalmessage.sendername === selectedUser.name) {
          if (Allmessage !== null) { setAllmessage((prev) => { return [...prev, arrivalmessage] }) }
        }

      }
    }
  }, [arrivalmessage, selectedUser, user])



  return (
    <div>
      {
        user && Alluser ?
          <div className='user-page'>
            <header >
              <div className="head">
                <div className="title">
                  <div className="ham" >< GiHamburgerMenu onClick={hamHandler} /></div>
                  <h1 onClick={() => {
                    setselectedUser(null);
                  }}>MESSAGING CLUB</h1>
                </div>
                <div className="logout-section">
                  <div className="userimg"><img src={user.profilePicture} alt="" width={"40px"} height={"40px"} />
                    <MdArrowDropDown className='logout-arrow' onClick={showlogoutsection} /></div>
                  <div className="profile-sec">
                    {out ? <div className="l">
                      <div className="username">{user.name.toUpperCase()}</div>
                      <div className="sign-out"><FiLogOut onClick={handleLogout} /></div>
                    </div>
                      : ""}</div>
                </div>
              </div>
            </header>
            <main className='main'>
              {
                !selectedUser ? <div className="ghostgif">
                  <img src={src} width={"100px"} height={"100px"} alt="" />
                  <h1>WELCOME</h1>
                  <h3>Select a conversation to start chatting</h3>
                </div> :
                  <div className="chat-container">
                    <div className="chat-head">
                      <div className="chat-head-img"><img src={selectedUser.profilePicture} alt="" width={"40px"} height={"40px"} /></div>
                      <div className="chat-head-username">{selectedUser.name.toUpperCase()}</div>
                    </div>
                    <ScrollToBottom className="mesg">
                      {
                        Allmessage ? Allmessage.map((e, i) => {
                          return (
                            <div className='message-container' key={i} >
                              <div className='msg-i' style={{ alignSelf: `${user.name === e.sendername ? 'flex-end' : 'flex-start'}`, 'backgroundColor': `${user.name === e.sendername ? 'rgb(153, 153, 177)' : 'rgb(140, 166, 151)'}` }}>
                                <div className='mas'>{e.text}</div>
                                <div className='d' >
                                  <Moment className='date' format="HH:mm, DD-MM-YYYY">
                                    {e.createdAt}
                                  </Moment>
                                  <div className='sender'>{e.sendername.toUpperCase()}</div>
                                </div>
                              </div>
                            </div>
                          )
                        }) : <div className='lmsg'><img src={loader} alt='loader' className='loadm' /></div>
                      }
                    </ScrollToBottom>
                    <div className="btn-container">
                      <BsEmojiSmileFill className='e' onClick={handleShowEmoji} />
                      {
                        showEmojiPicker && <Picker className='emoji-picker-react' onEmojiClick={handleEmojiClick} pickerStyle={{ 'position': 'fixed', 'bottom': '85px', 'left': '20px', 'width': '270px', 'height': '200px', 'boxShadow': 'none' }} />
                      }
                      <input type="text" placeholder='Type a message' className='input-container' value={message} onChange={(e) => setmessage(e.target.value)} name="message" id="" />
                      <FiSend className='send-msg' onClick={newmsg} />
                    </div>
                    <ToastContainer />
                  </div>
              }
              {
                hamState ? <div className="part1">
                  <div className='search-u'>
                    <div className='search' >
                      <AiOutlineSearch />
                    </div>
                    <input placeholder='search here for users' className='search-inp' value={searched} onChange={(e) => { setsearched(e.target.value) }} type='text' />
                  </div>
                  <div className="users-section">

                    {
                      Alluser ? Alluser?.filter((elem) => { return elem.name.toLowerCase().includes(searched?.toLowerCase()) }).map((element, i) => {
                        return (
                          <div className='u-n' key={i} onClick={() => {
                            setselectedUser(element); sethamState(false)
                            setmessage("")
                          }} ><div className="selecteduserimg"><img src={element.profilePicture} alt="" width={"40px"} height={"40px"} /></div>
                            <div className="about">
                              <div className="username">{element.name.toUpperCase()}</div>
                              {onl?.some((e) => { return e.userid === element._id }) ? <div className="online">online</div> : null}
                            </div></div>
                        )
                      }) : 'No user Found'
                    }
                  </div>
                </div> : ""
              }

            </main>
          </div>
          : <div className='loading-page'><img src={loader} alt='loader' className='loader-big' /></div>}
    </div>
  )
}

export default User
