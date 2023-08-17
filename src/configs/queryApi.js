import { InfluxDB } from '@influxdata/influxdb-client';

const queryApi = new InfluxDB({
  url: process.env.REACT_APP_INFLUX_URL,
  token: process.env.REACT_APP_INFLUX_TOKEN
}).getQueryApi('pramana');

export default queryApi;
