import React, { useEffect, useState } from "react";
import CartProduct from "../component/CartProduct";
import emptyCart from "../assets/empty.gif";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  const navigate = useNavigate();
 
  const user = useSelector((state) => state.user);
  const userId = localStorage.getItem("id")
  if(!userId){
    navigate("/")
  }
  const fetchCartProducts = async () => {
    try {
      const userId = localStorage.getItem("id")
      const response = await fetch(`http://localhost:8080/getCart?userId=${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch cart products");
      }

      const data = await response.json();
      console.log(data)
      setCartProducts(data);

      var totalPrice = 0
      for(var each of data){
         totalPrice += each.product.price*each.quantity
      }
      const totalQty = data.reduce((acc, curr) => acc + parseInt(curr.quantity), 0);
      setTotalPrice(totalPrice);
      setTotalQty(totalQty);
    } catch (error) {
      console.error("Error fetching cart products:", error);
    }
  };

const placeOrder = async () => {
    try {
      const userId = localStorage.getItem("id");
      const response = await fetch("http://localhost:8080/add-to-myorders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode:"cors",
        body: JSON.stringify({
          userId,
        }),
      });
      const result = await response.json();
      console.log(result)
      fetchCartProducts()
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  useEffect(() => {
    // Fetch cart products when the component mounts
    fetchCartProducts();
  }, []);

  const handlePayment = async () => {
  if (user.email) {
    try {
      const response = await fetch('http://localhost:8080/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartProducts), // Assuming cartProducts is an array of items
      });

      if (!response.ok) {
        throw new Error('Failed to initiate payment');
      }

      const responseData = await response.json();
      const sessionId = responseData.sessionId; // Access sessionId property
      const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
      stripe.redirectToCheckout({ sessionId })
        .then(result => {
          if (result.error) {
            throw new Error(result.error.message);
          } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
            // Payment succeeded, call placeOrder()
            placeOrder(); // Call your placeOrder function here
          }
        })
        .catch(error => {
          console.error('Error handling payment:', error);
          toast.error('Failed to initiate payment');
        });
      placeOrder()
    } catch (error) {
      console.error('Error handling payment:', error);
      toast.error('Failed to initiate payment');
    }
  } else {
    toast.error('You have not logged in!');
    setTimeout(() => {
      localStorage.removeItem("id")
      navigate('/login');
    }, 1000);
  }
};

  return (
    <div>
      <h2 className="text-lg md:text-3xl font-bold p-2 text-slate-500 flex justify-center">
        Cart Products
      </h2>
      {cartProducts[0] ? (
        <div className="md:flex gap-5">
          <div className="w-full max-w-2xl my-4 rounded">
            {cartProducts.map((el) => (
              <CartProduct
                key={el.product._id}
                id={el.product._id}
                image={el.product.image}
                name={el.product.name}
                price={el.product.price}
                category={el.product.category}
                qty={el.quantity}
                total={el.product.price * el.quantity}
                fun = {fetchCartProducts}
              />
            ))}
          </div>
          {/* Cart summary */}
          <div className="my-2 p-2 ml-auto w-full max-w-md">
            <h2 className="flex justify-center text-xl text-orange-500 font-bold bg-white">
              Cart Summary
            </h2>
            <div className="text-lg px-2 mt-3 flex border-b">
              <p>Total Qty:</p>
              <p className="ml-auto font-bold w-28">{totalQty}</p>
            </div>
            <div className="text-lg px-2 mt-3 flex border-b">
              <p>Total Price:</p>
              <p className="ml-auto font-bold w-28">
                {totalPrice}
                <span className="text-red-500">RS</span>
              </p>
            </div>
            <div className="flex justify-center">
              <button
                className="bg-yellow-300 hover:bg-orange-600 text-white font-bold py-1 px-2 mt-2 w-48"
                onClick={handlePayment}
              >
                Payment
              </button>
            </div>
            <div className="flex justify-center">
              <button
                className="bg-yellow-300 hover:bg-orange-600 text-white font-bold py-1 px-2 mt-2 w-48"
                onClick={placeOrder}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-center items-center">
            <img src={emptyCart} alt="" className="w-full max-w-sm" />
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
