import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import LogOutButton from "../LogOutButton/LogOutButton";
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Grid,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";

function UserPage() {
  const user = useSelector((store) => store.user);
  const punchCards = useSelector((store) => store.punchCards) || [];
  const dispatch = useDispatch();
  const history = useHistory();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: user.name,
    phone_number: user.phone_number,
    street: user.street,
    city: user.city,
    state: user.state,
    zip_code: user.zip_code,
    birthdate: user.birthdate,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    setUserInfo({
      name: user.name,
      phone_number: user.phone_number,
      street: user.street,
      city: user.city,
      state: user.state,
      zip_code: user.zip_code,
      birthdate: user.birthdate,
    });
  }, [user]);

  const [punchCardEditMode, setPunchCardEditMode] = useState(false);
  const [punchCardName, setPunchCardName] = useState("");
  const [editingPunchCardId, setEditingPunchCardId] = useState(null);

  const handlePunchCardEditClick = (cardId, cardName) => {
    setEditingPunchCardId(cardId);
    setPunchCardName(cardName);
    setPunchCardEditMode(true);
  };

  const handlePunchCardSaveClick = (cardId) => {
    dispatch({
      type: "UPDATE_PUNCH_CARD_NAME",
      payload: { id: cardId, name: punchCardName },
    });
    setPunchCardEditMode(false);
    setEditingPunchCardId(null);
  };

  const handlePunchCardCancelClick = () => {
    setPunchCardName("");
    setPunchCardEditMode(false);
    setEditingPunchCardId(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = () => {
    dispatch({ type: "UPDATE_USER_INFO", payload: userInfo });
    setEditMode(false);
  };

  const handleCancelClick = () => {
    setUserInfo({
      name: user.name,
      phone_number: user.phone_number,
      street: user.street,
      city: user.city,
      state: user.state,
      zip_code: user.zip_code,
      birthdate: user.birthdate,
    });
    setEditMode(false);
  };

  const handlePurchaseClick = () => {
    history.push("/cart");
  };

  return (
    <Container maxWidth="md" sx={{ padding: isMobile ? "16px" : "32px" }}>
      <Typography
        color="secondary"
        variant={isMobile ? "h5" : "h4"}
        gutterBottom
      >
        Welcome, {user.name}!
      </Typography>

      <Box
        sx={{
          backgroundColor: "white",
          padding: "16px",
          borderRadius: "8px",
          mb: 2,
        }}
      >
        {editMode ? (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                name="name"
                value={userInfo.name}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                name="phone_number"
                value={userInfo.phone_number}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Street"
                name="street"
                value={userInfo.street}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="City"
                name="city"
                value={userInfo.city}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="State"
                name="state"
                value={userInfo.state}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Zip Code"
                name="zip_code"
                value={userInfo.zip_code}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Birthdate"
                name="birthdate"
                type="date"
                value={userInfo.birthdate}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                color="primary"
                fullWidth={isMobile}
                onClick={handleSaveClick}
              >
                Save
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth={isMobile}
                onClick={handleCancelClick}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        ) : (
          <Box>
            <Typography color="secondary" variant="body1" gutterBottom>
              Name: {user.name}
            </Typography>
            <Typography color="secondary" variant="body1" gutterBottom>
              Phone Number: {user.phone_number}
            </Typography>
            <Typography color="secondary" variant="body1" gutterBottom>
              Street: {user.street}
            </Typography>
            <Typography color="secondary" variant="body1" gutterBottom>
              City: {user.city}
            </Typography>
            <Typography color="secondary" variant="body1" gutterBottom>
              State: {user.state}
            </Typography>
            <Typography color="secondary" variant="body1" gutterBottom>
              Zip Code: {user.zip_code}
            </Typography>
            <Typography color="secondary" variant="body1" gutterBottom>
              Birthdate: {new Date(user.birthdate).toLocaleDateString()}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth={isMobile}
              onClick={handleEditClick}
            >
              Edit
            </Button>
          </Box>
        )}
      </Box>

      <Typography
        color="secondary"
        variant={isMobile ? "h6" : "h5"}
        gutterBottom
        sx={{ marginTop: "16px" }}
      >
        Your Punch Cards
      </Typography>
      <List sx={{ backgroundColor: "white", borderRadius: "8px" }}>
        {punchCards.length > 0 ? (
          punchCards.map((card) => (
            <ListItem key={card.id} divider>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={8}>
                  {punchCardEditMode && card.id === editingPunchCardId ? (
                    <TextField
                      value={punchCardName}
                      onChange={(e) => setPunchCardName(e.target.value)}
                      fullWidth
                    />
                  ) : (
                    <ListItemText
                      primary={card.name}
                      sx={{ color: "#073363" }}
                    />
                  )}
                </Grid>
                <Grid
                  item
                  xs={4}
                  container
                  justifyContent="flex-end"
                  spacing={1}
                >
                  {punchCardEditMode && card.id === editingPunchCardId ? (
                    <>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handlePunchCardSaveClick(card.id)}
                        >
                          Save
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={handlePunchCardCancelClick}
                        >
                          Cancel
                        </Button>
                      </Grid>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        handlePunchCardEditClick(card.id, card.name)
                      }
                    >
                      Edit
                    </Button>
                  )}
                </Grid>
              </Grid>
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="No punch cards available" />
          </ListItem>
        )}
      </List>

      <Grid container justifyContent="center" mt={2}>
        <Button
          variant="contained"
          color="primary"
          fullWidth={isMobile}
          onClick={handlePurchaseClick}
        >
          Purchase More Punch Cards
        </Button>
      </Grid>

      <Grid container justifyContent="center" mt={2}>
        <Button color="secondary" fullWidth={isMobile}>
          <LogOutButton />
        </Button>
      </Grid>
    </Container>
  );
}

export default UserPage;
