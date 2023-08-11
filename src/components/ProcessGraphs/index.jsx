import moment from 'moment';
import React, { memo, useEffect, useMemo, useState } from 'react';
import queryApi from '../../configs/queryApi';

const ProcessGraphs = memo(({ dateTime, machine }) => {
  const chartsArr = ['proc_by_cpu_percent', 'proc_by_memory_percent'];
  const [chartData, setChartData] = useState(null);
  const diff = dateTime.diff(moment(), 'm');

  const queries = chartsArr.map(async (item) => {
    const rowsArr = [];
    for await (const { values, tableMeta } of queryApi.iterateRows(
      `from(bucket:"metrics")
      |> range(start: ${diff - 5}m, stop: ${diff !== 0 ? `${diff}m` : 'now()'}) 
      |> filter(fn: (r) => r._measurement == "${item}" and r.machine_name == "${
        machine.machine_name
      }")`
    )) {
      const o = tableMeta.toObject(values);
      rowsArr.push(o);
    }
    return rowsArr;
  });

  const getData = async () => {
    const data = await Promise.all(queries);
    console.log(data, 'data data');
    // setChartData(
    //   data.map((item) => ({
    //     datasets: [
    //       { data: formatData(item), pointRadius: 0, borderColor: '#73bf69' }
    //     ]
    //   }))
    // );
  };

  useEffect(() => {
    // getData();
  }, [dateTime]);

  console.log('process queries', queries);

  return <div>ProcessGraph</div>;
});

export default ProcessGraphs;
