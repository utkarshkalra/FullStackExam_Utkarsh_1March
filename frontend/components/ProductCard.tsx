import { Product } from "../types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (quantity: number) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      await onAddToCart?.(1);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={300}
        height={200}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <Link href={`/products/${product._id}`}>
          <h3 className="text-lg font-semibold cursor-pointer">
            {product.name}
          </h3>
          <p className="text-green-600 mb-2">{product.stock} in stock</p>
        </Link>
        <p className="text-gray-600 mb-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">${product.price}</span>
          {onAddToCart && product.stock > 0 && (
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 min-w-[120px] flex justify-center items-center"
            >
              {isAddingToCart ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adding...
                </>
              ) : (
                "Add to Cart"
              )}
            </button>
          )}
          {product.stock === 0 && (
            <span className="text-red-500">Out of Stock</span>
          )}
        </div>
      </div>
    </div>
  );
}
