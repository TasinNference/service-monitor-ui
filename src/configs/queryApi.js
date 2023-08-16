import { InfluxDB } from '@influxdata/influxdb-client';

const queryApi = new InfluxDB({
  url: 'http://cms.pramana.com:8086',
  token: process.env.REACT_APP_INFLUX_TOKEN
}).getQueryApi('pramana');

export default queryApi;
