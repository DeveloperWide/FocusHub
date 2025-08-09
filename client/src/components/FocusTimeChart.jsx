import Chart from "react-apexcharts";

const FocusTimeChart = () => {
    const options = {
        chart: {
            id: "basic-bar"
        },
        xaxis: {
            categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yaxis: {
            title: {
                text: 'Hours'
            }
        },
        stroke: {
            curve: 'smooth',
        }
    }
    const series = [
        {
            name: "Focus Time",
            data: [4, 7, 6, 8, 3, 4, 3]
        }
    ]
    return (
        <Chart
            options={options}
            series={series}
            type="line"
            width="250"
        />
    )
}

export default FocusTimeChart;