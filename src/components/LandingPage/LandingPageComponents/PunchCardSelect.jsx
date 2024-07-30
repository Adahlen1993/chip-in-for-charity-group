import * as React from "react";
import { useEffect } from "react";
import { FormControl, FormLabel, Select, MenuItem } from "@mui/material";

function PunchCardSelect({ punchCardId, onChange, punchCards }) {
  const selectedPunchCard = punchCards.find(
    (punchCard) => punchCard.id === punchCardId
  );

  return (
    <FormControl fullWidth sx={{ mb: 1 }}>
      <FormLabel id="punch-card-select-label">Your Punch Cards</FormLabel>
      <Select
        labelId="punch-card-select-label"
        value={punchCardId || ""}
        onChange={onChange}
        displayEmpty
        renderValue={
          punchCardId ? undefined : () => <em>Select a Punch Card</em>
        }
      >
        {punchCards.map((punchCard) => (
          <MenuItem key={punchCard.id} value={punchCard.id}>
            {punchCard.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default PunchCardSelect;
