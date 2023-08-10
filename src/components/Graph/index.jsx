import React from 'react';
import 'chartjs-adapter-moment';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  TimeScale
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  TimeScale
);

const Graph = ({ data, title }) => {
  const options = {
    onClick: (e, element) => {
      console.log(e, element);
    },
    plugins: {
      title: {
        display: true,
        text: title
      }
    },
    tooltips: {
      mode: 'index'
    },
    hover: {
      mode: 'index',
      intersect: false
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'second'
        },
        ticks: {
          color: '#ccccdc',
          maxTicksLimit: 5,
          beginAtZero: false,
          major: { enabled: true }
        },
        grid: {
          color: '#2c3033'
        }
      },
      y: {
        ticks: {
          color: '#ccccdc',
          callback: (value) => {
            return `${value}%`;
          },
          maxTicksLimit: 10
        },
        grid: {
          color: '#2c3033'
        },
        min: 0,
        max: 100
      }
    }
  };

  return (
    <div className="Graph">
      <div>
        <Line options={options} data={data} />
      </div>
    </div>
  );
};

export default Graph;
