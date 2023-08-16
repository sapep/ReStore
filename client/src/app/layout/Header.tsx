import { DarkMode, LightMode, ShoppingCart } from "@mui/icons-material";
import { AppBar, Badge, Box, IconButton, List, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";

const midLinks = [
  { title: 'catalog', path: '/catalog' },
  { title: 'about', path: '/about' },
  { title: 'contact', path: '/contact' }
];

const rightLinks = [
  { title: 'login', path: '/login' },
  { title: 'register', path: '/register' }
];

const navStyles = {
  color: "inherit",
  textDecoration: "none",
  typography: "h6",
  "&:hover": {
    color: "grey.500"
  },
  "&.active": {
    color: "text.secondary"
  }
};

interface Props {
  darkMode: boolean;
  toggleTheme: () => void;
}

function Header({ darkMode, toggleTheme }: Props) {
  const { basket } = useAppSelector(state => state.basket);

  const itemCount = basket?.items.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <Box display="flex" alignItems="center">
          <Typography
            variant="h6"
            component={NavLink}
            to={"/"}
            sx={navStyles}
          >
            RE-STORE
          </Typography >

          <LightMode sx={{ ml: 4 }} />
          <Switch
            checked={darkMode}
            onChange={toggleTheme}
            color="secondary"
          />
          <DarkMode />
        </Box>

        <List sx={{ display: "flex" }}>
          {midLinks.map(({ title, path }) => {
            return (
              <ListItem
                key={path}
                component={NavLink}
                to={path}
                sx={navStyles}
              >
                {title.toUpperCase()}
              </ListItem>
            )
          })}
        </List>

        <Box display="flex" alignItems="center">
          <IconButton
            component={NavLink}
            to="basket"
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
          >
            <Badge badgeContent={itemCount} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>

          <List sx={{ display: "flex" }}>
            {rightLinks.map(({ title, path }) => {
              return (
                <ListItem
                  key={path}
                  component={NavLink}
                  to={path}
                  sx={navStyles}
                >
                  {title.toUpperCase()}
                </ListItem>
              )
            })}
          </List>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;