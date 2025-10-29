import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, IconButton, Button, Tabs, Tab } from '@mui/material';
import { styled } from '@mui/material/styles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import SpotifyRadio from './SpotifyRadio';
import fallbackStations from '../data/fallbackRadioStations';

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

const categories = {
  // Indian Categories
  'Bollywood Hits': ['bollywood', 'hindi'],
  'Punjabi Radio': ['punjabi'],
  'Tamil Radio': ['tamil'],
  'Telugu Radio': ['telugu'],
  'Malayalam Radio': ['malayalam'],
  'Classical Indian': ['carnatic'],
  // Hollywood Categories
  'Top 40 Hits': ['top40', 'pop'],
  'Hip Hop & R&B': ['hiphop', 'rap', 'rnb'],
  'Rock Radio': ['rock', 'alternative'],
  'Electronic/Dance': ['electronic', 'dance', 'edm'],
  'Jazz & Blues': ['jazz', 'blues']
};

// List of Radio Browser API servers with fallback options
const servers = [
  // Primary servers
  'de1.api.radio-browser.info',
  'fr1.api.radio-browser.info',
  'at1.api.radio-browser.info',
  // Fallback to base domain which should resolve to an available server
  'all.api.radio-browser.info'
];

// Alternative base URLs to try if the primary servers fail
const alternativeBaseUrls = [
  'https://de1.api.radio-browser.info',
  'https://fr1.api.radio-browser.info',
  'https://at1.api.radio-browser.info',
  'https://nl1.api.radio-browser.info',
  'https://uk1.api.radio-browser.info',
  'https://all.api.radio-browser.info'
];



// Default radio station image to use when favicon is missing
const defaultRadioImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iIzFkYjk1NCIvPjxjaXJjbGUgY3g9IjEyOCIgY3k9IjEyOCIgcj0iNjQiIGZpbGw9IiMxMjFhMWQiLz48Y2lyY2xlIGN4PSIxMjgiIGN5PSIxMjgiIHI9IjIwIiBmaWxsPSIjMWRiOTU0Ii8+PHBhdGggZD0iTTEyOCw3MkExMCwxMCwwLDAsMSwxMzgsODJWMTc0QTEwLDEwLDAsMCwxLDEyOCwxODRBMTAsMTAsMCwwLDEsMTE4LDE3NFY4MkExMCwxMCwwLDAsMSwxMjgsNzJaIiBmaWxsPSIjMWRiOTU0Ii8+PHBhdGggZD0iTTE2MCw5NkExMCwxMCwwLDAsMSwxNzAsMTA2VjE1MEExMCwxMCwwLDAsMSwxNjAsMTYwQTEwLDEwLDAsMCwxLDE1MCwxNTBWMTA2QTEwLDEwLDAsMCwxLDE2MCw5NloiIGZpbGw9IiMxZGI5NTQiLz48cGF0aCBkPSJNOTYsOTZBMTAsMTAsMCwwLDEsMTA2LDEwNlYxNTBBMTAsMTAsMCwwLDEsOTYsMTYwQTEwLDEwLDAsMCwxLDg2LDE1MFYxMDZBMTAsMTAsMCwwLDEsOTYsOTZaIiBmaWxsPSIjMWRiOTU0Ii8+PC9zdmc+';

