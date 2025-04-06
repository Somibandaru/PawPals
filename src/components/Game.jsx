// import React, { useState, useEffect, useRef } from 'react';
// import confetti from 'canvas-confetti';

// import Level1 from './Level1';
// import Level2 from './Level2';
// import Level3 from './Level3';
// import Level4 from './Level4';
// import Level5 from './Level5';
// import Level6 from './Level6';
// import Level7 from './Level7';
// import Level8 from './Level8';
// import Level9 from './Level9';
// import Level10 from './Level10';
// import Level11 from './Level11';
// import Level12 from './Level12';
// import Level13 from './Level13';
// import Level14 from './Level14';
// import Level15 from './Level15';
// import Level16 from './Level16';
// import Level17 from './Level17';
// import Level18 from './Level18';
// import '../App.css';
// import InstructionsPopup from './InstructionsPopup'; 
// import audio from '../assets/images/audio.png'; 
// import gob from '../assets/images/goback.webp';
// import last from '../assets/images/last.gif';
// import inst from '../assets/inst.mp3';
// import instructions from '../assets/instructions.mp3';


// const sessionLevels = {
//   session1: [Level1, Level2, Level3, Level4, Level5, Level6],
//   session2: [Level7, Level8, Level9, Level10, Level11, Level12],
//   session3: [Level13, Level14, Level15, Level16, Level17, Level18],
// };

// const Game = () => {
//   const [currentLevel, setCurrentLevel] = useState(-1); // -1 indicates the start page
//   const [startTime, setStartTime] = useState(0);
//   const [endTime, setEndTime] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [selectedSession, setSelectedSession] = useState(null);
//   const [levels, setLevels] = useState([]);
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [showInstructions, setShowInstructions] = useState(false); // State to control showing InstructionsPopup
//   const audioRef = useRef(null);
//   const throwConfetti = () => {
//     confetti({
//       particleCount: 100,
//       spread: 70,
//       origin: { y: 0.6 },
//     });
//   };


//   useEffect(() => {
//     if (startTime !== 0 && currentLevel >= levels.length) {
//       setEndTime(Date.now()); // Record end time when all levels are completed
//     }
//   }, [currentLevel, startTime, levels.length]);

//   useEffect(() => {
//     if (currentLevel === -1) {
//       localStorage.removeItem('totalTrialCount'); // Reset trial count at the beginning of a new session
//     }
//   }, [currentLevel]);

//   useEffect(() => {
//     const sendGameData = async () => {
//       try {
//         const totalTimeInSeconds = Math.floor((endTime - startTime) / 1000);
//         const totalTrialCount = localStorage.getItem('totalTrialCount') || 0;
//         const gameId = "105";
  
//         const gameData = {
//           gameId,
//           tries: totalTrialCount,
//           timer: totalTimeInSeconds,
//           status: true,
//         };
  
//         console.log('Sending game data:', gameData);
  
//         const response = await fetch('https://jwlgamesbackend.vercel.app/api/caretaker/sendgamedata', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(gameData),
//         });
  
//         if (response.ok) {
//           console.log('Game data saved successfully');
//         } else {
//           console.error('Failed to save game data', response.statusText);
//         }
//       } catch (error) {
//         console.error('Error:', error);
//       }
//     };
  
//     // Call sendGameData only once when game ends
//     if (currentLevel >= levels.length && startTime !== 0 && endTime !== 0) {
//       sendGameData();
//     }
//   }, [currentLevel, startTime, endTime, levels.length]);
  
//   const nextLevel = () => {
//     setCurrentLevel(prevLevel => Math.min(prevLevel + 1, levels.length));
//   };

//   const prevLevel = () => {
//     setCurrentLevel(prevLevel => Math.max(prevLevel - 1, 0));
//   };

//   const replayGame = () => {
//     setCurrentLevel(-1);
//     setStartTime(0);
//     setEndTime(0);
//     setSelectedSession(null);
//     setShowInstructions(false);
//   };

//   const renderLevel = () => {
//     if (currentLevel === -1) {
//       return (
//         <div className="start-page">
//           <div className="goback">
//             <img
//               src={gob}
//               alt="goback"
//               onClick={()=>{window.location.href = "https://joywithlearning.com/games"}}
//               style={{ width: '50px', height: '50px', cursor: 'pointer' }}
//             />
//           </div>
//           <h3 className='heading'>Animal Matching Game</h3>
//           <button className="button-74" onClick={() => handleSessionSelect('session1')}>
//             Session 1
//           </button>
//           <button className="button-74" onClick={() => handleSessionSelect('session2')}>
//             Session 2
//           </button>
//           <button className="button-74" onClick={() => handleSessionSelect('session3')}>
//             Session 3
//           </button>
//         </div>
//       );
//     } else if (currentLevel < levels.length) {
//       const LevelComponent = levels[currentLevel];
//       return <LevelComponent onNext={nextLevel} onPrev={prevLevel} onLevelComplete={handleLevelComplete} updateTrialCount={updateTrialCount} throwConfetti={throwConfetti} />;
//     } else {
//       const totalTimeInSeconds = Math.floor((endTime - startTime) / 1000);
//       const totalTrialCount = localStorage.getItem('totalTrialCount') || 0;
//       const gameId = "105";

