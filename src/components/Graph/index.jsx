import React, { useRef } from 'react';
import 'chartjs-adapter-moment';
import { Line, getDatasetAtEvent, getElementAtEvent } from 'react-chartjs-2';
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

const Graph = ({ data, title, setOpenDialog }) => {
  const chartRef = useRef();
  const onClick = (e) => {
    const element = getElementAtEvent(chartRef.current, e);
    if (!element.length) return;

    const { datasetIndex, index } = element[0];

    console.log(data.datasets[datasetIndex].data[index], 'test');
    setOpenDialog(data.datasets[datasetIndex].data[index].x);
  };

  const options = {
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
        <Line ref={chartRef} options={options} data={data} onClick={onClick} />
      </div>
    </div>
  );
};

export default Graph;
