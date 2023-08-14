import React, { useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const horizontalBarTrack = {
  id: 'horizontalBarTrack',
  beforeDatasetsDraw(chart, args, plugins) {
    const {
      ctx,
      data,
      chartArea: { top, bottom, left, right, width, height },
      scales: { x, y }
    } = chart;

    const barThickness = chart.getDatasetMeta(0).data[0].height;
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    data.datasets[0].data.forEach((dataPoint, index) => {
      ctx.fillRect(
        left,
        y.getPixelForValue(index) - barThickness / 2,
        width,
        barThickness
      );
    });
  }
};

const BarGraph = ({ data, title }) => {
  const [rightPadding, setRightPadding] = useState(0);
  const rightPaddingRef = useRef(0);

  useEffect(() => {
    rightPaddingRef.current = rightPadding;
    console.log(rightPadding);
  }, [rightPadding]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    layout: {
      padding: {
        right: rightPadding + 20
      }
    },
    scales: {
      y: {
        border: {
          display: false
        },
        grid: {
          display: false,
          tickLength: 0
        },
        ticks: {
          display: false
        }
      },
      x: {
        border: {
          display: false
        },
        grid: {
          display: false,
          tickLength: 0
        },
        ticks: {
          display: false
        }
      }
    },
    plugins: {
      tooltip: {
        xAlign: 'left'
      },
      title: {
        display: true,
        text: title
      }
    }
  };

  const floatingLabels = {
    id: 'floatingLabels',
    afterDatasetsDraw(chart, args, options) {
      const {
        ctx,
        data,
        chartArea: { left, right },
        scales: { x, y }
      } = chart;

      const barThickness = chart.getDatasetMeta(0).data[0].height;

      data.datasets[0].data.forEach((dataPoint, index) => {
        const xPosition = right + rightPaddingRef.current + 20;

        ctx.save();

        ctx.fillStyle = 'red';
        ctx.font = 'bolder 12px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText(
          data.labels[index],
          left,
          y.getPixelForValue(index) - barThickness / 2 - 10
        );

        ctx.fillStyle = 'red';
        ctx.font = 'bolder 12px Arial';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(dataPoint, xPosition, y.getPixelForValue(index));
        const textWidth = ctx.measureText(dataPoint).width;
        if (textWidth > rightPadding) {
          setRightPadding(textWidth);
        }
      });
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <Bar
        options={options}
        data={data}
        plugins={[horizontalBarTrack, floatingLabels]}
      />
    </div>
  );
};

export default BarGraph;
