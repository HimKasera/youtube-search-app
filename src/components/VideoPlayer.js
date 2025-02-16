import React from 'react';

const VideoPlayer = ({ video, onNext }) => {
  if (!video) return <div className="video-player">No video selected</div>;

  const videoId = video.id.videoId;

  return (
    <div className="video-player">
      <iframe
        title="YouTube Video Player"
        src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`}
        allowFullScreen
      ></iframe>
      <button onClick={onNext} className="next-button">
        Next Video
      </button>
    </div>
  );
};

export default VideoPlayer;