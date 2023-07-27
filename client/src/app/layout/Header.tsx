import { DarkMode, LightMode } from "@mui/icons-material";
import { AppBar, Switch, Toolbar, Typography } from "@mui/material";

interface Props {
  darkMode: boolean;
  toggleTheme: () => void;
}

function Header({ darkMode, toggleTheme }: Props) {
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6">RE-STORE</Typography>

        <LightMode sx={{ ml: 4 }}/>
        <Switch
          checked={darkMode}
          onChange={toggleTheme}
          color="secondary"
        />
        <DarkMode />
      </Toolbar>
    </AppBar>
  );
}

export default Header;