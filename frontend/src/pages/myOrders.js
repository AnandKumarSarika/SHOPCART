import React, { useState, useEffect } from 'react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const userId = localStorage.getItem('id');
      console.log(userId);
      const response = await fetch('http://localhost:8080/getOrders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode:"cors",
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      console.log(data);
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    finally {
        setLoading(false);
      }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1 style={{ color: 'darkblue',fontWeight:"bolder",fontSize:"36px" }}>My Orders</h1>
      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No products in Wishlist</p>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
          {orders.map((product) => {
            console.log(product.product)
            return(
            <div
              key={product.product._id}
              className="product-card"
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '10px',
                margin: '10px',
                width: '250px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease-in-out',
                cursor: 'pointer',
                display:"flex",
                flexDirection:"column"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <img
                src={product.product.image}
                alt={product.product.name}
                style={{ maxWidth: '100%', borderRadius: '8px', height:"200px" }}
              />
              <h3 style={{ color: 'darkgreen', margin: '10px 0' }}>{product.product.name}</h3>
              <p>{product.product.category}</p>
              <p>${product.product.price}</p>
            </div>
          )})}
        </div>
      )}
    </div>
  )
};

export default Orders;
