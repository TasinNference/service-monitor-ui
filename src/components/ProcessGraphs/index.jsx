import moment from 'moment';
import React, { memo, useEffect, useMemo, useState } from 'react';
import queryApi from '../../configs/queryApi';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip
} from 'chart.js';
import BarGraph from '../BarGraph';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const ProcessGraphs = memo(({ dateTime, machine }) => {
  const [rightPadding, setRightPadding] = useState(0);
  const chartsArr = ['proc_by_cpu_percent', 'proc_by_memory_percent'];
  const [chartData, setChartData] = useState(null);
  const diff = dateTime.diff(moment(), 'm');

  const queries = chartsArr.map(async (item) => {
    const rowsArr = [];
    for await (const { values, tableMeta } of queryApi.iterateRows(
      `from(bucket:"metrics")
      |> range(start: ${diff !== 0 ? `${diff * 60}s` : '-15s'}, stop: ${
        diff !== 0 ? `${diff * 60 + 15}s` : 'now()'
      })
      |> filter(fn: (r) => r._measurement == "${item}" and r.machine_name == "${
        machine.machine_name
      }")`
    )) {
      const o = tableMeta.toObject(values);
      rowsArr.push(o);
    }
    console.log('query', rowsArr);
    return rowsArr;
  });

  const getData = async () => {
    console.log('bar data', queries);
    const data = await Promise.all(queries);
    console.log(data, 'data data');
    setChartData(
      data?.map((item) => ({
        labels: item.map((p) => p._field),
        datasets: [
          {
            barPercentage: 0.5,
            categoryPercentage: 1,
            backgroundColor: '#57c05e',
            data: item.map((p) => Math.round(p._value * 10) / 10)
          }
        ]
      }))
    );
  };

  useEffect(() => {
    getData();
  }, [dateTime]);

  return (
    <div
      style={{
        padding: '15px'
      }}
    >
      {chartsArr.map((item, index) => {
        return (
          chartData && (
            <BarGraph
              title={item}
              data={chartData[index]}
              rightPadding={rightPadding}
              setRightPadding={setRightPadding}
            />
          )
        );
      })}
    </div>
  );
});

export default ProcessGraphs;
