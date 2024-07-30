import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Typography, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

function ReportsGolfCoursePunchCardHigh() {
  const dispatch = useDispatch();
  const reportsPunchCardGolfCoursesHigh = useSelector(
    (store) => store.reportsPunchCardGolfCoursesHigh
  );

  useEffect(() => {
    dispatch({ type: "FETCH_REPORTS_PUNCH_CARD_GOLF_COURSES_HIGH" });
  }, [dispatch]);

  const columns = [
    { field: "name", headerName: "Golf Course", flex: 1 },
    { field: "redeemed_count", headerName: "Total Redeemed", flex: 1 },
  ];

  const rows = reportsPunchCardGolfCoursesHigh.map((report, index) => ({
    id: index,
    name: report.name,
    redeemed_count: report.redeemed_count,
  }));

  return (
    <Container maxWidth="md">
      <Typography variant="h4" color="secondary" gutterBottom align="center">
        Total Redeemed discounts at each Golf Course
      </Typography>
      <Box sx={{ height: 400, width: "100%", mt: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={25}
          rowsPerPageOptions={[25]}
          autoHeight
          sx={{ backgroundColor: "white" }}
        />
      </Box>
    </Container>
  );
}

export default ReportsGolfCoursePunchCardHigh;
