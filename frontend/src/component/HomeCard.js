import React,{useEffect} from "react";
import { Link } from "react-router-dom";
import { FcLikePlaceholder } from "react-icons/fc";
import { useNavigate } from "react-router-dom";



const HomeCard = ({ name, image, category, price, loading, id }) => {
  const navigate = useNavigate()

  
  const addToWhishList = async () => {
    try {
      const userId = localStorage.getItem("id");
      const productId = id;
      const response = await fetch("http://localhost:8080/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode:"cors",
        body: JSON.stringify({
          userId,
          productId // You might want to dynamically set the quantity
        }),
      });
  
      const result = await response.json();
      console.log(result)
      alert("Product Added to WhishList")
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };
  return (
    <div className="bg-white shadow-md p-2 rounded min-w-[150px]">
      {name ? (
        <>
          <Link
            to={`/menu/${id}`}
            onClick={window.scrollTo({ top: "0", behavior: "smooth" })}
          >
            <div className="w-40 min-h-[150px]" >
              <img src={image} alt = "" className="w-full h-full" />
            </div>
            <h3 className="font-semibold text-slate-600 text-center capitalize text-lg">
              {name}
            </h3>
            <p className="text-sm text-center capitalize">{category}</p>
            <p className="font-bold text-sm text-red-400 text-center">
              {price}
            </p>
            <h4 style={{display:"flex", marginTop:"20px"}} onClick={addToWhishList}>
            <FcLikePlaceholder style={{fontSize:"25px", marginLeft:"20%"}}/> WhishList
            </h4>
           
          </Link>
        </>
      ) : (
        <div className="flex justify-center items-center h-full">
          <p>{loading}</p>
        </div>
      )}
    </div>
  );
};

export default HomeCard;
