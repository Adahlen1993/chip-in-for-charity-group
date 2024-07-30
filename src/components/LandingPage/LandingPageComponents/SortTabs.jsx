import * as React from "react";
import { Tabs, Tab, useMediaQuery, useTheme } from "@mui/material";

function SortTabs({ value, onChange }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Tabs
      value={value}
      onChange={onChange}
      aria-label="sort tabs"
      variant={isMobile ? "scrollable" : "standard"}
      scrollButtons={isMobile ? "auto" : "off"}
      indicatorColor="primary"
      textColor="primary"
    >
      <Tab label="Sort by Name" value="name" />
      <Tab label="Sort by Location" value="location" />
      <Tab label="Map View" value="map" />
    </Tabs>
  );
}

export default SortTabs;
