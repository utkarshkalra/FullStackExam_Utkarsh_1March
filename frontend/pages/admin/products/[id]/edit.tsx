import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import { Product } from "@/types";
import { products } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [editLoading, setEditLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.isAdmin) {
      router.push("/");
      return;
    }

    if (id) {
      fetchProduct();
    }
  }, [id, user, router]);

  const fetchProduct = async () => {
    try {
      const { data } = await products.getById(id as string);
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Failed to fetch product");
    } finally {
      setEditLoading(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    await products.update(id as string, formData);
    router.push("/admin/products");
  };

  if (loading || editLoading) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="bg-red-100 text-red-700 p-4 rounded">
          {error || "Product not found"}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <Link
            href="/admin/products"
            className="text-blue-500 hover:underline"
          >
            Back to Products
          </Link>
        </div>
        <ProductForm
          initialData={product}
          onSubmit={handleSubmit}
          buttonText="Update Product"
        />
      </div>
    </Layout>
  );
}
