import React from 'react'
//import { CiForkAndKnife } from "react-icons/ci";

//This file filter categories in the homepage

const FilterProduct = ({ category, onClick, isActive }) => {
  return (
    <div onClick={onClick} style={{marginBottom:"20px"}}>
      <div
        className={`text-3xl rounded-full p-4 cursor-pointer ${
          isActive ? "bg-orange-500 " : "bg-yellow-500"
        }`}
      >
        <p className="text-center" style={{fontSize:"18px"}}>{category}</p>
      </div>
    </div>
  );
};

export default FilterProduct;