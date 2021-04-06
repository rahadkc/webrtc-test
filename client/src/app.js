import React from 'react';
import Notifications from './components/notifications';
import Options from './components/options';
import VideoPlayer from './components/videoPlayer';

const App = () => {
  return (
    <div>
      <VideoPlayer />
      <Options>
        <Notifications />
      </Options>
    </div>
  );
}

export default App