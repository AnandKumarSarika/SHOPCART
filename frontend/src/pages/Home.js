// import React, { useEffect, useRef, useState } from "react";
import React, { useRef,useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import HomeCard from "../component/HomeCard";
// import CardFeature from "../component/CardFeature";
// import {FcNext, FcPrevious} from "react-icons/fc"
import Allproduct from "../component/Allproduct";
import SimpleSlider from "./Slider";

//This is the homepage

const Home = () => {
  //retrieve products from redux store
  const navigate = useNavigate()
  //const productData = useSelector((state) => state.product.productList);

  //const homeProductCartList = productData.slice(0, 4);//no of products to be displayed
  //const homeProductCartListVegetables = productData.filter((el)=>el.category === "vegetables",[])
  //const loadingArray = new Array(4).fill(null)
  //const loadingArrayFeature = new Array(5).fill(null)
  //next / previous 
  //const slideProductRef = useRef()
  // const nextProduct =()=>{
  //   slideProductRef.current.scrollLeft += 200;
  // }
  // const preveProduct =()=>{
  //   slideProductRef.current.scrollLeft -= 200;
  // }
  
//products filter
  
  //front end application

  useEffect(() =>{
    if(localStorage.getItem("id") === null)
      navigate("login")
  })

  return (
    <div className="p-2 md:p-4">
      <div className="md:flex gap-4 py-2">
      </div>
      <div className="">
     <div className="w-full flex items-center">
     </div>
       <SimpleSlider/>
      </div>
      {/**other products */}
      <Allproduct heading={"Your Product"}/>
    </div>
  );
};

export default Home;
