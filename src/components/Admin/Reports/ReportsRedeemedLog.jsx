import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Typography, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";

function ReportsRedeemedLog() {
  const dispatch = useDispatch();
  const reportsRedeemedLog = useSelector((store) => store.reportsRedeemedLog);

  useEffect(() => {
    dispatch({ type: "FETCH_REPORTS_REDEEMED_LOG" });
  }, [dispatch]);

  const columns = [
    { field: "punch_card_id", headerName: "Punch Card ID", flex: 1 },
    { field: "email", headerName: "User Email", flex: 1 },
    { field: "golf_course_name", headerName: "Golf Course Name", flex: 1 },
    {
      field: "redeemed_date",
      headerName: "Time Redeemed",
      flex: 1,
      valueFormatter: (params) => moment(params).format("MM/DD/YYYY | HH:mm"),
    },
  ];

  const rows = reportsRedeemedLog.map((report, index) => ({
    id: index,
    punch_card_id: report.punch_card_id,
    email: report.email,
    golf_course_name: report.golf_course_name,
    redeemed_date: report.redeemed_date,
  }));

  return (
    <Container maxWidth="md">
      <Typography variant="h4" color="secondary" gutterBottom align="center">
        Redeemed Discounts Log
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

export default ReportsRedeemedLog;
