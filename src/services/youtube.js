import axios from 'axios';

const API_KEY = 'AIzaSyBvAWiw4B7PRG38ZamcEmTUkaLJQForYO4';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

const youtubeService = {
  search: async (query, maxResults = 10) => {
    try {
      const response = await axios.get(`${BASE_URL}/search`, {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          videoCategoryId: '10', // Music category
          maxResults,
          key: API_KEY
        }
      });

      return response.data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        artist: item.snippet.channelTitle,
        streamUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        isYouTube: true
      }));
    } catch (error) {
      console.error('Error searching YouTube:', error);
      throw error;
    }
  },

  getPopularMusic: async (maxResults = 10) => {
    try {
      const response = await axios.get(`${BASE_URL}/videos`, {
        params: {
          part: 'snippet',
          chart: 'mostPopular',
          videoCategoryId: '10', // Music category
          maxResults,
          key: API_KEY
        }
      });

      return response.data.items.map(item => ({
        id: item.id,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        artist: item.snippet.channelTitle,
        streamUrl: `https://www.youtube.com/watch?v=${item.id}`,
        isYouTube: true
      }));
    } catch (error) {
      console.error('Error fetching popular music:', error);
      throw error;
    }
  },

  getVideoDetails: async (videoId) => {
    try {
      const response = await axios.get(`${BASE_URL}/videos`, {
        params: {
          part: 'snippet,contentDetails',
          id: videoId,
          key: API_KEY
        }
      });

      const video = response.data.items[0];
      return {
        id: video.id,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.high.url,
        artist: video.snippet.channelTitle,
        duration: video.contentDetails.duration,
        streamUrl: `https://www.youtube.com/watch?v=${video.id}`,
        isYouTube: true
      };
    } catch (error) {
      console.error('Error fetching video details:', error);
      throw error;
    }
  }
};

export default youtubeService;