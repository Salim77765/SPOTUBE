import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, IconButton, TextField, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SearchIcon from '@mui/icons-material/Search';
import youtubeService from '../services/youtube';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    cursor: 'pointer',
  },
  backgroundColor: theme.palette.background.paper,
}));

const MusicCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const MusicContent = styled(CardContent)({
  flex: '1 0 auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const SearchBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
}));

function YouTubeMusic({ setCurrentTrack }) {
  const [popularTracks, setPopularTracks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPopularTracks();
  }, []);

  const fetchPopularTracks = async () => {
    try {
      const tracks = await youtubeService.getPopularMusic(20);
      setPopularTracks(tracks);
      setError(null);
    } catch (err) {
      console.error('Error fetching popular tracks:', err);
      setError('Unable to load popular tracks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const results = await youtubeService.search(searchQuery);
      setSearchResults(results);
      setError(null);
    } catch (err) {
      console.error('Error searching tracks:', err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (track) => {
    setCurrentTrack({
      ...track,
      isYouTube: true
    });
  };

  const renderTrackSection = (title, tracks) => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, color: 'white' }}>
        {title}
      </Typography>
      <Grid container spacing={2}>
        {tracks.map((track) => (
          <Grid item xs={12} sm={6} md={4} key={track.id}>
            <MusicCard>
              <CardMedia
                component="img"
                sx={{ width: 100, height: 100, objectFit: 'cover' }}
                image={track.thumbnail}
                alt={track.title}
              />
              <MusicContent>
                <Box>
                  <Typography variant="subtitle1" sx={{ color: 'white' }}>
                    {track.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {track.artist}
                  </Typography>
                </Box>
                <IconButton 
                  onClick={() => handlePlay(track)}
                  sx={{ 
                    backgroundColor: 'primary.main',
                    '&:hover': { backgroundColor: 'primary.dark' }
                  }}
                >
                  <PlayArrowIcon />
                </IconButton>
              </MusicContent>
            </MusicCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  if (loading && !searchResults.length && !popularTracks.length) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ color: 'white' }}>Loading YouTube Music...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
        <Button 
          variant="contained" 
          onClick={fetchPopularTracks}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <SearchBox>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search YouTube Music..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          sx={{ 
            input: { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
              '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
              '&.Mui-focused fieldset': { borderColor: 'primary.main' }
            }
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          startIcon={<SearchIcon />}
        >
          Search
        </Button>
      </SearchBox>

      {searchResults.length > 0 && renderTrackSection('Search Results', searchResults)}
      {popularTracks.length > 0 && renderTrackSection('Popular on YouTube Music', popularTracks)}
    </Box>
  );
}

export default YouTubeMusic;