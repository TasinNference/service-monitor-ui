import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { useEffect, useState } from 'react';
import queryApi from '../../configs/queryApi';

const ServicesTable = ({ machine, refresh }) => {
  const [loading, setLoading] = useState(true);
  const fluxQuery = `from(bucket:"metrics") |> range(start: -15s) |> filter(fn: (r) => r._measurement == "services" and r.machine_name == "${machine}")`;
  const [rows, setRows] = useState([]);
  async function getRows() {
    const rowsArr = {};
    for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
      // the following line creates an object for each row
      const o = tableMeta.toObject(values);
      // console.log(JSON.stringify(o, null, 2))
      rowsArr[o._field] = o;

      // alternatively, you can get only a specific column value without
      // the need to create an object for every row
      // console.log(tableMeta.get(row, '_time'))
    }
    console.log(rowsArr, 'rows');
    setRows(
      Object.values(rowsArr).sort(
        (a, b) => statuses[a._value].order - statuses[b._value].order
      )
    );
    setLoading(false);
  }

  // useEffect(() => {
  //   if (machine) getRows();
  // }, [machine]);

  const statuses = {
    RUNNING: {
      color: 'success',
      order: 4
    },
    STOPPED: {
      color: 'warning',
      order: 2
    },
    FATAL: {
      color: 'error',
      order: 1
    },
    STARTING: {
      color: 'info',
      order: 3
    }
  };

  const columns = [
    { id: 'status', label: 'status' },
    { id: 'name', label: 'Process Name' },
    { id: 'lastUpdated', label: 'Last Updated' }
  ];

  const createData = (status, name, lastUpdated) => {
    return { status, name, lastUpdated };
  };

  // useEffect(() => {
  //   getRows();
  // }, [refresh]);

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
    <div style={{ height: '100%', overflow: 'auto', position: 'relative' }}>
      <Table
        stickyHeader
        sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
      >
        <TableHead>
          {columns.map((column) => (
            <TableCell key={column.id} align={column.align}>
              {column.label}
            </TableCell>
          ))}
        </TableHead>
        {!loading && rows.length > 0 && (
          <TableBody>
            {rows.map((row) => (
              <TableRow>
                <TableCell>
                  <Chip color={statuses[row._value].color} label={row._value} />
                </TableCell>
                <TableCell>{row._field}</TableCell>
                <TableCell>{new Date(row._time).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      {!loading && rows.length === 0 && (
        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          No Services
        </div>
      )}
    </div>
  );
};

export default ServicesTable;
