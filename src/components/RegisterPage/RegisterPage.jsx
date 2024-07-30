import React from "react";
import { useHistory } from "react-router-dom";
import RegisterForm from "../RegisterForm/RegisterForm";
import { Button, Box, Container } from "@mui/material";

function RegisterPage() {
  const history = useHistory();

  return (
    <Container maxWidth="xs">
      <RegisterForm />
      <Box textAlign="center" mt={2}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            history.push("/login");
          }}
        >
          Login
        </Button>
      </Box>
    </Container>
  );
}

export default RegisterPage;
