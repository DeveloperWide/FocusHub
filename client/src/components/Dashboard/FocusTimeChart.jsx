import Chart from "react-apexcharts";
import { useTheme } from "../../context/ThemeContext";
import { useEffect, useMemo, useState } from "react";
import { axiosInstance } from "../../utils/axiosInstance";

const FocusTimeChart = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [days, setDays] = useState([]);

  useEffect(() => {
    let mounted = true;

    axiosInstance
      .get("/focus/stats/last-7-days")
      .then((res) => {
        if (!mounted) return;
        setDays(res.data?.data?.days || []);
      })
      .catch(() => {
        if (!mounted) return;
        setDays([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    return days.map((d) => {
      const dt = new Date(`${d.date}T00:00:00`);
      return dt.toLocaleDateString(undefined, { weekday: "short" });
    });
  }, [days]);

  const series = useMemo(() => {
    const minutes = days.map((d) => Math.round((d.seconds || 0) / 60));
    return [
      {
        name: "Focus Minutes",
        data: minutes,
      },
    ];
  }, [days]);

  const options = {
    chart: {
      id: "basic-bar",
      background: "transparent",
      toolbar: { show: false },
      foreColor: isDark ? "#e2e8f0" : "#334155",
    },
    theme: {
      mode: isDark ? "dark" : "light",
    },
    xaxis: {
      categories,
    },
    yaxis: {
      title: {
        text: "Minutes",
      },
    },
    stroke: {
      curve: "smooth",
    },
    grid: {
      borderColor: isDark ? "rgba(148, 163, 184, 0.2)" : "rgba(100, 116, 139, 0.2)",
    },
  };

  return <Chart options={options} series={series} type="line" width="100%" />;
};

export default FocusTimeChart;
