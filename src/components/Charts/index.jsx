import { InfluxDB } from '@influxdata/influxdb-client';
import moment from 'moment';
import { useEffect, useState } from 'react';
import Graph from '../Graph';

function Charts({ machine, refresh }) {
  const chartsArr = ['CPU_Usage', 'Memory_Usage', 'Disk_Usage'];
  const queryApi = new InfluxDB({
    url: 'http://localhost:8086',
    token:
      '0O_ouBs_TsOOcEuqxNtbrMhdNuQkrPM27Nga-ks1wcaSQnaob-fm4_CGOmYijhkHKR0h_jD5E4MW-qisrdK4kw=='
  }).getQueryApi('pramana');
  const getTime = () => {
    const now = moment();
    const past = now.clone().subtract(5, 'm');
    return [past, now];
  };

  const [timeRange, setTimeRange] = useState(getTime());
  const [chartData, setChartData] = useState(null);

  const getGraphData = () => {
    const range = getTime();
    const pastDiff = timeRange[0].diff(moment(), 'minutes');
    const nowDiff = timeRange[1].diff(moment(), 'minutes');
    const queries = chartsArr.map(async (item) => {
      const rowsArr = [];
      for await (const { values, tableMeta } of queryApi.iterateRows(
        `from(bucket: "metrics")
            |> range(start: ${pastDiff}m, stop: ${
              nowDiff === 0 ? 'now()' : `${nowDiff}m`
            })
            |> filter(fn: (r) => r._measurement == "resources" and r._field == "${item}" and r.machine_name == "${
              machine.machine_name
            }")`
      )) {
        const o = tableMeta.toObject(values);
        rowsArr.push(o);
      }
      return rowsArr;
    });

    const formatData = (arr) => {
      return arr.map((item) => ({
        x: new Date(item._time),
        y: item._value
      }));
    };

    const getData = async () => {
      const data = await Promise.all(queries);
      console.log(data, 'data data');
      setChartData(
        data.map((item) => ({
          datasets: [
            { data: formatData(item), pointRadius: 0, borderColor: '#73bf69' }
          ]
        }))
      );
    };

    getData();
    setTimeRange(range);
  };

  useEffect(() => {
    getGraphData();
  }, [refresh]);

  useEffect(() => {
    getGraphData();
  }, [machine.machine_name]);

  return (
    <>
      {machine &&
        chartsArr.map((item, index) => (
          <div style={{ position: 'relative', width: '100%' }}>
            {chartData && <Graph data={chartData[index]} title={item} />}
          </div>
        ))}
    </>
  );
}

export default Charts;
