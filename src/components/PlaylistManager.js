import React from 'react';

const PlaylistManager = ({ playlist, onRemove, onVideoSelect }) => {
  return (
    <div className="playlist-manager">
      <h2>Playlist</h2>
      {playlist.length > 0 ? (
        playlist.map((video) => (
          <div key={video.id.videoId} className="playlist-item" onClick={() => onVideoSelect(video)}>
            <img
              src={video.snippet.thumbnails.default.url}
              alt={video.snippet.title}
            />
            <h3>{video.snippet.title}</h3>
            <button onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the parent click event
              onRemove(video.id.videoId);
            }}>
              Remove
            </button>
          </div>
        ))
      ) : (
        <p>No videos in playlist</p>
      )}
    </div>
  );
};

export default PlaylistManager;