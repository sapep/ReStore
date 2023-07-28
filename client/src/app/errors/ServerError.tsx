import { Divider, Paper, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { useLocation } from "react-router-dom";

function ServerError() {
  const { state } = useLocation();

  return (
    <Container component={Paper}>
      {state?.error && (
        <>
          <Typography variant="h3" gutterBottom color="secondary">
            {state.error.title}
          </Typography>
          <Divider />
          <Typography variant="body1">{state.error.detail || "Internal server error"}</Typography>
        </>
      )}
    </Container>
  );
}

export default ServerError;