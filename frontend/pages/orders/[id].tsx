import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { Order } from "../../types";
import { orders } from "../../utils/api";
// import Image from "next/image";
import Link from "next/link";

export default function OrderDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      const { data } = await orders.getById(id as string);
      setOrder(data);
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError("Failed to fetch order details");
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

  if (error || !order) {
    return (
      <Layout>
        <div className="bg-red-100 text-red-700 p-4 rounded">
          {error || "Order not found"}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Order Details</h1>
          <Link href="/orders" className="text-blue-500 hover:underline">
            Back to Orders
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold">Order #{order.id}</h2>
                <p className="text-gray-500">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  ${order.total.toFixed(2)}
                </div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm ${
                    order.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : order.status === "cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.OrderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-sm">
                        <div className="font-medium">{item.productId}</div>
                        <div className="text-gray-500">
                          Quantity: {item.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t mt-6 pt-6">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
