import React, { useEffect, useState, useRef } from 'react';
import Draggable from 'react-draggable';
import levelsData from '../assets/levelsData.json';

const CombinedLevel = ({ onNext, onPrev, updateTrialCount, throwConfetti, onLevelComplete }) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [trialCount, setTrialCount] = useState(0);
  const [headPosition, setHeadPosition] = useState({ x: 1000, y: 280 });
  const [deerPosition, setDeerPosition] = useState({ x: 1000, y: 20 });
  const [tailPosition, setTailPosition] = useState({ x: 0, y: 0 });
  const [headShadowPosition, setHeadShadowPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  const headRef = useRef(null);
  const deerRef = useRef(null);
  const [imageSize, setImageSize] = useState({ width: 400, height: 400 });
  const originalDeerPositionRef = useRef({ x: 1000, y: 20 });

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
    const levelData = levelsData[currentLevel];
    setTailPosition({ x: levelData.tailPosition.x * scale, y: levelData.tailPosition.y * scale });
    setHeadShadowPosition({ x: levelData.headShadowPosition.x * scale, y: levelData.headShadowPosition.y * scale });
    setHeadPosition({ x: levelData.headPosition.x * scale, y: levelData.headPosition.y * scale });
    setDeerPosition({ x: levelData.deerPosition.x * scale, y: levelData.deerPosition.y * scale });
    originalDeerPositionRef.current = { x: levelData.deerPosition.x * scale, y: levelData.deerPosition.y * scale };
    setScale(scale);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [currentLevel]);

  useEffect(() => {
    if (currentLevel === levelsData.length) {
      onLevelComplete();
    }
  }, [currentLevel]);

  const commonStyle = {
    position: 'absolute',
    width: `${imageSize.width}px`,
    height: `${imageSize.height}px`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
  };

  if (currentLevel >= levelsData.length) {
    return null; // All levels completed
  }

  const levelData = levelsData[currentLevel];

  return (
    <div style={{ position: 'relative', backgroundColor: '#D8F7F2', height: 'calc(100vh - 100px)', zIndex: 1 }}>
      <div
        style={{
          ...commonStyle,
          backgroundImage: `url(${require(`../assets/images/${levelData.tail}`)})`,
          left: `${tailPosition.x}px`,
          top: `${tailPosition.y - 4}px`,
        }}
      />
      <div
        style={{
          ...commonStyle,
          backgroundImage: `url(${require(`../assets/images/${levelData.headShad}`)})`,
          left: `${headShadowPosition.x}px`,
          top: `${headShadowPosition.y}px`,
        }}
      />
      <Draggable position={headPosition} onStop={onStopHead} bounds="parent">
        <div
          ref={headRef}
          style={{
            ...commonStyle,
            backgroundImage: `url(${require(`../assets/images/${levelData.head}`)})`,
            cursor: 'grab',
          }}
        />
      </Draggable>
      <Draggable position={deerPosition} onStop={onStopDeer} bounds="parent">
        <div
          ref={deerRef}
          style={{
            ...commonStyle,
            backgroundImage: `url(${require(`../assets/images/${levelData.deerHead}`)})`,
            cursor: 'grab',
          }}
        />
      </Draggable>
      <button
        className="button-74"
        onClick={() => setCurrentLevel((prevLevel) => Math.max(prevLevel - 1, 0))}
        style={{ position: 'absolute', left: '70px', bottom: '30px' }}
      >
        Previous Level
      </button>
      <button
        className="button-74"
        onClick={() => setCurrentLevel((prevLevel) => Math.min(prevLevel + 1, levelsData.length - 1))}
        style={{ position: 'absolute', right: '70px', bottom: '30px' }}
      >
        Next Level
      </button>
    </div>
  );
};

export default CombinedLevel;
