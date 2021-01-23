import React from "react";
import "./styles.css";

const events = {};
const functionReferences = {};

const addFunctionReference = (func, name = null) => {
  name = name || func.name;

  const _func = functionReferences[name];

  if (!_func) {
    functionReferences[name] = new Set();
  }

  functionReferences[name].add(func);
};

const addEvents = (event) => {
  let _event = events[event];

  if (!_event) {
    _event = events[event] = 0;
  }

  events[event] = _event + 1;
};

const CounterButton = React.memo(({ onClick, children }) => {
  addEvents(`CounterButton() ${children}`);

  return <button onClick={onClick}>{children}</button>;
});

const CounterButtons = React.memo(({ setCounter, setCounter2 }) => {
  addEvents("CounterButtons()");

  const increment = React.useCallback(
    () => setCounter((prevState) => prevState + 1),
    [setCounter]
  );

  const decrement = React.useCallback(
    () => setCounter((prevState) => prevState - 1),
    [setCounter]
  );

  const handleSetName = (e) => setCounter2((prevState) => prevState + 1);

  addFunctionReference(increment, "increment");

  addFunctionReference(decrement, "decrement");

  return (
    <>
      <CounterButton onClick={decrement}>-</CounterButton>
      <CounterButton onClick={increment}>+</CounterButton>
      <button onClick={handleSetName}>Increment</button>
    </>
  );
});

const CounterDisplay = React.memo(({ counter }) => {
  addEvents("CounterDisplay()");

  return (
    <>
      <h1>{counter}</h1>
      <h3>Counter</h3>
    </>
  );
});

const OnlyCounterDisplay = React.memo(({ counter }) => {
  addEvents("OnlyCounterDisplay()");

  return (
    <>
      <h1>{counter}</h1>
      <h3>Counter</h3>
    </>
  );
});

function Events({ events }) {
  return (
    <>
      <h3>Events</h3>
      <ul>
        {Object.entries(events).map(([key, value], index) => (
          <li key={index}>
            {key} triggered {value} times
          </li>
        ))}
      </ul>
    </>
  );
}

function FunctionReferencesInfo({ functionReferences }) {
  const entries = Object.entries(functionReferences);

  return (
    <>
      <h3>Function References Count</h3>
      <ul>
        {entries.map(([key, value]) => (
          <li key={key}>
            {key}: {value.size}
          </li>
        ))}
      </ul>
    </>
  );
}

function DetailedInfo({ functionReferences, events }) {
  return (
    <>
      <FunctionReferencesInfo functionReferences={functionReferences} />
      <Events events={events} />
    </>
  );
}

function App() {
  const [counter, setCounter] = React.useState(0);
  const [counter2, setCounter2] = React.useState(0);

  addFunctionReference(setCounter, "setCounter");

  addEvents("App()");

  return (
    <div className="boxColumn">
      <div className="boxRow">
        <div>
          <CounterDisplay counter={counter} />
          <CounterButtons setCounter={setCounter} setCounter2={setCounter2} />
        </div>

        <div>
          <OnlyCounterDisplay counter={counter2} />
        </div>
      </div>
      <div>
        <DetailedInfo functionReferences={functionReferences} events={events} />
      </div>
    </div>
  );
}
