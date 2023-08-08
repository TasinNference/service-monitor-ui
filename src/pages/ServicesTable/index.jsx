import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

const ServicesTable = () => {
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

  const rows = [
    createData('RUNNING', 'node.js', new Date()),
    createData('STOPPED', 'node.js', new Date()),
    createData('FATAL', 'node.js', new Date()),
    createData('RUNNING', 'node.js', new Date()),
    createData('STOPPED', 'node.js', new Date()),
    createData('FATAL', 'node.js', new Date()),
    createData('RUNNING', 'node.js', new Date()),
    createData('STOPPED', 'node.js', new Date()),
    createData('FATAL', 'node.js', new Date())
  ];

  return (
    <div>
      <Table stickyHeader>
        <TableHead>
          {columns.map((column) => (
            <TableCell key={column.id} align={column.align}>
              {column.label}
            </TableCell>
          ))}
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow>
              <TableCell>
                <Chip color={statusColors[row.status]} label={row.status} />
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>
                {new Date(row.lastUpdated).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ServicesTable;
