// App.js
import React from 'react';
import { GiHamburgerMenu } from "react-icons/gi";
import { FaRegHeart, FaBell } from "react-icons/fa";
import { LuClock6 } from "react-icons/lu";
import MapComponent from './components/MapComponent';
import './App.css';

const App = () => {
  return (
    <div className='container'>
      <div className='titleBar'>
        <GiHamburgerMenu />
        <h3>Ride Share</h3>
      </div>
      <MapComponent />
      <div className='footer'>
        <FaRegHeart />
        <FaBell />
        <LuClock6 />
      </div>
    </div>
  );
};

export default App;
