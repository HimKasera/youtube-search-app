import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import VideoPlayer from './components/VideoPlayer';
import VideoList from './components/VideoList';
import PlaylistManager from './components/PlaylistManager';
import './styles.css';

// API Key stored in environment variables for security
const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

function App() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Load playlist from localStorage on mount
  useEffect(() => {
    const savedPlaylist = JSON.parse(localStorage.getItem('playlist')) || [];
    setPlaylist(savedPlaylist);
  }, []);

  // Save playlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('playlist', JSON.stringify(playlist));
  }, [playlist]);

  // Function to fetch videos from YouTube API
  const searchVideos = async (query) => {
    if (!query.trim()) {
      setErrorMessage('Please enter a search term.');
      return;
    }

    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${API_KEY}`
      );

      if (response.data.items.length === 0) {
        setErrorMessage('No videos found. Try another search.');
      } else {
        setVideos(response.data.items);
        setSelectedVideo(response.data.items[0]);
        setErrorMessage(''); // Clear any previous error message
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      setErrorMessage('An error occurred while fetching videos. Please try again later.');
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Add video to playlist (avoids duplicates)
  const addToPlaylist = (video) => {
    if (!playlist.some((item) => item.id.videoId === video.id.videoId)) {
      setPlaylist([...playlist, video]);
    }
  };

  // Remove video from playlist
  const removeFromPlaylist = (id) => {
    setPlaylist(playlist.filter((video) => video.id.videoId !== id));
  };

  // Play the next video from the search results
  const playNextVideo = () => {
    const currentIndex = videos.findIndex((v) => v.id.videoId === selectedVideo?.id.videoId);
    if (currentIndex !== -1 && currentIndex < videos.length - 1) {
      setSelectedVideo(videos[currentIndex + 1]);
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <SearchBar onSearch={searchVideos} />
      
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="content">
        <VideoPlayer video={selectedVideo} onNext={playNextVideo} />
        <div className="sidebar">
          <VideoList
            videos={videos}
            onVideoSelect={setSelectedVideo}
            addToPlaylist={addToPlaylist}
          />
          <PlaylistManager
            playlist={playlist}
            onRemove={removeFromPlaylist}
            onVideoSelect={setSelectedVideo}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
