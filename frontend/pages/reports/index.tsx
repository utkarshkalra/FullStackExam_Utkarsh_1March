import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import { reports } from "@/utils/api";
import { DailyRevenue, TopSpender, CategorySales } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";

export default function Reports() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dailyRevenue, setDailyRevenue] = useState<DailyRevenue[]>([]);
  const [topSpenders, setTopSpenders] = useState<TopSpender[]>([]);
  const [categorySales, setCategorySales] = useState<CategorySales[]>([]);

  useEffect(() => {
    console.log("user", user);
    if (!user) {
      return;
    }
    if (!user?.isAdmin) {
      router.push("/");
      return;
    }
    fetchReports();
  }, [user, router]);

  const fetchReports = async () => {
    try {
      const [revenueRes, spendersRes, categoryRes] = await Promise.all([
        reports.getDailyRevenue(),
        reports.getTopSpenders(),
        reports.getCategorySales(),
      ]);

      setDailyRevenue(revenueRes.data);
      setTopSpenders(spendersRes.data);
      setCategorySales(categoryRes.data);
    } catch {
      setError("Failed to fetch reports");
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

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Reports</h1>
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Daily Revenue</h2>
            <LineChart
              labels={dailyRevenue.map((item) => item.date)}
              data={dailyRevenue.map((item) => item.revenue)}
              label="Revenue"
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Top Spenders</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Spent
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topSpenders.map((spender) => (
                  <tr key={spender.userId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {spender.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {spender.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${spender.totalSpent.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Category Sales</h2>
            <BarChart
              labels={categorySales.map((item) => item._id)}
              data={categorySales.map((item) => item.totalProducts)}
              label="Products Sold"
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Average Price by Category
            </h2>
            <BarChart
              labels={categorySales.map((item) => item._id)}
              data={categorySales.map((item) => item.averagePrice)}
              label="Average Price"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
