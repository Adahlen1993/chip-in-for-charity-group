import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Container,
  Typography,
  Button,
  Grid,
  TextField,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

// Load Stripe with your publishable key
const stripePromise = loadStripe(
  'pk_test_51Pb8DT2KFjqbWdCIpzDnutXroncX8MJboi04U3ioTbXHqkCdsJ7zOCeepufyEniQzUEyhjQ0ypkn93UqfFEjwyJy00QvfleUC5'
);

const Cart = () => {
  const [quantity, setQuantity] = useState(1);
  const [subtotal, setSubtotal] = useState(40); // Initial subtotal assuming 1 card costs $40
  const [userId, setUserId] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Fetch the current user's ID from the server or local storage
    const fetchUserId = async () => {
      try {
        const response = await fetch('/api/user');
        const userData = await response.json();
        setUserId(userData.id);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserId();
    window.scrollTo(0, 0);
  }, []);

  // Update subtotal whenever quantity changes
  useEffect(() => {
    const newSubtotal = quantity * 40; // $40 per punch card
    setSubtotal(newSubtotal);
  }, [quantity]);

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleClick = async (event) => {
    event.preventDefault();
    console.log('Clicked Checkout button'); // Check if handleClick is triggered

    const stripe = await stripePromise;

    if (!quantity || quantity < 1) {
      console.error('Invalid quantity:', quantity);
      return;
    }

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity, userId }), // Send quantity and userId
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const session = await response.json();
      console.log('Session:', session);

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  return (
    <Container maxWidth='md' sx={{ padding: isMobile ? '16px' : '32px', textAlign: 'center' }}>
      <Typography color='secondary' variant={isMobile ? 'h5' : 'h4'} gutterBottom>
        Purchase your Punch Cards
      </Typography>

      <Grid container spacing={2} alignItems='center' justifyContent='center'>
        <Grid item xs={12} sm={6} md={4}>
          <IconButton aria-label='decrement' onClick={handleDecrement} sx={{ color: '#073363' }}>
            <RemoveIcon />
          </IconButton>
          <TextField
            type='number'
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            inputProps={{ min: 1 }}
            InputLabelProps={{
              style: { color: '#073363' },
            }}
            sx={{ mx: 2, width: '100px', backgroundColor: 'white' }}
          />
          <IconButton aria-label='increment' onClick={handleIncrement} sx={{ color: '#073363' }}>
            <AddIcon />
          </IconButton>
        </Grid>
        <Grid item xs={12}>
          <Typography color='secondary' variant='body1'>
            Subtotal: ${subtotal}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button variant='contained' color='primary' onClick={handleClick} fullWidth={isMobile}>
            Checkout
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              backgroundColor: 'white',
              padding: '16px',
              borderRadius: '8px',
            }}
          >
            <Typography color='secondary' variant={isMobile ? 'h6' : 'h5'} gutterBottom>
              Golf at a discounted rate at 88 courses in ND and MN!
            </Typography>
            <Typography variant='body2' color='secondary' align='left'>
              Catholic Charities North Dakota is proud to partner with Chip In for Charity to offer
              discount golf passes for charitable causes. A Chip In for Charity pass gives the
              cardholder a free or discounted round of golf at 88 courses in North Dakota and
              western Minnesota. Some of your favorite golf courses have joined with us to provide
              you a free or discounted round of golf with the proceeds going to support the
              thousands of North Dakotans that we serve through our programs.
              <br />
              <br />
              <strong>Chip In for Charity</strong> cards cannot be used with any other coupons or
              promotions and are non-transferable.
              <br />
              <br />
              We ask all golfers to be courteous and abide by restrictions and course rules. You
              should always call ahead for availability and tee times.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;
