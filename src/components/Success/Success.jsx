import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Grid,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const Success = () => {
  const location = useLocation();
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const history = useHistory();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [paymentVerified, setPaymentVerified] = useState(false);

  const handleGoToHome = () => {
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get("session_id");

    if (sessionId) {
      const userId = user.id;

      fetch("/api/stripe/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId, userId }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setPaymentVerified(true);
            dispatch({ type: "FETCH_PUNCH_CARDS" }); // Fetch punch cards after payment verification
          } else {
            console.error("Payment verification failed:", data.error);
          }
        })
        .catch((error) => console.error("Error verifying payment:", error));
    }

    history.push("/landing"); // Navigate to the home page
  };

  return (
    <Container
      maxWidth="md"
      sx={{ padding: isMobile ? "16px" : "32px", textAlign: "center" }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography
            variant={isMobile ? "h6" : "h4"}
            color="secondary"
            gutterBottom
          >
            Thank you for your contribution!
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGoToHome}
            fullWidth={isMobile}
          >
            Find Golf Courses
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              backgroundColor: "white",
              padding: "16px",
              borderRadius: "8px",
            }}
          >
            <Typography
              variant="body2"
              color="secondary"
              sx={{ marginTop: "16px" }}
            >
              The Chip In for Charity program supports the services provided by
              Catholic Charities North Dakota. Last year, over 2,900 people were
              impacted by the services provided by the agency.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              backgroundColor: "white",
              padding: "16px",
              borderRadius: "8px",
            }}
          >
            <List sx={{ marginTop: "16px" }}>
              {[
                "Programs include:",
                "Pregnancy, Parenting, and Adoption Services (PPAS)",
                "Adults Adopting Special Kids (AASK) for Youth in Foster Care ND Post Adopt Network",
                "Guardianship Services for Individuals with Intellectual Disabilities",
                "Guardianship Services for the Vulnerable",
                "Counseling Services for Individuals, Couples, and Families",
                "Natural Disaster Response for North Dakota Residents",
              ].map((text, index) => (
                <ListItem key={index} sx={{ padding: "4px 0" }}>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "14px" }}
                        color="secondary"
                      >
                        {text}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Success;
