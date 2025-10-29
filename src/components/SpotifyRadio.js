import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, IconButton, Button, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SearchIcon from '@mui/icons-material/Search';
import spotifyService from '../services/spotify';

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

const RadioCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const RadioContent = styled(CardContent)({
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

const categories = {
  'Top Charts': ['pop', 'top'],
  'Hip Hop': ['hip-hop', 'rap'],
  'Rock': ['rock', 'alternative'],
  'Electronic': ['electronic', 'dance'],
  'Jazz & Blues': ['jazz', 'blues'],
  'Classical': ['classical'],
  'Indie': ['indie', 'alternative'],
  'Metal': ['metal', 'hard-rock'],
  'Soul & R&B': ['soul', 'r-n-b'],
  'Folk & Acoustic': ['folk', 'acoustic']
};

function SpotifyRadio({ setCurrentTrack }) {
  const [categoryTracks, setCategoryTracks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetchSpotifyTracks();
  }, []);

  const fetchSpotifyTracks = async () => {
    try {
      const results = {};
      for (const [category, genres] of Object.entries(categories)) {
        try {
          const recommendations = await spotifyService.getRecommendations(genres[0], 10);
          if (recommendations.tracks && recommendations.tracks.length > 0) {
            results[category] = recommendations.tracks;
          }
        } catch (categoryError) {
          console.error(`Error fetching ${category}:`, categoryError);
        }
      }
      setCategoryTracks(results);
    } catch (error) {
      console.error('Error fetching Spotify tracks:', error);
      setError('Unable to load Spotify tracks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const results = await spotifyService.search(searchQuery);
      setSearchResults(results.tracks.items);
    } catch (error) {
      console.error('Error searching tracks:', error);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (track) => {
    setCurrentTrack({
      id: track.id,
      title: track.name,
      artist: track.artists[0].name,
      thumbnail: track.album?.images[0]?.url,
      preview_url: track.preview_url,
      external_url: track.external_urls?.spotify,
      uri: track.uri,
      isSpotify: true
    });
  };

  const renderTrackSection = (title, tracks) => (
    <Box key={title} sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, color: 'white' }}>
        {title}
      </Typography>
      <Grid container spacing={2}>
        {tracks.map((track) => (
          <Grid item xs={12} sm={6} md={4} key={track.id}>
            <RadioCard>
              <CardMedia
                component="img"
                sx={{ width: 100, height: 100, objectFit: 'cover' }}
                image={track.album?.images[0]?.url}
                alt={track.name}
              />
              <RadioContent>
                <Box>
                  <Typography variant="subtitle1" sx={{ color: 'white' }}>
                    {track.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {track.artists[0].name}
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
              </RadioContent>
            </RadioCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ color: 'white' }}>Loading Spotify Radio...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
        <Button 
          variant="contained" 
          onClick={fetchSpotifyTracks}
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
          placeholder="Search for tracks..."
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

      {Object.entries(categoryTracks)
        .filter(([_, tracks]) => tracks.length > 0)
        .map(([category, tracks]) => renderTrackSection(category, tracks))}
    </Box>
  );
}

export default SpotifyRadio;