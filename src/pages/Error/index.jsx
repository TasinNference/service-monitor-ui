import { Typography } from '@mui/material';
import React from 'react';

const Error = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh'
      }}
    >
      <div style={{ display: 'grid', justifyItems: 'center' }}>
        <Typography variant="h1">404</Typography>
        <Typography variant="h6">Page Not Found</Typography>
      </div>
    </div>
  );
};

export default Error;
