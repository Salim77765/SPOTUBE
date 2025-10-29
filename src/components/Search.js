import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, List, ListItem, ListItemText, ListItemAvatar, Avatar, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { YOUTUBE_API_KEY } from '../config';

const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

const SearchContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

const SearchForm = styled('form')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  position: 'relative',
}));

const SuggestionsContainer = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  zIndex: 1000,
  marginTop: '4px',
  maxHeight: '300px',
  overflowY: 'auto',
  backgroundColor: theme.palette.background.paper,
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    cursor: 'pointer',
  },
}));

function Search({ setCurrentTrack }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounced function for fetching suggestions
  const debouncedFetchSuggestions = debounce(async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
        params: {
          part: 'snippet',
          maxResults: 5,
          q: query + ' song',
          type: 'video',
          videoCategoryId: '10',
          key: API_KEY
        }
      });
      setSuggestions(response.data.items);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      if (error.response && error.response.status === 403) {
        console.error('Access forbidden: Check your API key permissions and quota.');
      }
    }
  }, 300);

  useEffect(() => {
    debouncedFetchSuggestions(searchQuery);
    return () => debouncedFetchSuggestions.cancel();
  }, [searchQuery]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    try {
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
        params: {
          part: 'snippet',
          maxResults: 20,
          q: searchQuery + ' song',
          type: 'video',
          videoCategoryId: '10',
          key: API_KEY
        }
      });
      setSearchResults(response.data.items);
    } catch (error) {
      console.error('Error searching videos:', error);
      if (error.response && error.response.status === 403) {
        console.error('Access forbidden: Check your API key permissions and quota.');
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.snippet.title);
    setShowSuggestions(false);
    handlePlay(suggestion);
  };

  const handlePlay = (video) => {
    setCurrentTrack({
      id: video.id.videoId,
      title: video.snippet.title,
      thumbnail: video.snippet.thumbnails.medium.url
    });
  };

  return (
    <SearchContainer>
      <SearchForm onSubmit={handleSearch}>
        <TextField
          fullWidth
          variant="outlined"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search for songs..."
          InputProps={{
            sx: { backgroundColor: 'background.paper' }
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<SearchIcon />}
        >
          Search
        </Button>

        {showSuggestions && suggestions.length > 0 && (
          <SuggestionsContainer>
            <List>
              {suggestions.map((suggestion) => (
                <ListItem
                  key={suggestion.id.videoId}
                  onClick={() => handleSuggestionClick(suggestion)}
                  sx={{ cursor: 'pointer' }}
                >
                  <ListItemAvatar>
                    <Avatar
                      variant="square"
                      src={suggestion.snippet.thumbnails.default.url}
                      alt={suggestion.snippet.title}
                    />
                  </ListItemAvatar>
                  <ListItemText primary={suggestion.snippet.title} />
                </ListItem>
              ))}
            </List>
          </SuggestionsContainer>
        )}
      </SearchForm>

      <List>
        {searchResults.map((video) => (
          <StyledListItem key={video.id.videoId} onClick={() => handlePlay(video)}>
            <ListItemAvatar>
              <Avatar
                variant="square"
                src={video.snippet.thumbnails.default.url}
                alt={video.snippet.title}
                sx={{ width: 80, height: 60, marginRight: 2 }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={video.snippet.title}
              secondary={video.snippet.channelTitle}
              primaryTypographyProps={{
                sx: { color: 'text.primary' }
              }}
              secondaryTypographyProps={{
                sx: { color: 'text.secondary' }
              }}
            />
          </StyledListItem>
        ))}
      </List>
    </SearchContainer>
  );
}

export default Search;
