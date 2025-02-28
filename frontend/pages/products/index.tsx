import { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { Product } from "@/types";
import { products, cart } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";

interface ProductsPageProps {
  initialProducts: Product[];
  totalPages: number;
  categories: string[];
}

export default function Products({
  initialProducts,
  totalPages,
  categories,
}: ProductsPageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [currentProducts, setCurrentProducts] = useState(initialProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Initialize state from URL params when component mounts
  useEffect(() => {
    const { search: searchParam, category: categoryParam, page } = router.query;
    if (searchParam) setSearch(searchParam as string);
    if (categoryParam) setCategory(categoryParam as string);
    if (page) setCurrentPage(Number(page));
  }, [router.query]);

  const updateUrlParams = (params: {
    search?: string;
    category?: string;
    page?: number;
  }) => {
    const query = {
      ...(params.search && { search: params.search }),
      ...(params.category && { category: params.category }),
      ...(params.page && params.page > 1 && { page: params.page.toString() }),
    };

    // Update URL without reloading the page
    router.push(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      { shallow: true }
    );
  };

  const handleSearch = async () => {
    try {
      fetchProducts();
      setCurrentPage(1);
      updateUrlParams({ search, category, page: 1 });
    } catch (error) {
      console.error("Search error:", error);
      setError("Failed to search products");
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await products.list({
        page: currentPage,
        search,
        category,
      });
      setCurrentProducts(data.products);
    } catch {
      setError("Failed to fetch products");
    }
  };

  const handlePageChange = async (page: number) => {
    try {
      const { data } = await products.list({
        page,
        search,
        category,
      });
      setCurrentProducts(data.products);
      setCurrentPage(page);
      updateUrlParams({ search, category, page });
    } catch {
      setError("Failed to fetch products");
    }
  };

  const handleAddToCart = async (productId: string, quantity: number) => {
    try {
      await cart.addItem({ productId, quantity });
    } catch {
      setError("Failed to add item to cart");
    }
  };

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={handleSearchChange}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 px-4 py-2 border rounded"
          />
          <select
            value={category}
            onChange={handleCategoryChange}
            className="px-4 py-2 border rounded"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProducts.map((product) => (
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

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const [productsResponse, categoriesResponse] = await Promise.all([
      products.list({ page: 1 }),
      products.list({ limit: 1000 }), // Get all products for categories
    ]);

    const categories = Array.from(
      new Set(categoriesResponse.data.products.map((p: Product) => p.category))
    );

    return {
      props: {
        initialProducts: productsResponse.data.products,
        totalPages: Math.ceil(productsResponse.data.total / 10),
        categories,
      },
    };
  } catch {
    return {
      props: {
        initialProducts: [],
        totalPages: 0,
        categories: [],
      },
    };
  }
};
