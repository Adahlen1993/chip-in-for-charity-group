import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

function ReportsGolfCoursePunchCardLow() {
  const dispatch = useDispatch();
  const reportsPunchCardGolfCoursesLow = useSelector(
    (store) => store.reportsPunchCardGolfCoursesLow
  );

  useEffect(() => {
    dispatch({ type: "FETCH_REPORTS_PUNCH_CARD_GOLF_COURSES_LOW" });
  }, [dispatch]);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" color="secondary" gutterBottom align="center">
        Golf Course Punch Card Report (Least Used Courses)
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Golf Course</TableCell>
              <TableCell>Total Redeemed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportsPunchCardGolfCoursesLow.map((report, i) => (
              <TableRow key={i}>
                <TableCell>{report.name}</TableCell>
                <TableCell>{report.redeemed_count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default ReportsGolfCoursePunchCardLow;
