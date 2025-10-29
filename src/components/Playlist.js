import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Dialog, DialogTitle, DialogContent, TextField, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const PlaylistContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  height: '100%',
  overflow: 'auto',
}));

const PlaylistItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

function Playlist({ currentTrack, onTrackSelect }) {
  const [playlists, setPlaylists] = useState(() => {
    const saved = localStorage.getItem('playlists');
    return saved ? JSON.parse(saved) : {
      'Favorites': [],
      'Recently Played': []
    };
  });
  const [activePlaylist, setActivePlaylist] = useState('Favorites');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  useEffect(() => {
    localStorage.setItem('playlists', JSON.stringify(playlists));
  }, [playlists]);

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      setPlaylists(prev => ({
        ...prev,
        [newPlaylistName]: []
      }));
      setNewPlaylistName('');
      setIsCreateDialogOpen(false);
    }
  };

  const handleAddToPlaylist = (track, playlistName) => {
    if (!playlists[playlistName].some(t => t.id === track.id)) {
      setPlaylists(prev => ({
        ...prev,
        [playlistName]: [...prev[playlistName], track]
      }));
    }
  };

  const handleRemoveFromPlaylist = (trackId, playlistName) => {
    setPlaylists(prev => ({
      ...prev,
      [playlistName]: prev[playlistName].filter(t => t.id !== trackId)
    }));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(playlists[activePlaylist]);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPlaylists(prev => ({
      ...prev,
      [activePlaylist]: items
    }));
  };

  return (
    <PlaylistContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Playlists</Typography>
        <IconButton onClick={() => setIsCreateDialogOpen(true)}>
          <AddIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', mb: 2 }}>
        {Object.keys(playlists).map(name => (
          <Button
            key={name}
            variant={activePlaylist === name ? 'contained' : 'outlined'}
            onClick={() => setActivePlaylist(name)}
            sx={{ mr: 1 }}
          >
            {name}
          </Button>
        ))}
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="playlist">
          {(provided) => (
            <List {...provided.droppableProps} ref={provided.innerRef}>
              {playlists[activePlaylist].map((track, index) => (
                <Draggable key={track.id} draggableId={track.id} index={index}>
                  {(provided) => (
                    <PlaylistItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <DragHandleIcon sx={{ mr: 2 }} />
                      <ListItemText
                        primary={track.title}
                        secondary={track.artist || 'Unknown Artist'}
                      />
                      <ListItemSecondaryAction>
                        <IconButton onClick={() => onTrackSelect(track)}>
                          <PlayArrowIcon />
                        </IconButton>
                        <IconButton onClick={() => handleRemoveFromPlaylist(track.id, activePlaylist)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </PlaylistItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>

      <Dialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)}>
        <DialogTitle>Create New Playlist</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Playlist Name"
            fullWidth
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
          />
          <Button onClick={handleCreatePlaylist} variant="contained" sx={{ mt: 2 }}>
            Create
          </Button>
        </DialogContent>
      </Dialog>
    </PlaylistContainer>
  );
}

export default Playlist;
