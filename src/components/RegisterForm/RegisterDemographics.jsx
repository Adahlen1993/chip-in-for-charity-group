import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';

function RegisterDemo() {
  const [name, setName] = useState('');
  const [phone_number, setPhone_Number] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip_code, setZipCode] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const errors = useSelector((store) => store.errors);
  const userDemo = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const history = useHistory();

  const fillFormWithDemoData = () => {
    setName('Rickie Fowler');
    setPhone_Number('701-434-5678');
    setStreet('121 Ridge Way');
    setCity('Lefor');
    setState('ND');
    setZipCode('58636');
    setBirthdate('1973-04-03'); // Required format for the date input
  };

  const registerUser = (event) => {
    event.preventDefault();

    dispatch({
      type: 'REGISTER',
      payload: {
        email: userDemo.email,
        password: userDemo.password,
        name: name,
        phone_number: phone_number,
        street: street,
        city: city,
        state: state,
        zip_code: zip_code,
        birthdate: birthdate,
      },
    });
    history.push('/home');
  };

  return (
    <Container maxWidth='xs'>
      <Box
        component='form'
        onSubmit={registerUser}
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Typography
          component='h1'
          variant='h5'
          gutterBottom
          onClick={fillFormWithDemoData}
          style={{ cursor: 'pointer' }}
        >
          Register User
        </Typography>
        {errors.registrationMessage && (
          <Alert severity='error' role='alert' sx={{ mb: 2 }}>
            {errors.registrationMessage}
          </Alert>
        )}
        <TextField
          margin='normal'
          required
          fullWidth
          id='name'
          label='Full Name'
          name='name'
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          id='phone_number'
          label='Phone'
          name='phone_number'
          value={phone_number}
          onChange={(event) => setPhone_Number(event.target.value)}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          id='street'
          label='Street'
          name='street'
          value={street}
          onChange={(event) => setStreet(event.target.value)}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          id='city'
          label='City'
          name='city'
          value={city}
          onChange={(event) => setCity(event.target.value)}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          id='state'
          label='State'
          name='state'
          value={state}
          onChange={(event) => setState(event.target.value)}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          id='zip_code'
          label='Zip Code'
          name='zip_code'
          value={zip_code}
          onChange={(event) => setZipCode(event.target.value)}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          id='birthdate'
          label='Birthday'
          type='date'
          InputLabelProps={{
            shrink: true,
          }}
          name='birthdate'
          value={birthdate}
          onChange={(event) => setBirthdate(event.target.value)}
        />
        <Button type='submit' fullWidth variant='contained' color='primary' sx={{ mt: 3, mb: 2 }}>
          Register
        </Button>
      </Box>
    </Container>
  );
}

export default RegisterDemo;
