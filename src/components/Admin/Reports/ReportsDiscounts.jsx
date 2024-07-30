import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

function ReportsDiscounts() {
  const dispatch = useDispatch();
  const reportsPunchCardDiscounts = useSelector((store) => store.reportsPunchCardDiscounts);

  useEffect(() => {
    dispatch({ type: 'FETCH_REPORTS_PUNCH_CARD_DISCOUNTS' });
  }, [dispatch]);

  const columns = [
    { field: 'name', headerName: 'Discount', flex: 1 },
    { field: 'redeemed_count', headerName: 'Total Redeemed', flex: 1 },
  ];

  const rows = reportsPunchCardDiscounts.map((report, index) => ({
    id: index,
    name: report.name,
    redeemed_count: report.redeemed_count,
  }));

  return (
    <Container maxWidth='md'>
      <Typography variant='h4' color='secondary' gutterBottom align='center'>
        Most Used Discounts
      </Typography>
      <Box sx={{ height: 400, width: '100%', mt: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={25}
          rowsPerPageOptions={[25, 50, 100]}
          autoHeight
          sx={{ backgroundColor: 'white' }}
        />
      </Box>
    </Container>
  );
}

export default ReportsDiscounts;
