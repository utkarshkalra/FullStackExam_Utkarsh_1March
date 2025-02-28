import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import { products } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function NewProduct() {
  const router = useRouter();
  const { user, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!user?.isAdmin) {
    if (typeof window !== "undefined") {
      router.push("/");
    }
    return null;
  }

  const handleSubmit = async (formData: FormData) => {
    try {
      const json = {
        name: formData.get("name"),
        description: formData.get("description"),
        price: formData.get("price"),
        stock: formData.get("stock"),
        category: formData.get("category"),
      };
      console.log(json);
      await products.create(json);
      router.push("/admin/products");
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <Link
            href="/admin/products"
            className="text-blue-500 hover:underline"
          >
            Back to Products
          </Link>
        </div>
        <ProductForm onSubmit={handleSubmit} buttonText="Create Product" />
      </div>
    </Layout>
  );
}
