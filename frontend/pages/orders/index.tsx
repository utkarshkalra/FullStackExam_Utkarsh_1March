import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Order } from "@/types";
import { orders } from "@/utils/api";
import Link from "next/link";

export default function Orders() {
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await orders.list();
      setUserOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Your Orders</h1>
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
        )}

        {userOrders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">
              You haven&apos;t placed any orders yet
            </p>
            <Link
              href="/products"
              className="mt-4 inline-block text-blue-500 hover:underline"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {userOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Order #{order.id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        ${order.total.toFixed(2)}
                      </div>
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Items
                    </h4>
                    <div className="space-y-2">
                      {order.OrderItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-sm"
                        >
                          <div>
                            {item.quantity}x {item.productId}
                          </div>
                          <div>${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <Link
                      href={`/orders/${order.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      View Order Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
