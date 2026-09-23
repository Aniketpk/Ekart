import axios from "axios";
import React, { useEffect, useState } from "react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_URL}/api/v1/order/all`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Failed to fetch admin orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [accessToken]);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">
        Loading all orders...
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <h1 className="font-display text-3xl font-bold mb-6 text-[#121212]">Admin - All Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-ambient rounded-lg border border-[#f0edec] p-4">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#fcf9f8] border-b border-[#f0edec]">
              <tr>
                <th className="px-4 py-3 font-display font-semibold text-[#121212]">Order ID</th>
                <th className="px-4 py-3 font-display font-semibold text-[#121212]">User</th>
                <th className="px-4 py-3 font-display font-semibold text-[#121212]">Products</th>
                <th className="px-4 py-3 font-display font-semibold text-[#121212]">Amount</th>
                <th className="px-4 py-3 font-display font-semibold text-[#121212]">Status</th>
                <th className="px-4 py-3 font-display font-semibold text-[#121212]">Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-mono-label font-bold text-[#1a237e] border-b border-[#f0f0f0]">
                    {order._id}
                  </td>

                  <td className="px-4 py-3 border-b border-[#f0f0f0]">
                    <span className="font-medium text-[#121212]">
                      {order.user ? `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim() : "N/A"}
                    </span>
                    <br />
                    <span className="text-xs text-[#5c5c6d] font-body">
                      {order.user?.email}
                    </span>
                  </td>

                  <td className="px-4 py-3 border-b border-[#f0f0f0]">
                    {order.products?.map((p, idx) => (
                      <div
                        key={idx}
                        className="mb-1 text-sm font-medium text-[#121212]"
                      >
                        <span>
                          {p.productId?.productName}
                        </span>
                      </div>
                    ))}
                  </td>

                  <td className="px-4 py-3 border-b border-[#f0f0f0] font-display font-bold text-[#1a237e]">
                    ₹{order.amount?.toLocaleString("en-IN")}
                  </td>

                  <td className="px-4 py-3 border-b border-[#f0f0f0]">
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-semibold ${
                        order.status === "Paid"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : order.status === "Pending"
                          ? "bg-amber-50 text-amber-700 border border-amber-100"
                          : "bg-red-50 text-red-700 border border-red-100"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 border-b border-[#f0f0f0] text-sm text-[#5c5c6d] font-body">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;