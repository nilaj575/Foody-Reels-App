import React, { useEffect, useState } from "react";
import axios from "axios";
import socket from "../../socket";
import "../../styles/partnerOrders.css";
import { apiUrl } from "../../config/api";

const PartnerOrders = () => {
  const [orders, setOrders] = useState([]);

  // Fetch existing orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          apiUrl("/api/food-partner/orders"),
          { withCredentials: true }
        );
        setOrders(res.data);
      } catch (err) {
        console.error("Fetch orders failed", err);
      }
    };

    fetchOrders();
  }, []);

 useEffect(() => {
  const partnerId = localStorage.getItem("partnerId");

  if (!partnerId) {
    console.log("Partner ID missing");
    return;
  }

  socket.on("connect", () => {
    
    socket.emit("joinPartner", partnerId);
    
  });

  return () => socket.off("connect");
}, []);
  // Socket: realtime new order
useEffect(() => {
  socket.on("newOrder", (order) => {
    console.log("Realtime order received:", order); // DEBUG
    setOrders(prev => [order, ...prev]);
  });

  return () => socket.off("newOrder");
}, []);
  

  // Update order status
  const updateStatus = async (id, status) => {
    try {
      const res = await axios.put(
        apiUrl(`/api/food-partner/orders/${id}`),
        { status },
        { withCredentials: true }
      );

      setOrders(prev =>
        prev.map(o => (o._id === id ? res.data : o))
      );
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  return (
    <div className="partner-orders">
      <h2>Incoming Orders</h2>

      {orders.length === 0 && <p>No orders yet</p>}

      {orders.map(order => (
        <div key={order._id} className="order-card">
          <div className="order-header">
            <span>Order #{order._id.slice(-6)}</span>
            <span className={`status ${order.status}`}>
              {order.status.toUpperCase()}
            </span>
          </div>

          <p><strong>Total:</strong> ₹{order.totalAmount}</p>

          <ul>
            {order.items.map((i, idx) => (
              <li key={idx}>
                {i.foodItem?.name} × {i.quantity}
              </li>
            ))}
          </ul>

          <div className="actions">
            {order.status === "pending" && (
              <>
                <button
                  className="accept"
                  onClick={() => updateStatus(order._id, "confirmed")}
                >
                  Accept
                </button>

                <button
                  className="reject"
                  onClick={() => updateStatus(order._id, "cancelled")}
                >
                  Reject
                </button>
              </>
            )}

            {order.status === "confirmed" && (
              <button
                className="prepare"
                onClick={() => updateStatus(order._id, "preparing")}
              >
                Prepare
              </button>
            )}

            {order.status === "preparing" && (
              <button
                className="ready"
                onClick={() => updateStatus(order._id, "ready")}
              >
                Ready
              </button>
            )}

            {order.status === "ready" && (
              <button onClick={() => updateStatus(order._id, "delivered")}>
                Delivered
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PartnerOrders;