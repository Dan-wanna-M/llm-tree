// Import React and ECharts components
import React from 'react';
import ReactECharts from 'echarts-for-react';

// Component using echarts-for-react
const MyChartComponent: React.FC = () => {
  const option = {
    // Define your chart options here
    title: {
      text: 'ECharts entry example'
    },
    tooltip: {},
    legend: {
      data: ['Sales']
    },
    xAxis: {
      data: ['Shirts', 'Cardigans', 'Chiffons', 'Pants', 'Heels', 'Socks']
    },
    yAxis: {},
    series: [{
      name: 'Sales',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20]
    }]
  };

  return <ReactECharts option={option} />;
};

export default MyChartComponent;