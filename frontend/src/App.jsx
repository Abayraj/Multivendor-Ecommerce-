import { useState } from 'react'
import { BrowserRouter, createBrowserRouter, Route, RouterProvider, Routes, } from "react-router-dom";
import './App.css'
import { LoginPage, SignupPage} from './Routes';



function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage/>} />    
        <Route path="/sign-up" element={<SignupPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
