import React from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch } from "react-redux";
import {
  decreaseQty,
} from "../redux/productSlice";



const CartProduct = ({ id, name, image, category, price, qty, total ,fun}) => {
  const dispatch = useDispatch();
  const deleteCartProduct = async () => {
    try {
      const userId = localStorage.getItem("id");
      const productId = id;
      const response = await fetch("http://localhost:8080/removeFromCart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode:"cors",
        body: JSON.stringify({
          userId,
          productId,
          quantity: 1, // You might want to dynamically set the quantity
        }),
      });
      const result = await response.json();
      console.log(result)
      fun()
      // Dispatch the action based on the API response
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  const increaseCartProduct = async () => {
    try {
      const userId = localStorage.getItem("id");
      const productId = id;
      const response = await fetch("http://localhost:8080/increaseQuantity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode:"cors",
        body: JSON.stringify({
          userId,
          productId,
        }),
      });
      const result = await response.json();
      fun()
      console.log(result)
      // Dispatch the action based on the API response
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  const decreaseCartProduct = async () => {
    try {
      const userId = localStorage.getItem("id");
      const productId = id;
      const response = await fetch("http://localhost:8080/decreaseQuantity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode:"cors",
        body: JSON.stringify({
          userId,
          productId,
        }),
      });
      const result = await response.json();
      fun()
      console.log(result)
      // Dispatch the action based on the API response
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  return (
    <div className="bg-slate-200 p-3 flex gap-4 border border-slate-400">
      <div className="bg-white p-2">
        <img src={image} alt = "" className="h-28 w-40 object-cover rounded" />
      </div>
      <div className="flex flex-col gap-1 px-3 w-full">
        <div className="flex justify-between">
          <h3 className="font-bold text-slate-600 capitalize text-lg md:text-1xl">
            {name}
          </h3>
          {/**delete product */}
          <div
            className="cursor-pointer text-lg text-slate-800 hover:text-red-400"
            onClick={deleteCartProduct}
          >
            <AiFillDelete />
          </div>
        </div>
        <p className="text-sm capitalize ">{category}</p>
        <p className="font-bold text-sm text-red-400 md:text-sm">{price}</p>
        <div className="flex justify-between">
          <div className=" flex gap-3 items-center">
            {/**add or reduce products */}
            <button
              className="bg-slate-300 hover:bg-yellow-600 text-white font-bold p-1"
              onClick={increaseCartProduct}
            >
              <AiOutlinePlus />
            </button>
            <p>{qty}</p>
            <button
              className="bg-slate-300 hover:bg-yellow-600 text-white font-bold p-1"
              onClick={decreaseCartProduct}
            >
              <AiOutlineMinus />
            </button>
          </div>
          <div className="flex items-center gap-2 font-bold text-slate-400">
            <p>Total:</p>
            <p className="text-red-400">
              {total}
              <span className="text-red-500">/-</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;
