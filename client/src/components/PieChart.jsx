import Chart from 'react-apexcharts';

const PieChart = () => {
  const pieOptions = {}

  const pieSeries = [20, 30, 50];

  return (
      <Chart options={pieOptions} series={pieSeries} type="donut" width="300" />
  )

}

export default PieChart;