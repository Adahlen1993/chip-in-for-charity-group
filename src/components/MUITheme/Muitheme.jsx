import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#33A749",
    },
    secondary: {
      main: "#073363",
    },
    custom: {
      third: "#E51B24",
    },
    text: {
      primary: "#073363", // Default text color
      secondary: "#666", // Secondary text color
    },
    background: {
      default: "#FFFFFF", // Light background for a clean look
      paper: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: "Trebuchet MS, Roboto, Arial, sans-serif",
  },
  customBackgroundImage: {
    url: "/golfballbackground.jpg", // Define your background image path here
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          height: "auto", // Allow height to be responsive
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          margin: "16px",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          position: "relative",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
        },
      },
    },
    // MuiCardMedia: {
    //   styleOverrides: {
    //     root: {
    //       width: '100%',
    //       height: '240px', // Increased height
    //       objectFit: 'cover',
    //       borderRadius: '4px',
    //     },
    //   },
    // },
  },
});

export default theme;
