import { useState } from "react";

const StatisticsLine = ({ text, value }) => (
  <p>
    {text} {value}
  </p>
);

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad;

  if (all === 0) {
    return <p>No feedback given</p>;
  }

  const average = (good - bad) / all;
  const positive = (good / all) * 100;

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td><StatisticsLine text="good" value={good} /></td>
          </tr>
          <tr>
            <td><StatisticsLine text="neutral" value={neutral} /></td>
          </tr>
          <tr>
            <td><StatisticsLine text="bad" value={bad} /></td>
          </tr>
          <tr>
            <td><StatisticsLine text="all" value={all} /></td>
          </tr>
          <tr>
            <td><StatisticsLine text="average" value={average} /></td>
          </tr>
          <tr>
            <td><StatisticsLine text="positive" value={`${positive} %`} /></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return <div>
    <h3>Give feedback</h3>
    <button onClick={() => setGood(good + 1)}>good</button>
    <button onClick={() => setNeutral(neutral + 1)}>neutral</button>
    <button onClick={() => setBad(bad + 1)}>bad</button>

    <h3>Statistics</h3>
    <Statistics good={good} neutral={neutral} bad={bad} />
  </div>;
};

export default App;
