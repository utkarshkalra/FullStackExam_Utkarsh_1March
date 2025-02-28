import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  labels: string[];
  data: number[];
  label: string;
}

export default function BarChart({ labels, data, label }: BarChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label,
        data,
        backgroundColor: "rgba(59, 130, 246, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return <Bar options={options} data={chartData} />;
}
