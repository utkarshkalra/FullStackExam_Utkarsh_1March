import { useState } from "react";
import { Product } from "@/types";

interface ProductFormProps {
  initialData?: Partial<Product>;
  onSubmit: (formData: FormData) => Promise<void>;
  buttonText: string;
}

export default function ProductForm({
  initialData = {},
  onSubmit,
  buttonText,
}: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      await onSubmit(formData);
      setSuccess(true);

      // Reset form if it's a new product
      if (!initialData._id) {
        e.currentTarget.reset();
      }
    } catch (error) {
      console.error("Error saving product:", error);
      setError("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
      )}

      {success && (
        <div className="bg-green-100 text-green-700 p-4 rounded">
          Product saved successfully!
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={initialData.name}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={initialData.description}
          required
          rows={4}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <input
          type="text"
          id="category"
          name="category"
          defaultValue={initialData.category}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700"
        >
          Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          defaultValue={initialData.price}
          required
          min="0"
          step="0.01"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <div>
        <label
          htmlFor="stock"
          className="block text-sm font-medium text-gray-700"
        >
          Stock
        </label>
        <input
          type="number"
          id="stock"
          name="stock"
          defaultValue={initialData.stock}
          required
          min="0"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Saving..." : buttonText}
      </button>
    </form>
  );
}
