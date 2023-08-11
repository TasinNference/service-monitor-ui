import { InfluxDB } from '@influxdata/influxdb-client';
import moment from 'moment';
import { useEffect, useState } from 'react';
import Graph from '../Graph';
import {
  Box,
  Card,
  Dialog,
  Divider,
  IconButton,
  InputAdornment,
  TextField
} from '@mui/material';
import { DateTimeField, DateTimePicker } from '@mui/x-date-pickers';
import { clone } from 'lodash';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HistoryIcon from '@mui/icons-material/History';
import queryApi from '../../configs/queryApi';
import ProcessGraphs from '../ProcessGraphs';

function Charts({ machine, refresh, panelRef, panelHeight }) {
  const chartsArr = ['CPU_Usage', 'Memory_Usage', 'Disk_Usage'];
  const getTime = (setPast, setNow) => {
    const now = setNow || moment();
    const past = setPast || now.clone().subtract(5, 'm');
    return [past, now];
  };

  const [timeRange, setTimeRange] = useState(getTime());
  const [stopRefresh, setStopRefresh] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [chartData, setChartData] = useState(
    [...Array(3).keys()].map(() => ({
      datasets: [
        {
          data: [...Array(timeRange[1].diff(timeRange[0], 'm')).keys()].map(
            (num) => ({
              x: timeRange[0].clone().add(num, 'm'),
              y: num * 10
            })
          ),
          pointRadius: 0,
          borderColor: '#73bf69'
        }
      ]
    }))
  );

  const getGraphData = (custom) => {
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
              machine?.machine_name
            }")`
      )) {
        const o = tableMeta.toObject(values);
        rowsArr.push(o);
      }
      return rowsArr;
    });

    const formatData = (arr) => {
      return arr.map((item) => ({
        x: moment(item._time),
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
    const range = custom ? timeRange : getTime();
    setTimeRange(range);
  };

  useEffect(() => {
    if (!stopRefresh) {
      getGraphData();
    }
  }, [refresh]);

  useEffect(() => {
    getGraphData(true);
  }, [timeRange]);

  useEffect(() => {
    if (machine) getGraphData();
  }, [machine]);

  const resetTime = () => {
    const range = getTime();
    setTimeRange(range);
    setStopRefresh(false);
  };

  const onTimeChange = (newVal, { validationError }) => {
    if (!validationError) {
      setTimeRange(getTime(newVal, newVal.clone().add(5, 'm')));
      setStopRefresh(true);
    }
  };

  console.log(openDialog, 'open dialog');

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        {openDialog && (
          <ProcessGraphs dateTime={openDialog} machine={machine} />
        )}
      </Dialog>
      <Box
        sx={{
          padding: '15px 25px',
          display: 'flex'
        }}
      >
        <DateTimePicker
          open={openPicker}
          onClose={() => setOpenPicker(false)}
          sx={{ flexGrow: 1 }}
          label="Start Time"
          defaultValue={timeRange[0]}
          disableFuture
          onChange={onTimeChange}
          formatDensity="spacious"
          value={timeRange[0]}
          slotProps={{
            textField: {
              InputProps: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={resetTime}>
                      <HistoryIcon />
                    </IconButton>
                    <IconButton onClick={() => setOpenPicker(true)}>
                      <CalendarMonthIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }
            }
          }}
        />
      </Box>
      <Box
        ref={panelRef}
        sx={{
          flexGrow: 1,
          display: 'grid',
          overflow: 'auto',
          padding: '25px',
          rowGap: '25px',
          [panelHeight > 300 ? 'gridTemplateRows' : 'gridTemplateColumns']:
            '1fr 1fr 1fr'
        }}
      >
        {machine &&
          chartsArr.map((item, index) => (
            <div style={{ position: 'relative', width: '100%' }}>
              {chartData && (
                <Graph
                  setOpenDialog={setOpenDialog}
                  data={chartData[index]}
                  title={item}
                />
              )}
            </div>
          ))}
      </Box>
    </Card>
  );
}

export default Charts;
