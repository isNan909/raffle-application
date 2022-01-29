import { useState, useEffect } from 'react';
import { useTransition, animated } from 'react-spring';
import shuffle from "lodash/shuffle";

import '././App.css';

let data = [
  {
    name: 'Rare Wind',
  },
  {
    name: 'Saint Petersburg',
  },
  {
    name: 'Deep Blue',
  },
  {
    name: 'Ripe Malinka',
  },
  {
    name: 'Near Moon',
  },
  {
    name: 'Wild Apple',
  },
];

function App() {
  const [names, setNames] = useState(data);
  const [initialLoad, setInitialLoad] = useState(false);
  const height = 20;
  const transitions = useTransition(
    names.map((data, i) => ({ ...data, y: i * height })),
    d => d.name,
    {
      from: { position: "absolute", opacity: 0 },
      leave: { height: 0, opacity: 0 },
      enter: ({ y }) => ({ y, opacity: 1 }),
      update: ({ y }) => ({ y })
    }
  );

  function startRaffle() {
    if (names.length <= 1) {
      return;
    }
    const randomIndex = Math.floor(Math.random() * names.length);
    const filterOutNames = names.filter((name) => name !== names[randomIndex]);
    setNames(filterOutNames);
    setInitialLoad(true);
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

  return (
    <div className="container">
      <button onClick={startRaffle}>Start Raffle</button>
      <button onClick={() => setNames(shuffle(names))}>Shuffle</button>
      {transitions.map(({ item, props: { y, ...rest }, key }, index) => (
        <animated.div
          key={key}
          class="card"
          style={{
            transform: y.interpolate(y => `translate3d(0,${y}px,0)`),
            ...rest
          }}
        >
          <ul>
            <li>{item.name}</li>
          </ul>
        </animated.div>
      ))}
    </div>
  );
}

export default App;
