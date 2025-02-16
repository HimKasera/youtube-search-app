import React from 'react';

const VideoList = ({ videos, onVideoSelect, addToPlaylist }) => {
  return (
    <div className="video-list">
      {videos.map((video) => (
        <div key={video.id.videoId} className="video-item" onClick={() => onVideoSelect(video)}>
          <img
            src={video.snippet.thumbnails.medium.url}
            alt={video.snippet.title}
          />
          <h3>{video.snippet.title}</h3>
          <button onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the parent click event
            addToPlaylist(video);
          }}>
            Add to Playlist
          </button>
        </div>
      ))}
    </div>
  );
};

export default VideoList;