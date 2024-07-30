import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const errors = useSelector((store) => store.errors);
  const [samePassword, setSamePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  const registerUser = (event) => {
    event.preventDefault();

    dispatch({
      type: 'SET_USER',
      payload: {
        email: email,
        password: password,
      },
    });
    history.push('/demographics');
  };

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleComparePassword = (event) => {
    setSamePassword(event.target.value);
  };

  const handleCheckboxChange = () => {
    setShowPassword(!showPassword);
  };

  const fillForm = () => {
    setEmail('rickie@email.com');
    setPassword('steve');
    setSamePassword('steve');
  };

  const isPasswordMismatch = password !== samePassword;

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
        <Typography component='h1' variant='h5' gutterBottom onClick={fillForm}>
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
          id='email'
          label='Email'
          name='email'
          autoComplete='email'
          autoFocus
          value={email}
          onChange={handleChangeEmail}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          name='password'
          label='Password'
          type={showPassword ? 'text' : 'password'}
          id='password'
          autoComplete='current-password'
          value={password}
          onChange={handleChangePassword}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          name='samePassword'
          label='Confirm Password'
          type={showPassword ? 'text' : 'password'}
          id='samePassword'
          autoComplete='new-password'
          value={samePassword}
          onChange={handleComparePassword}
          error={isPasswordMismatch}
          helperText={isPasswordMismatch ? 'Passwords do not match' : ''}
        />
        <FormControlLabel
          control={
            <Checkbox checked={showPassword} onChange={handleCheckboxChange} color='primary' />
          }
          label='Show Password'
        />
        <Button
          type='submit'
          fullWidth
          variant='contained'
          color='primary'
          sx={{ mt: 3, mb: 2 }}
          disabled={isPasswordMismatch || password === '' || email === ''}
        >
          Register
        </Button>
      </Box>
    </Container>
  );
}

export default RegisterForm;
