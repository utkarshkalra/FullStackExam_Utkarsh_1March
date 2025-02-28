import { useState } from "react";
import { GetServerSideProps } from "next";
import Layout from "@/components/Layout";
import { Product } from "@/types";
import { products, cart } from "@/utils/api";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      await cart.addItem({ productId: product._id, quantity });
      setError(null);
    } catch (error) {
      console.error("Add to cart error:", error);
      setError("Failed to add item to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative h-96 md:h-full">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-gray-500">{product.category}</p>
            </div>

            <p className="text-gray-700">{product.description}</p>

            <div className="text-3xl font-bold">${product.price}</div>

            <div>
              <p className="text-sm text-gray-500">Stock: {product.stock}</p>
              {product.stock > 0 ? (
                <p className="text-green-600">In Stock</p>
              ) : (
                <p className="text-red-600">Out of Stock</p>
              )}
            </div>

            {user && product.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label htmlFor="quantity" className="text-gray-700">
                    Quantity:
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    min={1}
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-20 px-3 py-2 border rounded"
                  />
                </div>

                {error && (
                  <div className="bg-red-100 text-red-700 p-4 rounded">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleAddToCart}
                  disabled={loading}
                  className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {loading ? "Adding to Cart..." : "Add to Cart"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const { data } = await products.getById(params?.id as string);
    return {
      props: {
        product: data,
      },
    };
  } catch (error) {
    console.error("Product details error:", error);
    return {
      notFound: true,
    };
  }
};
