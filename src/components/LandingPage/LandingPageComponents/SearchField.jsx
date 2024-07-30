import * as React from "react";
import { TextField } from "@mui/material";

function SearchField({ searchQuery, onChange }) {
  return (
    <TextField
      fullWidth
      label="Search Courses"
      value={searchQuery}
      onChange={onChange}
      variant="outlined"
      margin="normal"
      sx={{ mb: 1 }}
    />
  );
}

export default SearchField;
