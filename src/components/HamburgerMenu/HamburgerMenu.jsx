import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useHistory } from "react-router-dom";

function HamburgerMenu() {
  const [open, setOpen] = React.useState(false);
  const history = useHistory(); // Use this for v5.x

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleNavigation = (path) => {
    history.push(path);
    setOpen(false);
  };

  return (
    <div>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={handleDrawerToggle}
        sx={{ position: "absolute", top: 16, left: 16 }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={open}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: 300,
            height: "auto", // Set height to auto to avoid full-screen height
            maxHeight: "70vh", // Adjust maxHeight to control drawer height
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <List>
          <ListItem button onClick={() => handleNavigation("/home")}>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation("/about")}>
            <ListItemText primary="About" />
          </ListItem>
          {/* Add more navigation items here */}
        </List>
      </Drawer>
    </div>
  );
}

export default HamburgerMenu;
