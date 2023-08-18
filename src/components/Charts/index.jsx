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
  TextField,
  Tooltip
} from '@mui/material';
import { DateTimeField, DateTimePicker } from '@mui/x-date-pickers';
import { clone } from 'lodash';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HistoryIcon from '@mui/icons-material/History';
import queryApi from '../../configs/queryApi';
import ProcessGraphs from '../ProcessGraphs';
import axios from '../../configs/axios';

function Charts({ machine, refresh, panelRef, panelHeight }) {
  const chartsArr = ['CPU_Usage', 'Memory_Usage', 'Disk_Usage'];
  const getTime = (setPast, setNow) => {
    const now = setNow || moment();
    const past = setPast || now.clone().subtract(5, 'm');
    return [past, now];
  };

  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(getTime());
  const [stopRefresh, setStopRefresh] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [chartData, setChartData] = useState({});

  const getGraphData = async (custom) => {
    const pastDiff = timeRange[0].diff(moment(), 'minutes');
    const nowDiff = timeRange[1].diff(moment(), 'minutes');
    const response = (
      await axios.post('/', {
        measurement: 'resources',
        machine_name: machine.machine_name,
        start: `${pastDiff}m`,
        stop: nowDiff === 0 ? 'now()' : `${nowDiff}m`
      })
    ).data;
    const tempObj = {};
    chartsArr.forEach((title) => (tempObj[title] = []));
    response.forEach((item) => {
      if (chartsArr.includes(item._field)) {
        tempObj[item._field].push(item);
      }
    });

    const formatData = (arr) => {
      return arr.map((item) => ({
        x: moment(item._time),
        y: item._value
      }));
    };

    setChartData(
      chartsArr.map((title) => {
        return {
          datasets: [
            {
              data: formatData(tempObj[title]),
              pointRadius: 0,
              borderColor: '#73bf69'
            }
          ]
        };
      })
    );

    const range = custom ? timeRange : getTime();
    setTimeRange(range);
    setLoading(false);
  };

  useEffect(() => {
    if (!stopRefresh && machine) {
      getGraphData();
    }
  }, [refresh]);

  useEffect(() => {
    if (machine) getGraphData(true);
  }, [timeRange, machine]);

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

  useEffect(() => {}, [machine, loading, chartData]);

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative'
      }}
    >
      <Dialog
        fullWidth
        maxWidth="md"
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        sx={{ overflow: 'auto' }}
      >
        <Box sx={{ width: '100%' }}>
          {openDialog && (
            <ProcessGraphs dateTime={openDialog} machine={machine} />
          )}
        </Box>
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
                    <Tooltip title="Reset Time">
                      <IconButton onClick={resetTime}>
                        <HistoryIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="DateTime Picker">
                      <IconButton onClick={() => setOpenPicker(true)}>
                        <CalendarMonthIcon />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                )
              }
            }
          }}
        />
      </Box>
      {!loading && chartData[0]?.datasets[0].data.length === 0 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          No Data
        </div>
      )}
      {machine && !loading && chartData[0]?.datasets[0]?.data?.length > 0 && (
        <Box
          ref={panelRef}
          sx={{
            flexGrow: 1,
            display: 'grid',
            overflow: 'auto',
            padding: '25px',
            rowGap: '25px',
            gridTemplateRows: '1fr 1fr 1fr'
          }}
        >
          {chartsArr.map((item, index) => (
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
      )}
    </Card>
  );
}

export default Charts;
