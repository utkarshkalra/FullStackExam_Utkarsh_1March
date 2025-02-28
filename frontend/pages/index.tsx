import { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import { Product } from "../types";
import { products } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import { cart } from "../utils/api";
import { useState } from "react";
interface HomeProps {
  featuredProducts: Product[];
}

export default function Home({ featuredProducts }: HomeProps) {
  const { user, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  console.log(user, loading);
  const handleAddToCart = async (productId: string, quantity: number) => {
    try {
      await cart.addItem({ productId, quantity });
    } catch (error) {
      console.error("Error adding item to cart:", error);
      setError("Failed to add item to cart");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout isHomeScreen={true}>
      <div className="space-y-8">
        <section
          className="relative h-[600px] bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: "url('/hero.jpg')" }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 text-white p-8">
            <h1 className="text-4xl font-semibold mb-6">
              Welcome to <span className="text-5xl font-bold">Shoesify</span>
            </h1>
            <p className="text-xl">
              Discover our amazing products at great prices!
            </p>
          </div>
        </section>

        <section className="sm:px-6 lg:px-8 px-4">
          <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={
                  user
                    ? (quantity) => handleAddToCart(product._id, quantity)
                    : undefined
                }
              />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const { data } = await products.list({ limit: 6 });
    return {
      props: {
        featuredProducts: data.products,
      },
    };
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return {
      props: {
        featuredProducts: [],
      },
    };
  }
};
