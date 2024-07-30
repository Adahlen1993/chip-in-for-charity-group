import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Tabs, Tab, Box } from "@mui/material";
import AdminUser from "./AdminUser/AdminUser";
import AdminGolfCourses from "./AdminGolfCourses/AdminGolfCourses";
import AdminDiscounts from "./AdminDiscounts/AdminDiscounts";
import AdminRestriction from "./AdminRestrictions/AdminRestrictions";
import ReportsMain from "./Reports/ReportsMain";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function Admin() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1", mt: 3 }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          backgroundColor: "white",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="admin tabs"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab label="Users" />
          <Tab label="Golf Courses" />
          <Tab label="Discounts" />
          <Tab label="Restrictions" />
          <Tab label="Reports" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <AdminUser />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AdminGolfCourses />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <AdminDiscounts />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <AdminRestriction />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <ReportsMain />
      </TabPanel>
    </Box>
  );
}

export default Admin;
