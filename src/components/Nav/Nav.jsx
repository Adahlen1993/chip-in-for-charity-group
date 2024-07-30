import React, { useState } from "react";
import { Link } from "react-router-dom";
import LogOutButton from "../LogOutButton/LogOutButton";
import { useSelector } from "react-redux";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

function Nav() {
  const user = useSelector((store) => store.user);
  const [isOpen, setIsOpen] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsOpen(open);
  };

  const list = () => (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
      style={{ width: isSmallScreen ? "80%" : 250, maxWidth: 300 }}
    >
      <List>
        {!user.id && (
          <ListItem button component={Link} to="/login">
            <ListItemText primary="Login / Register" />
          </ListItem>
        )}

        {user.id && (
          <>
            <ListItem button component={Link} to="/home">
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={Link} to="/user">
              <ListItemText primary="User Page" />
            </ListItem>
            <ListItem button component={Link} to="/cart">
              <ListItemText primary="Cart" />
            </ListItem>
            <ListItem sx={{ "&:hover": { backgroundColor: "#f1f1f1" } }}>
              <LogOutButton />
            </ListItem>
          </>
        )}

        {user.admin === true && (
          <>
            <ListItem button component={Link} to="/admin">
              <ListItemText primary="Admin" />
            </ListItem>
          </>
        )}

        <ListItem button component={Link} to="/about">
          <ListItemText primary="About" />
        </ListItem>
        <ListItem>
          <a
            href="https://app.theauxilia.com/pay/CCNDdonation"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "inherit", width: "100%" }}
          >
            <ListItemText primary="Donate" />
          </a>
        </ListItem>
      </List>
    </div>
  );

  return (
    <div>
      <AppBar position="static" sx={{ backgroundColor: "#33A749" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon sx={{ color: "#ffffff" }} />
          </IconButton>
          <Typography
            variant="h6"
            style={{
              flexGrow: 1,
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Link
              to="/home"
              style={{
                color: "inherit",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src="./chipinforcharitylogonew.png"
                alt="Chip In for Charity Logo"
                style={{ width: "40px", height: "auto", marginRight: "8px" }}
              />
              Chip In for Charity
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            height: "auto",
            maxHeight: "100vh",
            width: isSmallScreen ? "80%" : 250,
            maxWidth: 300,
          },
        }}
      >
        {list()}
      </Drawer>
    </div>
  );
}

export default Nav;
