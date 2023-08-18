import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_INFLUX_API,
  withCredentials: false
});

export default instance;
