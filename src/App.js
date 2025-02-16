import React, { useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import VideoPlayer from './components/VideoPlayer';
import VideoList from './components/VideoList';
import PlaylistManager from './components/PlaylistManager';
import './styles.css';

// Access the API key from the environment variable
const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

function App() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const searchVideos = async (query) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${API_KEY}`
      );
      if (response.data.items.length === 0) {
        alert('No videos found. Try another search.');
      } else {
        setVideos(response.data.items);
        setSelectedVideo(response.data.items[0]);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      alert('An error occurred while fetching videos. Please try again later.');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const addToPlaylist = (video) => {
    if (!playlist.some((item) => item.id.videoId === video.id.videoId)) {
      setPlaylist([...playlist, video]);
    }
  };

  const removeFromPlaylist = (id) => {
    setPlaylist(playlist.filter((video) => video.id.videoId !== id));
  };

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
      <div className="content">
        <VideoPlayer video={selectedVideo} onNext={playNextVideo} />
        <div className="sidebar">
          <VideoList
            videos={videos}
            onVideoSelect={setSelectedVideo} // Pass setSelectedVideo as a callback
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