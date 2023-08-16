import React, { useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';

const horizontalBarTrack = {
  id: 'horizontalBarTrack',
  beforeDatasetsDraw(chart, args, plugins) {
    const {
      ctx,
      data,
      chartArea: { top, bottom, left, right, width, height },
      scales: { x, y }
    } = chart;

    const barThickness = chart.getDatasetMeta(0).data[0]?.height;
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

const BarGraph = ({ data, title, rightPadding, setRightPadding, maxVal }) => {
  const rightPaddingRef = useRef(0);

  useEffect(() => {
    rightPaddingRef.current = rightPadding;
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
        max: maxVal,
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
        text: title,
        color: '#ccccdc',
        font: {
          size: 14
        }
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

        ctx.fillStyle = '#ccccdc';
        ctx.font = 'bolder 14px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText(
          data.labels[index],
          left,
          y.getPixelForValue(index) - barThickness / 2 - 5
        );

        ctx.fillStyle = '#57c05e';
        ctx.font = 'bolder 16px Arial';
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
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: `${data.datasets[0].data.length * 50}px`
      }}
    >
      <Bar
        options={options}
        data={data}
        plugins={[horizontalBarTrack, floatingLabels]}
      />
    </div>
  );
};

export default BarGraph;