//       return (
//         <div className="end-page">
//           <h3 className='heading' style={{ fontSize: '50px' }}>Good Job!</h3>
//           <img src={last} style={{ width: '200px', height: 'auto' }} alt="Congratulations GIF" />
//           <p style={{ fontSize: '40px', fontWeight: 'bold' }}>Total Time: {formatTime(totalTimeInSeconds)}</p>
//           <p style={{ fontSize: '40px', fontWeight: 'bold' }}>Total Trials: {totalTrialCount}</p>

//           <button className="button-74" onClick={replayGame}>
//             Replay
//           </button>
//           <div className="goback">
//             <img
//               src={gob}
//               alt="goback"
//               onClick={()=>{window.location.href = "https://joywithlearning.com/games"}}
//               style={{ width: '50px', height: '50px', cursor: 'pointer' }}
//             />
//           </div>
//         </div>
//       );
//     }
//   };

//   const handleLevelComplete = () => {
//     // No need to check currentLevel === totalLevels - 1, since we increment past the last level
//   };

//   const toggleAudio = () => {
//     if (isPlaying) {
//       audioRef.current.pause();
//     } else {
//       audioRef.current.play();
//     }
//     setIsPlaying(!isPlaying);
//   };

//   const handleSessionSelect = (session) => {
//     setSelectedSession(session);
//     playInstructionsAudio(); // Play instructions audio when session is selected
//     setShowInstructions(true);
//   };

//   const playInstructionsAudio = () => {
//     const audioInstructions = new Audio(instructions);
//     audioInstructions.play();
//   };

//   const handleCloseInstructions = () => {
//     setLevels(sessionLevels[selectedSession]);
//     setCurrentLevel(0);
//     setStartTime(Date.now()); // Start the timer
//     setShowInstructions(false);
//   };

//   const updateTrialCount = (levelTrialCount) => {
//     const totalTrialCount = parseInt(localStorage.getItem('totalTrialCount') || 0, 10);
//     localStorage.setItem('totalTrialCount', totalTrialCount + levelTrialCount);
//   };

//   return (
//     <div className="app-container">
//       <div className="audio-player">
//         <audio ref={audioRef} src={inst} />
//         <img
//           src={audio}
//           alt="Play"
//           className="play-icon"
//           onClick={toggleAudio}
//           style={{ width: '50px', height: '50px', cursor: 'pointer' }}
//         />
//       </div>

//       {currentLevel >= 0 && currentLevel < levels.length && (
//         <div className="button-container">
//           <button className="button-74" onClick={prevLevel} disabled={currentLevel <= 0}>
//             Previous
//           </button>
//           <button className="button-74" onClick={nextLevel} disabled={currentLevel === levels.length}>
//             Next
//           </button>
//         </div>
//       )}

//       <div className="level-container">
//         {renderLevel()}
//       </div>

//       {showInstructions && (
//         <InstructionsPopup onClose={handleCloseInstructions} />
//       )}
//     </div>
//   );
// };

// const formatTime = (seconds) => {
//   const minutes = Math.floor(seconds / 60);
//   const remainingSeconds = seconds % 60;
//   return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
// };

// // export default Game;

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import InstructionsPopup from './InstructionsPopup';
import audio from '../assets/images/audio.png';
import gob from '../assets/images/goback.webp';
import last from '../assets/images/last.gif';
import inst from '../assets/inst.mp3';
import levelsData from '../assets/levelsData.json';

import CombinedLevel from './CombinedLevel'; // Import the CombinedLevel component
import Combined2And3Level from './Combined2and3'; // Import the Combined2And3Level component

