import { useState, useEffect, useRef } from 'react';
import { useTransition, animated } from 'react-spring';
import shuffle from 'lodash/shuffle';
import Confetti from 'react-confetti';

import data from './data';
import '././App.css';
import HeadingImage from './images/heading.svg';
import Play from './images/play.svg';
import Reshuffle from './images/reshuffle.svg';
import Replay from './images/replay.svg';

function App() {
  const [names, setNames] = useState(data);
  const [initialLoad, setInitialLoad] = useState(false);
  const [windowHeight, setWindowHeight] = useState(null);
  const [windowWidth, setWindowWidth] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wraffling, setWraffling] = useState(false);
  const confettiWrapper = useRef(null);
  const height = 60;
  const transitions = useTransition(
    names.map((data, i) => ({ ...data, y: i * height })),
    (d) => d.name,
    {
      from: { position: 'initial', opacity: 0 },
      leave: {
        height: 0,
        opacity: 0,
      },
      enter: ({ y }) => ({ y, opacity: 1 }),
      update: ({ y }) => ({ y }),
    }
  );

  function startRaffle() {
    if (names.length <= 1) {
      setWraffling(true);
      setShowConfetti(true);
      return;
    }
    const randomIndex = Math.floor(Math.random() * names.length);
    const filterOutNames = names.filter((name) => name !== names[randomIndex]);
    setNames(filterOutNames);
    setInitialLoad(true);
  }

  function restartRaffle() {
    setInitialLoad(false);
    setNames(data);
    setWraffling(false);
    setShowConfetti(false);
  }

  useEffect(() => {
    if (initialLoad) {
      const filteringTimer = setTimeout(() => {
        startRaffle();
      }, 700);
      return () => {
        clearTimeout(filteringTimer);
      };
    }
  }, [initialLoad, names, startRaffle]);

  useEffect(() => {
    setWindowHeight(confettiWrapper.current.clientHeight);
    setWindowWidth(confettiWrapper.current.clientWidth);
  }, []);

  return (
    <div className="container" ref={confettiWrapper}>
      <div className="raffle-header">
        <img src={HeadingImage} alt="heading logo" />
        {!initialLoad && (
          <div className="raffle-header__buttons">
            <button className="button-primary" onClick={startRaffle}>
              <img src={Play} alt="heading logo" />
              Start Raffle
            </button>
            <button
              className="button-outline"
              onClick={() => setNames(shuffle(names))}
            >
              <img src={Reshuffle} alt="heading logo" />
              Shuffle
            </button>
          </div>
        )}
      </div>
      {wraffling && (
        <Confetti
          recycle={showConfetti}
          numberOfPieces={80}
          width={windowWidth}
          height={windowHeight}
        />
      )}
      <div className="raffle-names">
        {transitions.map(({ item, props: { ...rest }, index }) => (
          <animated.div
            className="raffle-listnames"
            key={index}
            style={{
              ...rest,
            }}
          >
            <div className="raffle-namelist">
              <span>{item.name}</span>
            </div>
          </animated.div>
        ))}
      </div>
      <div>
        {showConfetti && (
          <div className="raffle-ends">
            <h3>Congratulations! You have won the raffle!</h3>
            <button className="button-outline" onClick={restartRaffle}>
              <img src={Replay} alt="heading logo" />
              Replay
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
