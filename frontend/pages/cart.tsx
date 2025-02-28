import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { Cart as CartType } from "../types";
import { cart } from "../utils/api";
import Image from "next/image";

export default function Cart() {
  const router = useRouter();
  const [cartData, setCartData] = useState<CartType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const { data } = await cart.get();
      setCartData(data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError("Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    try {
      const { data } = await cart.updateItem({ productId, quantity });
      setCartData(data);
    } catch (error) {
      console.error("Error updating quantity:", error);
      setError("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      const { data } = await cart.removeItem(productId);
      setCartData(data);
    } catch (error) {
      console.error("Error removing item:", error);
      setError("Failed to remove item");
    }
  };

  const handleCheckout = async () => {
    try {
      router.push("/payment");
    } catch {
      setError("Failed to proceed to checkout");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  const total =
    cartData?.items.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0
    ) || 0;

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
        )}

        {cartData?.items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cartData?.items.map((item) => (
                    <tr key={item.productId._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-16 w-16 relative">
                            <Image
                              src={item.productId.imageUrl}
                              alt={item.productId.name}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.productId.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${item.productId.price}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.productId._id,
                                item.quantity - 1
                              )
                            }
                            disabled={item.quantity <= 1}
                            className="px-2 py-1 border rounded disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="text-sm text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.productId._id,
                                item.quantity + 1
                              )
                            }
                            disabled={item.quantity >= item.productId.stock}
                            className="px-2 py-1 border rounded disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${item.productId.price * item.quantity}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleRemoveItem(item.productId._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center">
                <div className="text-lg font-semibold">Total:</div>
                <div className="text-2xl font-bold">${total.toFixed(2)}</div>
              </div>
              <button
                onClick={handleCheckout}
                className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
