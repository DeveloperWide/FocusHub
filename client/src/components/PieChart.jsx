import Chart from 'react-apexcharts';

const PieChart = () => {
  const pieOptions = {}

  const pieSeries = [20, 30, 50];

  const lineOptions = {
    chart: {
      type: 'line',
      height: 350,
    },

    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    },    
    stroke: {
      curve: 'smooth',
    },

    title: {
      text: 'Monthly Sales Data', 
      align: 'left',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',

        color: '#333',
      },
    },
    markers: {
      size: 2,
      colors: ['#FF4560'],
      strokeColor: '#fff',
      strokeWidth: 2,
    },
    tooltip: {
      theme: 'dark',
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },
    grid: {
      borderColor: '#e0e0e0',
      row: {
        colors: ['#f3f3f3', 'transparent'], // alternate row colors
        opacity: 0.5,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}%`,
      style: {
        fontSize: '12px',
        colors: ['#333'],
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      floating: true,
      fontSize: '14px',
      fontWeight: 'bold',
      labels: {
        colors: '#333',
      },
    },
    colors: ['#FF4560', '#00E396', '#008FFB', '#775DD0', '#FEB019'],
  };

  const lineSeries = [
    { 
      name: 'Sales',
      data: [30, 40, 35, 50, 49],
    },
    {
      name: 'Expenses',
      data: [20, 30, 25, 40, 39],
    },
    {
      name: 'Profit',
      data: [10, 20, 15, 30, 29],
    },
  ];


  return (
    <div className='flex flex-col lg:flex-row gap-y-2 m-20'>
      <Chart options={pieOptions} series={pieSeries} type="donut" width="100%" />
      <Chart options={lineOptions} series={lineSeries} type="line" width="100%"  />
    </div>
  )

}

export default PieChart;