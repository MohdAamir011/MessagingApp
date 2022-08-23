import React from "react";
import Error from "./components/Error";
import Login from "./components/Login";
import Register from "./components/Register";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import './css/app.css'
import User from "./components/User";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<User />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
