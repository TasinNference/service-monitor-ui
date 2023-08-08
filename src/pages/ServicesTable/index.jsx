import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { InfluxDB, FluxTableMetaData } from "@influxdata/influxdb-client";
import { useEffect, useState } from 'react';

const ServicesTable = ({machine}) => {
  const [loading, setLoading] = useState(true);
  const queryApi = new InfluxDB({
    url: "http://localhost:8086",
    token:
      "0O_ouBs_TsOOcEuqxNtbrMhdNuQkrPM27Nga-ks1wcaSQnaob-fm4_CGOmYijhkHKR0h_jD5E4MW-qisrdK4kw==",
  }).getQueryApi("pramana");
  const fluxQuery =
  `from(bucket:"metrics") |> range(start: -15s) |> filter(fn: (r) => r._measurement == "services" and r.machine_name == "${machine}")`;
  const [rows, setRows] = useState([])
  async function getRows() {
    const rowsArr = [];
    for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
      // the following line creates an object for each row
      const o = tableMeta.toObject(values);
      // console.log(JSON.stringify(o, null, 2))
      rowsArr.push(o);

      // alternatively, you can get only a specific column value without
      // the need to create an object for every row
      // console.log(tableMeta.get(row, '_time'))
    }
    console.log(rowsArr, "rows");
    setRows(rowsArr)
    setLoading(false)
  }

  useEffect(() => {
    if(machine) getRows();
  }, [machine]);

  const statusColors = {
    RUNNING: 'success',
    STOPPED: 'warning',
    FATAL: 'error',
    STARTING: 'info'
  };

  const columns = [
    { id: 'status', label: 'status' },
    { id: 'name', label: 'Process Name' },
    { id: 'lastUpdated', label: 'Last Updated' }
  ];

  const createData = (status, name, lastUpdated) => {
    return { status, name, lastUpdated };
  };

  // const rows = [
  //   createData('RUNNING', 'node.js', new Date()),
  //   createData('STOPPED', 'node.js', new Date()),
  //   createData('FATAL', 'node.js', new Date()),
  //   createData('RUNNING', 'node.js', new Date()),
  //   createData('STOPPED', 'node.js', new Date()),
  //   createData('FATAL', 'node.js', new Date()),
  //   createData('RUNNING', 'node.js', new Date()),
  //   createData('STOPPED', 'node.js', new Date()),
  //   createData('FATAL', 'node.js', new Date())
  // ];

  return (
    <div style={{height: '100%', overflow: 'auto', position: 'relative'}}>
      <Table stickyHeader sx={{position: 'absolute', top: 0, left: 0, width: '100%'}}>
        <TableHead>
          {columns.map((column) => (
            <TableCell key={column.id} align={column.align}>
              {column.label}
            </TableCell>
          ))}
        </TableHead>
        {(!loading && rows.length > 0) && <TableBody>
          {rows.map((row) => (
            <TableRow>
              <TableCell>
                <Chip color={statusColors[row._value]} label={row._value} />
              </TableCell>
              <TableCell>{row._field}</TableCell>
              <TableCell>
                {new Date(row._time).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>}
      </Table>
      {(!loading && rows.length === 0) && <div style={{marginTop: '15px', textAlign: 'center'}}>No Services</div>}
    </div>
  );
};

export default ServicesTable;
