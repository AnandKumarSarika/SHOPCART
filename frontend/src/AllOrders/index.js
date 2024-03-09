import React, { useEffect, useState } from 'react';
import './index.css';
import LeftNav from '../Navbar';

const OrderDetails = () => {
  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const list = [{link:"admin-home",value:"Home"},{link:"newproduct",value:"Add Product"},{link:"all-orders",value:"All Orders"},{link:"login",value:"Logout"}]

  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        const response = await fetch('http://localhost:8080/admin/orders');
        const data = await response.json();

        // Filter out users with no orders
        const usersWithOrders = data.ordersData.filter(
          (userOrder) => userOrder.orders.length > 0
        );

        setOrdersData(usersWithOrders);
        setLoading(false);
      } catch (error) {
        setError('Error fetching data from the API');
        setLoading(false);
      }
    };

    fetchOrdersData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="order-details-container">
      <LeftNav options={list} />
      <h1 className="order-details-heading">All Orders</h1>
      {ordersData.map((userOrder) => (
        <div className="user-order" key={userOrder.userId}>
          <h1 className="user-name" >User: {userOrder.userName}</h1>
          <ul className="order-list">
            {userOrder.orders.map((order) => (
              <li className="order-item" key={order.productName}  style={{display:"flex"}}>
                <img
                  src={order.image} // Assuming your API response includes the image URL
                  alt={`Product: ${order.productName}`}
                  className="product-image"
                  style={{height:"100px",width:"100px"}}
                />
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-start",marginLeft:"20px",marginTop:"10px"}}>
                    <strong className="product-label">Product:{order.productName}</strong>
                    <strong className="quantity-label">Quantity:{order.quantity}</strong>
                    <strong className="quantity-label">Price:{order.price}</strong>
                </div>
                
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default OrderDetails;
