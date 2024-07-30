import React, { useState } from "react";
import { useSelector } from "react-redux";
import { MenuItem, Select, FormControl, InputLabel, Box } from "@mui/material";
import ReportsGolfCoursePunchCardHigh from "./ReportsGolfCoursesHigh";
import ReportsDiscounts from "./ReportsDiscounts";
import ReportsRedeemedLog from "./ReportsRedeemedLog";
import ReportsUserZip from "./ReportsUserZip";
import ReportsPaymentsLog from "./ReportsPaymentsLog";

function ReportsMain() {
  const [selectedReport, setSelectedReport] = useState("golfCourseHigh");

  const handleReportChange = (event) => {
    setSelectedReport(event.target.value);
  };

  const renderReport = () => {
    switch (selectedReport) {
      case "golfCourseHigh":
        return <ReportsGolfCoursePunchCardHigh />;
      case "discounts":
        return <ReportsDiscounts />;
      case "redeemedLog":
        return <ReportsRedeemedLog />;
      case "userZip":
        return <ReportsUserZip />;
      case "paymentLog":
        return <ReportsPaymentsLog />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: "100%", typography: "body1", p: 2 }}>
      <FormControl fullWidth>
        <InputLabel>Report</InputLabel>
        <Select
          value={selectedReport}
          onChange={handleReportChange}
          label="Report"
          sx={{ backgroundColor: "white" }} // Set background color to white
        >
          <MenuItem value="golfCourseHigh">
            Total Redeemed at each Golf Course
          </MenuItem>
          <MenuItem value="discounts">Most Used Discounts</MenuItem>
          <MenuItem value="userZip">Purchases By Zip-Code</MenuItem>
          <MenuItem value="redeemedLog">Redeemed Log</MenuItem>
          <MenuItem value="paymentLog">Purchase History</MenuItem>
        </Select>
      </FormControl>
      <Box sx={{ mt: 4 }}>{renderReport()}</Box>
    </Box>
  );
}

export default ReportsMain;
