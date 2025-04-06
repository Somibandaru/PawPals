
import React, { useEffect, useState, useRef } from 'react';
import Draggable from 'react-draggable';
import levelsData from '../assets/levelsData.json'; // Ensure this path is correct

const CombinedLevel = ({ updateTrialCount, throwConfetti, onLevelComplete }) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [trialCount, setTrialCount] = useState(0);
  const [headPosition, setHeadPosition] = useState({ x: 1000, y: 280 });
  const [deerPosition, setDeerPosition] = useState({ x: 1000, y: 20 });
  const [tailPosition, setTailPosition] = useState({ x: 0, y: 0 });
  const [headShadowPosition, setHeadShadowPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [images, setImages] = useState({});
  const [showNextButton, setShowNextButton] = useState(false);

  const headRef = useRef(null);
  const deerRef = useRef(null);
  const [imageSize, setImageSize] = useState({ width: 400, height: 400 });
  const originalDeerPositionRef = useRef({ x: 0, y: 0 });

  const incrementTrialCount = () => {
    setTrialCount((prevCount) => prevCount + 1);
    updateTrialCount(1);
  };

  const onStopHead = (e, data) => {
    incrementTrialCount();
    const { x, y } = data;

    if (Math.abs(x - headShadowPosition.x) < 10 && Math.abs(y - headShadowPosition.y) < 10) {
      setHeadPosition(headShadowPosition);
      throwConfetti();
      setShowNextButton(true);
      
      if (currentLevel === (levelsData.session1 || []).length - 1) {
        setTimeout(() => {
          onLevelComplete();
        }, 1000);
      }
    } else {
      setHeadPosition({ x, y });
    }
  };

  const onStopDeer = (e, data) => {
    incrementTrialCount();
    shakeAndResetDeer();
  };

  const shakeAndResetDeer = () => {
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

    const levelData = (levelsData.session1 || [])[currentLevel];
    if (levelData) {
      setTailPosition({ x: levelData.tailPosition.x * scale, y: levelData.tailPosition.y * scale });
      setHeadPosition({ x: levelData.headPosition.x * scale, y: levelData.headPosition.y * scale });
      setDeerPosition({ x: levelData.deerPosition.x * scale, y: levelData.deerPosition.y * scale });
      setHeadShadowPosition({ x: levelData.headShadowPosition.x * scale, y: levelData.headShadowPosition.y * scale });

      originalDeerPositionRef.current = { x: levelData.deerPosition.x * scale, y: levelData.deerPosition.y * scale };
      setScale(scale);
    }
  };

  useEffect(() => {
    const loadImages = async () => {
      const levelData = (levelsData.session1 || [])[currentLevel];
      if (levelData) {
        try {
          const tail = (await import(`../assets/images/${levelData.tail}`)).default;
          const head = (await import(`../assets/images/${levelData.head}`)).default;
          const deerHead = (await import(`../assets/images/${levelData.deerHead}`)).default;
          setImages({ tail, head, deerHead });
        } catch (error) {
          console.error('Error loading images:', error);
        }
      }
    };

    loadImages();
  }, [currentLevel]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [currentLevel]);

  useEffect(() => {
    if ((levelsData.session1 || []).length === 0) {
      console.error('Session data is empty.');
      return;
    }
    if (currentLevel === (levelsData.session1 || []).length) {
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

  if (currentLevel >= (levelsData.session1 || []).length) {
    return null; // All levels completed
  }

  return (
    <div style={{ position: 'relative', backgroundColor: '#D8F7F2', height: 'calc(100vh - 100px)', zIndex: 1 }}>
      <div
        style={{
          ...commonStyle,
          backgroundImage: `url(${images.tail})`,
          left: `${tailPosition.x}px`,
          top: `${tailPosition.y - 4}px`,
        }}
      />
      <Draggable position={headPosition} onStop={onStopHead} bounds="parent">
        <div
          ref={headRef}
          style={{
            ...commonStyle,
            backgroundImage: `url(${images.head})`,
            cursor: 'grab',
          }}
        />
      </Draggable>
      <Draggable position={deerPosition} onStop={onStopDeer} bounds="parent">
        <div
          ref={deerRef}
          style={{
            ...commonStyle,
            backgroundImage: `url(${images.deerHead})`,
            cursor: 'grab',
          }}
        />
      </Draggable>
      {showNextButton && !((levelsData.session1 || []).length - 1 === currentLevel) && (
        <button
          className="button-74"
          onClick={() => {
            setCurrentLevel((prevLevel) => Math.min(prevLevel + 1, (levelsData.session1 || []).length - 1));
            setShowNextButton(false);
          }}
          style={{ position: 'absolute', right: '70px', bottom: '30px' }}
        >
          Next Level
        </button>
      )}
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

export default CombinedLevel;
