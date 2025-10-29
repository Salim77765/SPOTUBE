import React, { useState } from 'react';
import { Box, Container, Grid, Paper } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Search from './components/Search';
import Radio from './components/Radio';
import MusicPlayer from './components/MusicPlayer';
import Playlist from './components/Playlist';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1db954',
    },
    background: {
      default: '#121212',
      paper: '#181818',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

function App() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);

  const handleTrackSelect = (track, tracks = []) => {
    setCurrentTrack(track);
    if (tracks.length > 0) {
      setQueue(tracks);
      setQueueIndex(tracks.findIndex(t => t.id === track.id));
    }
  };

  const handlePrevious = () => {
    if (queueIndex > 0) {
      setQueueIndex(queueIndex - 1);
      setCurrentTrack(queue[queueIndex - 1]);
    }
  };

  const handleNext = () => {
    if (queueIndex < queue.length - 1) {
      setQueueIndex(queueIndex + 1);
      setCurrentTrack(queue[queueIndex + 1]);
    }
  };

  const handleAddToPlaylist = (track, playlistName) => {
    // This function will be passed down to MusicPlayer
    // and implemented in the Playlist component
  };

  const renderView = () => {
    switch (currentView) {
      case 'search':
        return <Search setCurrentTrack={handleTrackSelect} />;
      case 'radio':
        return <Radio setCurrentTrack={handleTrackSelect} />;
      default:
        return <Home setCurrentTrack={handleTrackSelect} />;
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}>
        <Navbar currentView={currentView} setCurrentView={setCurrentView} />
        
        <Container maxWidth="xl" sx={{ flex: 1, mt: 2, mb: 10 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={9}>
              {renderView()}
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper sx={{ height: '100%', bgcolor: 'background.paper' }}>
                <Playlist
                  currentTrack={currentTrack}
                  onTrackSelect={handleTrackSelect}
                />
              </Paper>
            </Grid>
          </Grid>
        </Container>

        {currentTrack && (
          <MusicPlayer
            track={currentTrack}
            onPrevious={handlePrevious}
            onNext={handleNext}
            hasPrevious={queueIndex > 0}
            hasNext={queueIndex < queue.length - 1}
            onAddToPlaylist={handleAddToPlaylist}
          />
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
