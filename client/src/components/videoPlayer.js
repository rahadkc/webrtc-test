import React, { useContext } from 'react';
import { SocketContext } from '../socketContext';

const VideoPlayer = () => {
  const { myVideo, callerVideo, name, call, stream, callAccepted, callEnded } = useContext(SocketContext)

  return (
    <div className="videos" style={{ display: 'grid', gridTemplateColumns: 'repeat( autoFit, 1fr )', gap: '40px', maxWidth: '700px', margin:'auto' }}>
     
      {/*  user/caller video */}
      {callAccepted && !callEnded && <div className="videoWrapper">
        <h4>{call.name || 'Caller Name'}</h4>
        <video playsInline ref={callerVideo} autoPlay  className="videoPlayer" />
      </div>}

       {/*  our own video */}
       {stream && <div className="videoWrapper">
        <h4>{name || 'My Name'}</h4>
        <video muted playsInline ref={myVideo} autoPlay className="videoPlayer" />
      </div>}
    </div>
  );
}

export default VideoPlayer