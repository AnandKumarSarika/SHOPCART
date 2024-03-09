import React from 'react';
import { Bar } from 'react-chartjs-2';

const BarGraph = ({ users, products, orders }) => {
  const data = {
    labels: ['Users', 'Products', 'Orders'],
    datasets: [
      {
        label: 'Number of',
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.6)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: [users, products, orders],
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        type: 'category',
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarGraph;
