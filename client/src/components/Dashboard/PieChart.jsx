import Chart from "react-apexcharts";
import { useTheme } from "../../context/ThemeContext";
import { useEffect, useMemo, useState } from "react";
import { axiosInstance } from "../../utils/axiosInstance";

const PieChart = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [buckets, setBuckets] = useState([]);

  useEffect(() => {
    let mounted = true;

    axiosInstance
      .get("/focus/stats/by-goal")
      .then((res) => {
        if (!mounted) return;
        setBuckets(res.data?.data?.buckets || []);
      })
      .catch(() => {
        if (!mounted) return;
        setBuckets([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const labels = useMemo(() => {
    if (buckets.length === 0) return ["No data"];
    return buckets.map((b) => b.label);
  }, [buckets]);

  const pieSeries = useMemo(() => {
    if (buckets.length === 0) return [1];
    return buckets.map((b) => Math.round((b.seconds || 0) / 60));
  }, [buckets]);

  const pieOptions = {
    chart: {
      background: "transparent",
      toolbar: { show: false },
      foreColor: isDark ? "#e2e8f0" : "#334155",
    },
    theme: {
      mode: isDark ? "dark" : "light",
    },
    legend: {
      position: "bottom",
    },
    labels,
  };

  return (
    <Chart options={pieOptions} series={pieSeries} type="donut" width="100%" />
  );
};

export default PieChart;
