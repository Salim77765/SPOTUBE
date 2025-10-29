import axios from 'axios';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '../config';

class SpotifyService {
  constructor() {
    this.accessToken = null;
    this.tokenExpiry = null;
    this.baseURL = 'https://api.spotify.com/v1';
  }

  async initialize() {
    if (!this.accessToken || this.isTokenExpired()) {
      await this.getAccessToken();
    }
  }

  isTokenExpired() {
    return this.tokenExpiry && Date.now() > this.tokenExpiry;
  }

  async getAccessToken() {
    try {
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');

      const auth = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);
      
      const response = await axios.post('https://accounts.spotify.com/api/token', 
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${auth}`
          }
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
    } catch (error) {
      console.error('Error getting Spotify access token:', error);
      throw error;
    }
  }

  async search(query, type = 'track', limit = 20) {
    await this.initialize();
    try {
      const response = await axios.get(`${this.baseURL}/search`, {
        params: {
          q: query,
          type,
          limit
        },
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching Spotify:', error);
      throw error;
    }
  }

  async getRecommendations(seed_genres = 'pop', limit = 20) {
    await this.initialize();
    try {
      // Get available genres first
      const genresResponse = await axios.get(`${this.baseURL}/recommendations/available-genre-seeds`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      // Verify the genre is available
      const availableGenres = genresResponse.data.genres;
      const validGenre = availableGenres.includes(seed_genres) ? seed_genres : availableGenres[0];

      const response = await axios.get(`${this.baseURL}/recommendations`, {
        params: {
          seed_genres: validGenre,
          limit,
          min_popularity: 50  // Add some parameters to get better recommendations
        },
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw error;
    }
  }

  async getNewReleases(limit = 20) {
    await this.initialize();
    try {
      const response = await axios.get(`${this.baseURL}/browse/new-releases`, {
        params: { 
          limit,
          country: 'US'  // Add country parameter for better results
        },
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting new releases:', error);
      throw error;
    }
  }

  async getTrack(trackId) {
    await this.initialize();
    try {
      const response = await axios.get(`${this.baseURL}/tracks/${trackId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting track:', error);
      throw error;
    }
  }

  async getArtistTopTracks(artistId, market = 'US') {
    await this.initialize();
    try {
      const response = await axios.get(`${this.baseURL}/artists/${artistId}/top-tracks`, {
        params: { market },
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting artist top tracks:', error);
      throw error;
    }
  }
}

export default new SpotifyService();
