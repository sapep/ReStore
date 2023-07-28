import { Button, Divider, Paper, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { Link } from "react-router-dom";

function NotFound () {
  return (
    <Container component={Paper} sx={{ heigth: 400 }}>
      <Typography variant="h3" gutterBottom>Oops – we could not find what you were looking for!</Typography>
      <Divider />
      <Button fullWidth component={Link} to="/catalog">Go back to shop</Button>
    </Container>
  );
}

export default NotFound;