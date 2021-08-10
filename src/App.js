import React, { useState , useRef } from 'react';
//Import Styles
import "./styles/app.scss"
//Import Components
import PlayerComponent from './components/PlayerComponent';
import SongComponent from './components/SongComponent'
import LibraryComponent from './components/LibraryComponent';
import NavComponent from './components/NavComponent';
//Import Util
import data from "./data";


function App() {
  //Ref
  const audioRef = useRef(null);
  //State
  const [songs, setSongs] = useState(data());
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0,
  });
  const [libraryStatus, setLibraryStatus] = useState(false);
  //Event Handler
  const timeUpdateHandler = (e) =>{
    const current = e.target.currentTime;
    const duration = e.target.duration;
    //Calculate Percentage
    const roundedCurrent = Math.round(current);
    const roundedDuration = Math.round(duration);
    const animation = Math.round(roundedCurrent / roundedDuration * 100);
    setSongInfo({...songInfo, currentTime: current, duration, animationPercentage: animation,});
};
const songEndHandler = async () => {
  let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
  await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
  if(isPlaying) audioRef.current.play()
}

  return (
    <div className={`App ${libraryStatus ? "library-active" : ""}`}>
      <NavComponent libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus} />
      <SongComponent currentSong={currentSong}/>
      <PlayerComponent 
        currentSong={currentSong}
        isPlaying={isPlaying} 
        setIsPlaying={setIsPlaying}
        audioRef={audioRef}
        setSongInfo={setSongInfo} 
        songInfo={songInfo}
        songs={songs}
        setCurrentSong={setCurrentSong}
        setSongs={setSongs}
      />
      <LibraryComponent
        audioRef={audioRef} 
        songs={songs} 
        setCurrentSong={setCurrentSong}
        isPlaying={isPlaying}
        setSongs={setSongs}
        libraryStatus={libraryStatus}
      />
      <audio 
        onLoadedMetadata={timeUpdateHandler} 
        onTimeUpdate={timeUpdateHandler} 
        ref={audioRef} 
        src={ currentSong.audio }
        onEnded={songEndHandler}
      >
      </audio>
    </div>
  );
}

export default App;
