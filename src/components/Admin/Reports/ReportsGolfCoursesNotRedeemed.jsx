import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Typography, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

function ReportsGolfCoursesNotRedeemed() {
  const dispatch = useDispatch();
  const reportsGolfCoursesNotRedeemed = useSelector(
    (store) => store.reportsGolfCoursesNotRedeemed
  );

  useEffect(() => {
    dispatch({ type: "FETCH_REPORTS_GOLF_COURSES_NOT_REDEEMED" });
  }, [dispatch]);

  const columns = [
    { field: "name", headerName: "Golf Course", flex: 1 },
    { field: "not_redeemed_count", headerName: "Total Not Redeemed", flex: 1 },
  ];

  const rows = reportsGolfCoursesNotRedeemed.map((report, index) => ({
    id: index,
    name: report.name,
    not_redeemed_count: report.not_redeemed_count,
  }));

  return (
    <Container maxWidth="md">
      <Typography variant="h4" color="secondary" gutterBottom align="center">
        Golf Course Not Redeemed Report
      </Typography>
      <Box sx={{ height: 400, width: "100%", mt: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={25}
          rowsPerPageOptions={[100, 50, 25]}
          autoHeight
          sx={{ backgroundColor: "white" }}
        />
      </Box>
    </Container>
  );
}

export default ReportsGolfCoursesNotRedeemed;
