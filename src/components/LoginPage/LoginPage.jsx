import React from "react";
import LoginForm from "../LoginForm/LoginForm";
import { useHistory } from "react-router-dom";
import { Button, Box, Container } from "@mui/material";

function LoginPage() {
  const history = useHistory();

  return (
    <Container maxWidth="xs">
      <LoginForm />
      <Box textAlign="center" mt={2}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            history.push("/registration");
          }}
        >
          Register
        </Button>
      </Box>
    </Container>
  );
}

export default LoginPage;