function Radio({ setCurrentTrack }) {
  const [categoryStations, setCategoryStations] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('radio');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getRandomServer = () => {
    return servers[Math.floor(Math.random() * servers.length)];
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Check if the user is online
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Add event listeners for online/offline status
  useEffect(() => {
    const handleOnline = () => {
      console.log('Network status: Online');
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.log('Network status: Offline');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch radio stations when component mounts or when online status changes
  useEffect(() => {
    if (!isOnline) {
      console.log('Device is offline, using fallback stations');
      // Use fallback stations immediately if offline
      const results = {};
      for (const [category, stations] of Object.entries(fallbackStations)) {
        if (stations && stations.length > 0) {
          results[category] = stations;
        }
      }
      setCategoryStations(results);
      setLoading(false);
    } else {
      fetchIndianRadioStations();
    }
  }, [isOnline]);

  // Helper function to check if a tag is an Indian music tag
  const isIndianMusicTag = (tag) => {
    return ['bollywood', 'hindi', 'punjabi', 'tamil', 'telugu', 'malayalam', 'carnatic'].includes(tag);
  };

  // Function to create request parameters based on tag
  const createRequestParams = (tag) => {
    return {
      limit: 15,
      hidebroken: true,
      tagList: tag,
      // Add countrycode filter for Indian music tags
      ...(isIndianMusicTag(tag) ? { countrycode: 'in' } : {})
    };
  };

  const fetchStationsForTag = async (tag, retryCount = 0, alternativeUrlIndex = 0) => {
    // Create a controller for request cancellation
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
    
    try {
      // Try with domain-based URL first
      if (alternativeUrlIndex === 0) {
        const server = getRandomServer();
        try {
          console.log(`Trying to fetch ${tag} stations from ${server}...`);
          const response = await axios.get(`https://${server}/json/stations/search`, {
            params: createRequestParams(tag),
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'Spotube/1.0',
              'Accept': 'application/json'
            },
            timeout: 8000, // Increased timeout
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          // Validate response data
          if (response.data && Array.isArray(response.data)) {
            console.log(`Successfully fetched ${response.data.length} stations for ${tag}`);
            return response.data;
          } else {
            console.log(`Invalid response data format for ${tag} from ${server}`);
            // Continue to alternative URLs
          }
        } catch (domainError) {
          clearTimeout(timeoutId);
          console.log(`Domain-based URL failed for ${server}: ${domainError.message}`);
          // If domain-based URL fails, fall through to alternative URLs
        }
      }
      
      // Try alternative direct URLs if available
      if (alternativeUrlIndex < alternativeBaseUrls.length) {
        const baseUrl = alternativeBaseUrls[alternativeUrlIndex];
        try {
          console.log(`Trying alternative URL ${baseUrl} for ${tag}...`);
          const response = await axios.get(`${baseUrl}/json/stations/search`, {
            params: createRequestParams(tag),
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'Spotube/1.0',
              'Accept': 'application/json'
            },
            timeout: 8000,
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          // Validate response data
          if (response.data && Array.isArray(response.data)) {
            console.log(`Successfully fetched ${response.data.length} stations for ${tag} from ${baseUrl}`);
            return response.data;
          } else {
            console.log(`Invalid response data format for ${tag} from ${baseUrl}`);
            // Try next alternative URL
            return fetchStationsForTag(tag, retryCount, alternativeUrlIndex + 1);
          }
        } catch (altError) {
          clearTimeout(timeoutId);
          console.log(`Alternative URL ${baseUrl} failed: ${altError.message}`);
          // Try next alternative URL
          return fetchStationsForTag(tag, retryCount, alternativeUrlIndex + 1);
        }
      }
      
      // If we've exhausted alternative URLs, retry with exponential backoff
      if (retryCount < 3) {
        const backoffTime = 1000 * Math.pow(2, retryCount); // Exponential backoff: 1s, 2s, 4s
        console.log(`All URLs failed for ${tag}, retrying in ${backoffTime/1000}s (attempt ${retryCount + 1}/3)`);
        await delay(backoffTime);
        return fetchStationsForTag(tag, retryCount + 1, 0);
      }
      
      console.error(`Error fetching stations for tag ${tag} after all attempts`);
      return [];
    } catch (error) {
      clearTimeout(timeoutId);
      // Check if this was an abort error (timeout)
      if (error.name === 'AbortError' || error.name === 'CanceledError') {
        console.error(`Request timeout for tag ${tag}`);
      } else {
        console.error(`Unexpected error fetching stations for tag ${tag}:`, error);
      }
      return [];
    }
  };

  // Fallback method using direct HTTP fetch when axios fails
  const fetchWithFallback = async (url, params) => {
    try {
      // Try to use fetch API as a last resort
      const queryParams = new URLSearchParams(params).toString();
      const response = await fetch(`${url}?${queryParams}`, {
        headers: {
          'User-Agent': 'Spotube/1.0',
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        timeout: 8000
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Fallback fetch failed:', error);
      // Try with multiple CORS proxies as a last resort
      const corsProxies = [
        'https://corsproxy.io/?',
        'https://cors-anywhere.herokuapp.com/',
        'https://api.allorigins.win/raw?url='
      ];
      
      for (const corsProxyUrl of corsProxies) {
        try {
          const queryParams = new URLSearchParams(params).toString();
          const encodedUrl = encodeURIComponent(`${url}?${queryParams}`);
          const proxyResponse = await fetch(`${corsProxyUrl}${encodedUrl}`, {
            headers: {
              'User-Agent': 'Spotube/1.0',
              'Content-Type': 'application/json',
              'Origin': window.location.origin
            },
            timeout: 8000
          });
          if (!proxyResponse.ok) {
            console.log(`Proxy ${corsProxyUrl} failed with status: ${proxyResponse.status}`);
            continue;
          }
          return await proxyResponse.json();
        } catch (proxyError) {
          console.log(`CORS proxy ${corsProxyUrl} failed:`, proxyError);
          // Continue to next proxy
        }
      }
      
      console.error('All CORS proxies failed');
      return [];
    }
  };

  const fetchIndianRadioStations = async () => {
    try {
      const results = {};
      let anySuccessfulFetch = false;
      let apiAttemptsMade = false;
      
      // Fetch one category at a time to avoid rate limiting
      for (const [category, tags] of Object.entries(categories)) {
        const categoryStations = [];
        for (const tag of tags) {
          try {
            apiAttemptsMade = true;
            let stations = await fetchStationsForTag(tag);
            
            // If all previous methods failed, try direct HTTP fetch as last resort
            if ((!stations || stations.length === 0) && !anySuccessfulFetch) {
              console.log(`Trying direct fetch fallback for tag ${tag}`);
              const params = {
                limit: 15,
                hidebroken: true,
                tagList: tag,
                ...(tag === 'bollywood' || tag === 'hindi' || tag === 'punjabi' || 
                   tag === 'tamil' || tag === 'telugu' || tag === 'malayalam' || 
                   tag === 'carnatic' ? { countrycode: 'in' } : {})
              };
              stations = await fetchWithFallback('https://de1.api.radio-browser.info/json/stations/search', params);
            }
            
            if (stations && stations.length > 0) {
              categoryStations.push(...stations);
              anySuccessfulFetch = true;
            }
            await delay(500); // Increased delay between requests to avoid rate limiting
          } catch (tagError) {
            console.error(`Error processing tag ${tag}:`, tagError);
            // Continue with next tag even if this one fails
          }
        }

        // Filter and deduplicate stations
        const uniqueStations = Array.from(
          new Map(
            categoryStations
              .filter(station => 
                station.url_resolved &&
                station.favicon &&
                station.name &&
                (station.lastcheckok === 1 || station.lastcheckok === undefined) // Allow fallback stations
              )
              .map(station => [station.url_resolved, station])
          ).values()
        );

        if (uniqueStations.length > 0) {
          results[category] = uniqueStations.slice(0, 10);
        }
      }

      // If no stations were fetched successfully from the API, use fallback stations
      if (apiAttemptsMade && !anySuccessfulFetch) {
        console.log('All API attempts failed, using fallback stations');
        for (const [category, stations] of Object.entries(fallbackStations)) {
          if (stations && stations.length > 0) {
            results[category] = stations;
          }
        }
      }

      setCategoryStations(results);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching radio stations:', error);
      
      // Last resort: use fallback stations if everything else failed
      try {
        const results = {};
        for (const [category, stations] of Object.entries(fallbackStations)) {
          if (stations && stations.length > 0) {
            results[category] = stations;
          }
        }
        
        if (Object.keys(results).length > 0) {
          console.log('Using offline fallback stations');
          setCategoryStations(results);
        }
      } catch (fallbackError) {
        console.error('Even fallback stations failed:', fallbackError);
      }
      
      setLoading(false);
    }
  };

  const [playbackError, setPlaybackError] = useState(null);

  const handlePlay = (station) => {
    try {
      // Reset any previous playback errors
      setPlaybackError(null);
      
      // Validate stream URL before attempting to play
      if (!station.url_resolved) {
        setPlaybackError(`Cannot play ${station.name}: Missing stream URL`);
        return;
      }
      
      setCurrentTrack({
        id: station.stationuuid || 'radio',
        title: station.name,
        thumbnail: station.favicon || defaultRadioImage,
        streamUrl: station.url_resolved,
        isRadio: true
      });
    } catch (error) {
      console.error('Error playing radio station:', error);
      setPlaybackError(`Error playing ${station.name}. Please try another station.`);
    }
  };

  const renderCategorySection = (category, stations) => (
    <Box key={category} sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, color: 'white' }}>
        {category}
      </Typography>
      {playbackError && (
        <Typography variant="body2" sx={{ color: 'error.main', mb: 2 }}>
          {playbackError}
          <Button 
            size="small" 
            sx={{ ml: 2 }} 
            onClick={() => setPlaybackError(null)}
          >
            Dismiss
          </Button>
        </Typography>
      )}
      <Grid container spacing={2}>
        {stations.map((station) => (
          <Grid item xs={12} sm={6} md={4} key={station.stationuuid || `station-${station.name}`}>
            <RadioCard>
              <CardMedia
                component="img"
                sx={{ width: 100, height: 100, objectFit: 'contain', padding: 1, backgroundColor: 'white' }}
                image={station.favicon || defaultRadioImage}
                alt={station.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultRadioImage;
                }}
              />
              <RadioContent>
                <Box>
                  <Typography variant="subtitle1" sx={{ color: 'white' }}>
                    {station.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {station.language || 'Unknown'} • {station.bitrate || '128'}kbps
                  </Typography>
                  {station.tags && (
                    <Typography variant="caption" color="text.secondary">
                      {station.tags.split(',').slice(0, 3).join(', ')}
                    </Typography>
                  )}
                </Box>
                <IconButton 
                  onClick={() => handlePlay(station)}
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

  const [error, setError] = useState(null);

  useEffect(() => {
    // Set a timeout to show an error message if loading takes too long
    const timeoutId = setTimeout(() => {
      if (loading && Object.keys(categoryStations).length === 0) {
        setError('Unable to connect to radio servers. Please check your internet connection and try again later.');
      }
    }, 15000); // Show error after 15 seconds of loading

    return () => clearTimeout(timeoutId);
  }, [loading, categoryStations]);

  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // Function to retry loading radio stations
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setRetryCount(prev => prev + 1);
    fetchIndianRadioStations();
  };

  // Auto-retry once if no stations were loaded
  useEffect(() => {
    if (!loading && Object.keys(categoryStations).length === 0 && retryCount === 0) {
      console.log('No stations loaded on first attempt, auto-retrying...');
      handleRetry();
    }
  }, [loading, categoryStations, retryCount]);

  if (loading && activeTab === 'radio') {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
          {retryCount > 0 ? `Retrying... (Attempt ${retryCount}/${maxRetries})` : 'Loading Radio Stations...'}
        </Typography>
        {error && (
          <Typography variant="body1" sx={{ color: 'error.main' }}>
            {error}
          </Typography>
        )}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '50px', height: '50px', border: '5px solid #1db954', borderRadius: '50%', borderTop: '5px solid transparent', animation: 'spin 1s linear infinite' }} />
        </Box>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </Box>
    );
  }

  // If no stations were loaded but we're not in loading state anymore
  if (Object.keys(categoryStations).length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
          Unable to load radio stations
        </Typography>
        <Typography variant="body1" sx={{ color: 'white', mb: 3 }}>
          We couldn't connect to the radio servers. This could be due to:
        </Typography>
        <Box component="ul" sx={{ color: 'white', mb: 3 }}>
          <li>Network connectivity issues</li>
          <li>Radio service being temporarily unavailable</li>
          <li>Firewall or security settings blocking the connection</li>
        </Box>
        <Typography variant="body1" sx={{ color: 'white', mb: 3 }}>
          Please try again later or check your internet connection.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleRetry}
            startIcon={<RefreshIcon />}
            disabled={retryCount >= maxRetries}
          >
            {retryCount >= maxRetries ? 'Max Retries Reached' : 'Retry Loading'}
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            '& .MuiTab-root': {
              color: 'white',
              '&.Mui-selected': {
                color: 'primary.main'
              }
            }
          }}
        >
          <Tab label="Traditional Radio" value="radio" />
          <Tab label="Spotify Radio" value="spotify" />
        </Tabs>
      </Box>

      {activeTab === 'radio' ? (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ color: 'white' }}>
              Indian Radio
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              backgroundColor: isOnline ? 'success.main' : 'warning.main',
              color: 'white',
              px: 2,
              py: 0.5,
              borderRadius: 1,
            }}>
              <Typography variant="body2">
                {isOnline ? 'Online' : 'Offline Mode'}
              </Typography>
              {!isOnline && (
                <Button 
                  size="small" 
                  variant="contained" 
                  color="primary" 
                  sx={{ ml: 1 }}
                  onClick={() => setIsOnline(navigator.onLine)}
                >
                  Check Again
                </Button>
              )}
            </Box>
          </Box>
          
          {!isOnline && (
            <Typography variant="body2" sx={{ mb: 3, color: 'warning.main' }}>
              You are currently offline. Showing locally stored radio stations. Some streams may not work without an internet connection.
            </Typography>
          )}
          
          {Object.entries(categoryStations)
            .filter(([category]) => 
              ['Bollywood Hits', 'Punjabi Radio', 'Tamil Radio', 'Telugu Radio', 
               'Malayalam Radio', 'Classical Indian'].includes(category))
            .filter(([_, stations]) => stations.length > 0)
            .map(([category, stations]) => renderCategorySection(category, stations))}
          
          <Typography variant="h4" sx={{ my: 4, color: 'white' }}>
            International Radio
          </Typography>
          {Object.entries(categoryStations)
            .filter(([category]) => 
              ['Top 40 Hits', 'Hip Hop & R&B', 'Rock Radio', 'Electronic/Dance', 
               'Jazz & Blues'].includes(category))
            .filter(([_, stations]) => stations.length > 0)
            .map(([category, stations]) => renderCategorySection(category, stations))}
        </>
      ) : (
        <SpotifyRadio setCurrentTrack={setCurrentTrack} />
      )}
    </Box>
  );
}

export default Radio;
