import { FC, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

interface LanguageStats {
  [key: string]: number;
}

interface LanguageChartProps {
  languageStats: LanguageStats;
}

const LanguageChart: FC<LanguageChartProps> = ({ languageStats }) => {
  useEffect(() => {
    console.log("Language Stats:", languageStats);
  }, [languageStats]);

  const data = {
    labels: Object.keys(languageStats),
    datasets: [
      {
        label: "Languages",
        data: Object.values(languageStats),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        borderColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#4B5563",
          font: {
            size: 14,
            weight: 500,
          },
        },
      },
    },
  };

  return <Pie data={data} options={options} />;
};

export default LanguageChart;
