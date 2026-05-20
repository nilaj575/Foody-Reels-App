import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../../socket";
import "../../styles/userOrders.css";
import { apiUrl } from "../../config/api";

function UserOrders() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {

    const fetchOrders = async () => {
      try {

        const res = await axios.get(
          apiUrl("/api/order/user-orders"),
          { withCredentials: true }
        );

        setOrders(res.data);

        const userId = localStorage.getItem("userId");

        if (userId) {
          socket.emit("joinUser", userId);
        }

      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();

  }, []);


  useEffect(() => {

    socket.on("orderStatusUpdate", (data) => {

      setOrders(prev =>
        prev.map(o =>
          o._id === data.orderId
            ? { ...o, status: data.status }
            : o
        )
      );

    });

    return () => socket.off("orderStatusUpdate");

  }, []);


  return (
    <div className="orders-page">

      <h2>My Orders</h2>

      {orders.length === 0 && <p>No orders yet</p>}

      {orders.map(order => (

        <div className="order-card" key={order._id}>

          {/* Order ID */}
          <p className="order-id">
            Order #{order._id.slice(-6)}
          </p>

          {/* Items */}
          <div className="order-items">

            {order.items.map((item, index) => (

              <p key={index}>
                {item.name} × {item.quantity}
              </p>

            ))}

          </div>

          {/* Total */}
          <p className="order-total">
            Total: ₹{order.totalAmount}
          </p>

          {/* Status */}
          <p className="order-status">
            Status:
            <span className={`status ${order.status}`}>
              {order.status}
            </span>
          </p>

        </div>

      ))}

    </div>
  );
}

export default UserOrders;