const Game = () => {
  const [currentLevel, setCurrentLevel] = useState(-1); // -1 indicates the start page
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false); // Do not show instructions popup initially
  const audioRef = useRef(null);

  const throwConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  useEffect(() => {
    if (startTime !== 0 && currentLevel >= 0) {
      setEndTime(Date.now()); // Record end time when all levels are completed
      console.log('End time set:', Date.now());
    }
  }, [currentLevel, startTime]);

  useEffect(() => {
    if (currentLevel === -1) {
      localStorage.removeItem('totalTrialCount'); // Reset trial count at the beginning of a new session
    }
  }, [currentLevel]);

  const sendGameData = async () => {
    try {
      const totalTimeInSeconds = Math.floor((endTime - startTime) / 1000);
      const totalTrialCount = localStorage.getItem('totalTrialCount') || 0;
      const gameId = "105";

      const gameData = {
        gameId,
        tries: totalTrialCount,
        timer: totalTimeInSeconds,
        status: true,
      };

      console.log('Sending game data:', gameData);

      const response = await fetch('https://jwlgamesbackend.vercel.app/api/caretaker/sendgamedata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
      });

      if (response.ok) {
        console.log('Game data saved successfully');
      } else {
        console.error('Failed to save game data', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (endTime !== 0 && currentLevel === 1) {
      console.log('Sending game data...');
      sendGameData(); // Send game data when all levels are completed
    }
  }, [endTime, currentLevel]);

  const handleStart = (session) => {
    setSelectedSession(session);
    setShowInstructions(true); // Show instructions before starting the game
  };

  const handleComplete = () => {
    setEndTime(Date.now()); // Record end time when all levels are completed
    setCurrentLevel(1); // Go to the end page
    console.log('All levels completed, transitioning to end page');
  };

  const updateTrialCount = (increment) => {
    const totalTrialCount = parseInt(localStorage.getItem('totalTrialCount') || 0, 10);
    localStorage.setItem('totalTrialCount', totalTrialCount + increment);
  };

  const handleInstructionsClose = () => {
    setShowInstructions(false);
    setCurrentLevel(0); // Start the game after closing instructions
    setStartTime(Date.now()); // Start the timer
    console.log('Instructions closed, starting game at level 0');
  };

  const toggleAudio = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  console.log('Current level:', currentLevel);

  return (
    <div className="app-container">
      {currentLevel === -1 && (
        <div className="start-page">
          <div className="goback">
            <img
              src={gob}
              alt="goback"
              onClick={() => {
                window.location.href = "https://joywithlearning.com/games";
              }}
              style={{ width: '50px', height: '50px', cursor: 'pointer' }}
            />
          </div>
          <h3 className='heading'>Animal Matching Game</h3>
          <button className="button-74" onClick={() => handleStart('session1')}>
            Session 1
          </button>
          <button className="button-74" onClick={() => handleStart('session2')}>
            Session 2
          </button>
          <button className="button-74" onClick={() => handleStart('session3')}>
            Session 3
          </button>
        </div>
      )}
      {currentLevel >= 0 && currentLevel < 1 && (
        selectedSession === 'session1' ? (
          <CombinedLevel
            levels={levelsData.session1}
            updateTrialCount={updateTrialCount}
            throwConfetti={throwConfetti}
            onLevelComplete={() => {
              console.log('Level complete, moving to next level');
              setCurrentLevel(currentLevel + 1);
            }}
          />
        ) : (
          <Combined2And3Level
            selectedSession={selectedSession} 
            levels={levelsData[selectedSession]}
            updateTrialCount={updateTrialCount}
            throwConfetti={throwConfetti}
            onLevelComplete={() => {
              console.log('Level complete, moving to next level');
              setCurrentLevel(currentLevel + 1);
            }}
          />
        )
      )}
      {currentLevel === 1 && (
        <div className="end-page">
          <h3 className='heading' style={{ fontSize: '50px' }}>Good Job!</h3>
          <img src={last} style={{ width: '200px', height: 'auto' }} alt="Congratulations GIF" />
          <p style={{ fontSize: '40px', fontWeight: 'bold' }}>Total Time: {formatTime(Math.floor((endTime - startTime) / 1000))}</p>
          <p style={{ fontSize: '40px', fontWeight: 'bold' }}>Total Trials: {localStorage.getItem('totalTrialCount') || 0}</p>

          <button className="button-74" onClick={() => setCurrentLevel(-1)}>
            Replay
          </button>
          <div className="goback">
            <img
              src={gob}
              alt="goback"
              onClick={() => {
                window.location.href = "https://joywithlearning.com/games";
              }}
              style={{ width: '50px', height: '50px', cursor: 'pointer' }}
            />
          </div>
        </div>
      )}
      {showInstructions && <InstructionsPopup visible={showInstructions} onClose={handleInstructionsClose} />}
      <div className="audio-player">
        <audio ref={audioRef} src={inst} />
        <img
          src={audio}
          alt="Play"
          className="play-icon"
          onClick={toggleAudio}
          style={{ width: '50px', height: '50px', cursor: 'pointer' }}
        />
      </div>
    </div>
  );
};

export default Game;
