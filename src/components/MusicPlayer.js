import React, { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Slider, Typography, Link } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import RepeatIcon from '@mui/icons-material/Repeat';
import RepeatOneIcon from '@mui/icons-material/RepeatOne';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { styled } from '@mui/material/styles';

const PlayerContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderTop: `1px solid ${theme.palette.divider}`,
  zIndex: 1000,
}));

const PlayerControls = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
});

const VolumeControl = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  minWidth: '200px',
});

const TrackInfo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  flex: 1,
  marginLeft: '16px',
});

const ProgressContainer = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  padding: '0 16px',
});

const VisualizerContainer = styled(Box)({
  height: '30px',
  display: 'flex',
  alignItems: 'flex-end',
  gap: '2px',
  padding: '0 16px',
});

const VisualizerBar = styled(Box)(({ height }) => ({
  width: '3px',
  height: `${height}%`,
  backgroundColor: '#1db954',
  transition: 'height 0.1s ease',
}));

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

const showPreviewMessage = (message) => {
  // Implement the logic to display the preview message
  console.log(message);
};

function MusicPlayer({ track, onPrevious, onNext, hasPrevious, hasNext, onAddToPlaylist }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none');
  const [isFavorite, setIsFavorite] = useState(false);
  const [visualizerData, setVisualizerData] = useState(Array(20).fill(20));
  const audioRef = useRef(new Audio());
  const progressInterval = useRef(null);
  const [error, setError] = useState(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  const startProgressUpdate = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    progressInterval.current = setInterval(() => {
      if (!isDragging && audioRef.current) {
        setProgress(audioRef.current.currentTime);
      }
    }, 1000);
  };

  const stopProgressUpdate = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  const handlePlayPause = () => {
    if (!track.preview_url && !track.external_url) {
      setError('No preview available. Open in Spotify to play full track.');
      showPreviewMessage('No preview available. Open in Spotify to play full track.');
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.error('Error playing audio:', err);
        setError('Error playing track. Please try again.');
        showPreviewMessage('Error playing track. Please try again.');
      });
    }
  };

  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (track) {
      setIsPlaying(false);
      setProgress(0);
      setError(null);

      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
        setError(null);
      };

      const handleError = (e) => {
        console.error('Audio loading error:', e);
        setError('Error loading track. Please try again.');
        setIsPlaying(false);
      };

      if (track.preview_url) {
        audio.src = track.preview_url;
      } else if (track.external_url) {
        audio.src = track.external_url;
      }

      audio.volume = volume / 100;

      try {
        // Initialize audio context if not already initialized
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        const audioContext = audioContextRef.current;

        // Resume AudioContext if it's suspended (needed for some browsers)
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }

        // Create analyser node if it doesn't exist
        if (!analyserRef.current) {
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 64;
          analyserRef.current = analyser;
        }

        // Create and connect source node only if it hasn't been created
        if (!sourceRef.current) {
          sourceRef.current = audioContext.createMediaElementSource(audio);
          sourceRef.current.connect(analyserRef.current);
          analyserRef.current.connect(audioContext.destination);
        }

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

        const updateVisualizer = () => {
          if (analyserRef.current && isPlaying) {
            analyserRef.current.getByteFrequencyData(dataArray);
            const newVisualizerData = Array.from(dataArray.slice(0, 20))
              .map(value => Math.max(20, (value / 255) * 100));
            setVisualizerData(newVisualizerData);
          }
          animationFrameRef.current = requestAnimationFrame(updateVisualizer);
        };

        updateVisualizer();
      } catch (err) {
        console.error('Audio context error:', err);
        setError('Error initializing audio. Please try again.');
        setIsPlaying(false);
      }

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('error', handleError);

      const handlePlay = () => {
        setIsPlaying(true);
        startProgressUpdate();
      };

      const handlePause = () => {
        setIsPlaying(false);
        stopProgressUpdate();
      };
        stopProgressUpdate();
      };

      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);

      return () => {
        // Cancel animation frame
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        // Remove all event listeners
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);

        // Stop playback
        audio.pause();
        setIsPlaying(false);
        stopProgressUpdate();

        // Reset error state
        setError(null);
      };
    }
  }, [track, volume, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handleVolumeChange = (_, newValue) => {
    setVolume(newValue);
  };

  const handleRepeatClick = () => {
    setRepeatMode(current => {
      switch (current) {
        case 'none': return 'all';
        case 'all': return 'one';
        case 'one': return 'none';
        default: return 'none';
      }
    });
  };

  const handleShuffleClick = () => {
    setShuffleEnabled(prev => !prev);
  };

  const handleFavoriteClick = () => {
    setIsFavorite(prev => !prev);
    if (!isFavorite && onAddToPlaylist) {
      onAddToPlaylist(track, 'Favorites');
    }
  };

  return (
    <>
      <ProgressContainer>
        <Slider
          value={progress}
          max={duration}
          onChange={(_, value) => {
            setIsDragging(true);
            setProgress(value);
          }}
          onChangeCommitted={(_, value) => {
            setIsDragging(false);
            if (audioRef.current) {
              audioRef.current.currentTime = value;
            }
          }}
          sx={{
            height: 4,
            '& .MuiSlider-thumb': {
              width: 8,
              height: 8,
              transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
              '&:hover': {
                width: 12,
                height: 12,
              },
            },
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, mt: 1 }}>
          <Typography variant="caption">{formatTime(progress)}</Typography>
          <Typography variant="caption">{formatTime(duration)}</Typography>
        </Box>
      </ProgressContainer>

      <VisualizerContainer>
        {visualizerData.map((height, index) => (
          <VisualizerBar key={index} height={height} />
        ))}
      </VisualizerContainer>

      <PlayerContainer>
        <TrackInfo>
          {track.thumbnail && (
            <Box
              component="img"
              src={track.thumbnail}
              alt={track.title}
              sx={{ width: 60, height: 60, borderRadius: 1 }}
            />
          )}
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="subtitle1" noWrap>
              {track.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {track.artist}
            </Typography>
            {error && (
              <Typography variant="caption" color="error" noWrap>
                {error}
              </Typography>
            )}
          </Box>
          {(showPreviewMessage || track.external_url) && (
            <Link
              href={track.external_url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              {showPreviewMessage ? 'Open in Spotify' : ''}
              <OpenInNewIcon sx={{ fontSize: 20, ml: 1 }} />
            </Link>
          )}
        </TrackInfo>

        <PlayerControls>
          <IconButton 
            onClick={handleShuffleClick}
            color={shuffleEnabled ? 'primary' : 'default'}
          >
            <ShuffleIcon />
          </IconButton>
          
          <IconButton onClick={onPrevious} disabled={!hasPrevious}>
            <SkipPreviousIcon />
          </IconButton>
          
          <IconButton onClick={handlePlayPause}>
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
          
          <IconButton onClick={onNext} disabled={!hasNext}>
            <SkipNextIcon />
          </IconButton>
          
          <IconButton onClick={handleRepeatClick} color={repeatMode !== 'none' ? 'primary' : 'default'}>
            {repeatMode === 'one' ? <RepeatOneIcon /> : <RepeatIcon />}
          </IconButton>
        </PlayerControls>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={handleFavoriteClick}>
            {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
          </IconButton>

          <VolumeControl>
            <IconButton onClick={() => setVolume(prev => (prev === 0 ? 70 : 0))}>
              {volume === 0 ? <VolumeMuteIcon /> :
               volume < 50 ? <VolumeDownIcon /> : <VolumeUpIcon />}
            </IconButton>
            <Slider
              value={volume}
              onChange={handleVolumeChange}
              sx={{ width: 100 }}
            />
          </VolumeControl>
        </Box>
      </PlayerContainer>
    </>
  );
}

export default MusicPlayer;

// Example usage of showPreviewMessage
showPreviewMessage('Preview is not available.');
