import React, { useState } from 'react';
import { CiMenuBurger } from "react-icons/ci";
import { GiCancel } from "react-icons/gi";
import './index.css';

const LeftNav = (props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {options} = props

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={`left-nav ${isMenuOpen ? 'open' : ''}`}>
      <button className="menu-button" onClick={toggleMenu}>
       {isMenuOpen ? <GiCancel/> :<CiMenuBurger/>}
      </button>
      <div className="options">
        {isMenuOpen && (
            <>
            {options.map(each =>(
                <a href={each.link} className='option'>{each.value}</a>
            ))}
            </>
        )}
       
        {/* Add more options as needed */}
      </div>
    </div>
  );
};

export default LeftNav;
