import React, { useState, useEffect } from 'react';
import { Grid, Typography, Card, CardContent, CardMedia, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import spotifyService from '../services/spotify';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    transform: 'scale(1.05)',
    cursor: 'pointer',
    backgroundColor: theme.palette.action.hover,
  },
}));

function Home({ setCurrentTrack }) {
  const [newReleases, setNewReleases] = useState([]);
  const [popTracks, setPopTracks] = useState([]);
  const [rockTracks, setRockTracks] = useState([]);
  const [hiphopTracks, setHiphopTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const [newReleasesData, popData, rockData, hiphopData] = await Promise.all([
          spotifyService.getNewReleases(20),
          spotifyService.getRecommendations('pop', 20),
          spotifyService.getRecommendations('rock', 20),
          spotifyService.getRecommendations('hip-hop', 20)
        ]);

        setNewReleases(newReleasesData.albums.items);
        setPopTracks(popData.tracks);
        setRockTracks(rockData.tracks);
        setHiphopTracks(hiphopData.tracks);
      } catch (err) {
        console.error('Error fetching music:', err);
        setError('Error loading music. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMusic();
  }, []);

  const handlePlay = (track, allTracks) => {
    const formattedTrack = {
      id: track.id,
      title: track.name,
      artist: track.artists[0].name,
      thumbnail: track.album?.images[0]?.url || track.images?.[0]?.url,
      preview_url: track.preview_url,
      external_url: track.external_urls?.spotify,
      uri: track.uri,
      isSpotify: true
    };

    const formattedTracks = allTracks.map(t => ({
      id: t.id,
      title: t.name,
      artist: t.artists[0].name,
      thumbnail: t.album?.images[0]?.url || t.images?.[0]?.url,
      preview_url: t.preview_url,
      external_url: t.external_urls?.spotify,
      uri: t.uri,
      isSpotify: true
    }));

    setCurrentTrack(formattedTrack, formattedTracks);
  };

  const renderSection = (title, items) => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.id}>
            <StyledCard onClick={() => handlePlay(item, items)}>
              <CardMedia
                component="img"
                height="160"
                image={item.album?.images[0]?.url || item.images?.[0]?.url}
                alt={item.name}
              />
              <CardContent>
                <Typography variant="subtitle1" noWrap>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {item.artists ? item.artists[0].name : ''}
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {renderSection('New Releases', newReleases)}
      {renderSection('Popular Hits', popTracks)}
      {renderSection('Rock Essentials', rockTracks)}
      {renderSection('Hip-Hop Favorites', hiphopTracks)}
    </Box>
  );
}

export default Home;
