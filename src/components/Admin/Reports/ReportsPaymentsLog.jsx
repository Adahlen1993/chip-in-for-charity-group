import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Typography, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";

function ReportsPaymentsLog() {
  const dispatch = useDispatch();
  const reportsPaymentsLog = useSelector((store) => store.reportsPaymentsLog);

  useEffect(() => {
    dispatch({ type: "FETCH_REPORTS_PAYMENTS_LOG" });
  }, [dispatch]);

  const columns = [
    { field: "email", headerName: "User Email", flex: 1 },
    { field: "quantity", headerName: "Card Quantity", flex: 1 },
    {
      field: "created_at",
      headerName: "Time Purchased",
      flex: 1,
      valueFormatter: (params) => moment(params).format("YYYY-MM-DD | HH:mm"),
    },
  ];

  const rows = reportsPaymentsLog.map((report, index) => ({
    id: index,
    email: report.email,
    quantity: report.quantity,
    created_at: report.created_at,
  }));

  return (
    <Container maxWidth="md">
      <Typography variant="h4" color="secondary" gutterBottom align="center">
        Payment Log
      </Typography>
      <Box sx={{ height: 400, width: "100%", mt: 2, backgroundColor: "white" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={25}
          rowsPerPageOptions={[25, 50, 100]}
          autoHeight
          sx={{ backgroundColor: "white" }}
        />
      </Box>
    </Container>
  );
}

export default ReportsPaymentsLog;
