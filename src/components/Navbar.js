import React from 'react';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import RadioIcon from '@mui/icons-material/Radio';

const StyledButton = styled(Button)(({ theme, active }) => ({
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  marginRight: theme.spacing(2),
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const Logo = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  color: theme.palette.primary.main,
  fontWeight: 'bold',
  fontSize: '1.5rem',
  cursor: 'pointer',
}));

function Navbar({ currentView, setCurrentView }) {
  return (
    <AppBar position="sticky" color="default" elevation={0}>
      <Toolbar>
        <Logo onClick={() => setCurrentView('home')}>
          Spotube
        </Logo>
        <Box>
          <StyledButton
            startIcon={<HomeIcon />}
            active={currentView === 'home'}
            onClick={() => setCurrentView('home')}
          >
            Home
          </StyledButton>
          <StyledButton
            startIcon={<SearchIcon />}
            active={currentView === 'search'}
            onClick={() => setCurrentView('search')}
          >
            Search
          </StyledButton>
          <StyledButton
            startIcon={<RadioIcon />}
            active={currentView === 'radio'}
            onClick={() => setCurrentView('radio')}
          >
            Radio
          </StyledButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
