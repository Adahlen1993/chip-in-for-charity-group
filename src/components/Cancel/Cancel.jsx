import React from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const Cancel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container
      maxWidth="md"
      sx={{
        padding: isMobile ? "16px" : "32px",
        textAlign: "center",
        borderRadius: "8px",
        backgroundColor: "white",
      }}
    >
      <Typography
        color="secondary"
        variant={isMobile ? "h5" : "h4"}
        gutterBottom
      >
        Payment Cancelled
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Your payment was cancelled. Please try again.
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          href="/#/cart"
          fullWidth={isMobile}
          sx={{ textTransform: "none" }}
        >
          Return to Cart
        </Button>
      </Box>
    </Container>
  );
};

export default Cancel;
