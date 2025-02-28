import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { orders } from "@/utils/api";

export default function Payment() {
  const router = useRouter();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState("");

  const createOrder = async () => {
    try {
      await orders.create();
      router.push("/orders"); // Redirect to orders page on success
    } catch {
      setProcessing(false);
      setError("Failed to create order. Please try again.");
    }
  };

  useEffect(() => {
    // Simulate payment processing
    const timer = setTimeout(() => {
      // Randomly succeed or fail (70% success rate)
      const success = Math.random() < 0.7;

      if (success) {
        // If payment successful, create order
        createOrder();
      } else {
        setProcessing(false);
        setError("Payment failed! Please try again.");
      }
    }, 2000); // Show processing for 2 seconds

    return () => clearTimeout(timer);
  }, [createOrder]);

  if (processing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Processing your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">❌ {error}</div>
          <button
            onClick={() => router.push("/cart")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Return to Cart
          </button>
        </div>
      </div>
    );
  }

  return null;
}
