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
import axios from '../../configs/axios';

const ServicesTable = ({ machine, refresh }) => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  async function getRows() {
    try {
      const rowsArr = {};
      const response = (
        await axios.post('/', {
          measurement: 'services',
          machine_name: machine,
          start: '-15s',
          stop: 'now()'
        })
      ).data;
      for (const item of response) {
        rowsArr[item._field] = item;
      }
      setRows(
        Object.values(rowsArr).sort(
          (a, b) => statuses[a._value].order - statuses[b._value].order
        )
      );
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (machine) getRows();
  }, [machine]);

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

  useEffect(() => {
    if (machine) getRows();
  }, [refresh]);

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
      {!loading && rows.length > 0 && (
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
                    <Chip
                      color={statuses[row._value].color}
                      label={row._value}
                    />
                  </TableCell>
                  <TableCell>{row._field}</TableCell>
                  <TableCell>{new Date(row._time).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      )}
      {!loading && rows.length === 0 && (
        <div
          style={{
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          No Services
        </div>
      )}
    </div>
  );
};

export default ServicesTable;
