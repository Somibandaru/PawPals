import React, { useEffect, useState, useRef } from 'react';
import Draggable from 'react-draggable';
import levelsData from '../assets/levelsData.json';

const CombinedLevelSession2And3 = ({ selectedSession, updateTrialCount, throwConfetti, onLevelComplete }) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [trialCount, setTrialCount] = useState(0);
  const [headPosition, setHeadPosition] = useState({ x: 1000, y: 280 });
  const [deerPosition1, setDeerPosition1] = useState({ x: 1000, y: 280 });
  const [deerPosition2, setDeerPosition2] = useState({ x: 1000, y: 280 });
  const [tailPosition, setTailPosition] = useState({ x: 0, y: 0 });
  const [headShadowPosition, setHeadShadowPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [images, setImages] = useState({});
  const [showNextButton, setShowNextButton] = useState(false);

  const headRef = useRef(null);
  const deerRef1 = useRef(null);
  const deerRef2 = useRef(null);
  const [imageSize, setImageSize] = useState({ width: 400, height: 400 });
  const originalDeerPositionRef1 = useRef({ x: 0, y: 0 });
  const originalDeerPositionRef2 = useRef({ x: 0, y: 0 });

  const incrementTrialCount = () => {
    setTrialCount((prevCount) => prevCount + 1);
    updateTrialCount(1);
  };

  const onStopHead = (e, data) => {
    incrementTrialCount();
    const { x, y } = data;
    // console.log(`Head Position: x: ${x}, y: ${y}`);

    if (Math.abs(x - headShadowPosition.x) < 10 && Math.abs(y - headShadowPosition.y) < 10) {
      setHeadPosition(headShadowPosition);
      throwConfetti();
      setShowNextButton(true);
      if (currentLevel === (levelsData[selectedSession] || []).length - 1) {
        setTimeout(() => {
          onLevelComplete();
        }, 1000); 
      }
    } else {
      setHeadPosition({ x, y });
    }
  };

  const onStopDeer1 = (e, data) => {
    incrementTrialCount();
    shakeAndResetDeer(setDeerPosition1, originalDeerPositionRef1);
  };

  const onStopDeer2 = (e, data) => {
    incrementTrialCount();
    shakeAndResetDeer(setDeerPosition2, originalDeerPositionRef2);
  };

  const shakeAndResetDeer = (setDeerPosition, originalDeerPositionRef) => {
    const shakeAmplitude = 10;
    const shakeDuration = 100;
    let shakeCount = 0;
    const shakeLimit = 5;

    const shake = () => {
      if (shakeCount < shakeLimit) {
        shakeCount++;
        setDeerPosition((prevPosition) => ({
          x: prevPosition.x + (shakeCount % 2 === 0 ? -shakeAmplitude : shakeAmplitude),
          y: prevPosition.y,
        }));
        setTimeout(shake, shakeDuration);
      } else {
        setDeerPosition(originalDeerPositionRef.current);
      }
    };

    shake();
  };

  const handleResize = () => {
    const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    const newSize = { width: 400 * scale, height: 400 * scale };
    setImageSize(newSize);
    // updatePositions(scale);
  // };

  // const updatePositions = (scale) => {
    const levelData = (levelsData[selectedSession] || [])[currentLevel];
    if (levelData) {
      setTailPosition({ x: levelData.tailPosition.x * scale, y: levelData.tailPosition.y * scale });
      setHeadPosition({ x: levelData.headPosition.x * scale, y: levelData.headPosition.y * scale });
      setDeerPosition1({ x: levelData.deerPosition1.x * scale, y: levelData.deerPosition1.y * scale });
      setDeerPosition2({ x: levelData.deerPosition2.x * scale, y: levelData.deerPosition2.y * scale });
      setHeadShadowPosition({ x: levelData.headShadowPosition.x * scale, y: levelData.headShadowPosition.y * scale });

      originalDeerPositionRef1.current = { x: levelData.deerPosition1.x * scale, y: levelData.deerPosition1.y * scale };
      originalDeerPositionRef2.current = { x: levelData.deerPosition2.x * scale, y: levelData.deerPosition2.y * scale };
      setScale(scale);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [currentLevel]);//////////////

  useEffect(() => {
    const loadImages = async () => {
      const levelData = (levelsData[selectedSession] || [])[currentLevel];

      if (levelData) {
        try {
          const tail = (await import(`../assets/images/${levelData.tail}`)).default;
          const head = (await import(`../assets/images/${levelData.head}`)).default;
          const deerHead1 = (await import(`../assets/images/${levelData.deerHead1}`)).default;
          const deerHead2 = (await import(`../assets/images/${levelData.deerHead2}`)).default;
          setImages({ tail, head, deerHead1, deerHead2 });
        } catch (error) {
          console.error('Error loading images:', error);
        }
      }
    };

    loadImages();
    // updatePositions(scale);
    // setShowNextButton(false); // Hide Next button for new level
  }, [currentLevel, selectedSession]);


  /////////////////
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [currentLevel]);



  useEffect(() => {
    if ((levelsData[selectedSession] || []).length === 0) {
      console.error('Session data is empty.');
      return;
    }
    if (currentLevel === (levelsData[selectedSession] || []).length) {
      onLevelComplete();
    }
  }, [currentLevel, onLevelComplete]);

  const commonStyle = {
    position: 'absolute',
    width: `${imageSize.width}px`,
    height: `${imageSize.height}px`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
  };

  if (currentLevel >= levelsData[selectedSession].length) {
    return null; // All levels completed
  }

  return (
    <div style={{ position: 'relative', backgroundColor: '#D8F7F2', height: 'calc(100vh - 100px)', zIndex: 1 }}>
      {/* Tail Image */}
      <div
        style={{
          ...commonStyle,
          backgroundImage: `url(${images.tail})`,
          left: `${tailPosition.x}px`,
          top: `${tailPosition.y}px`,
        }}
      />

      <Draggable position={headPosition} onStop={onStopHead} nodeRef={headRef}>
        <div
          ref={headRef}
          style={{
            ...commonStyle,
            backgroundImage: `url(${images.head})`,
            cursor: 'grab',
          }}
        />
      </Draggable>

      <Draggable position={deerPosition1} onStop={onStopDeer1} nodeRef={deerRef1}>
        <div
          ref={deerRef1}
          style={{
            ...commonStyle,
            backgroundImage: `url(${images.deerHead1})`,
            cursor: 'grab',
          }}
        />
      </Draggable>

      <Draggable position={deerPosition2} onStop={onStopDeer2} nodeRef={deerRef2}>
        <div
          ref={deerRef2}
          style={{
            ...commonStyle,
            backgroundImage: `url(${images.deerHead2})`,
            cursor: 'grab',
          }}
        />
      </Draggable>

      {showNextButton && !((levelsData[selectedSession] || []).length - 1 === currentLevel) && (
        <button
          className="button-74"
          onClick={() => {
            setCurrentLevel((prevLevel) => Math.min(prevLevel + 1, (levelsData[selectedSession] || []).length - 1));
            setShowNextButton(false);
          }}
          style={{ position: 'absolute', right: '70px', bottom: '30px' }}
        >
          Next Level
        </button>
      )}
      {/* Display Trial Count */}
      <div
        style={{
          position: 'absolute',
          top: `${150 * scale}px`,
          right: '10px',
          fontSize: `${50 * scale}px`,
          zIndex: 2,
        }}
      >
        Trials: {trialCount}
      </div>
    </div>
  );
};

export default CombinedLevelSession2And3;
