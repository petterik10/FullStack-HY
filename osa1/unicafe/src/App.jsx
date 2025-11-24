import { useState } from "react";

const Header = ({ text }) => <h2> {text}</h2>;

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const Button = ({ handleClick, text }) => {
    return <button onClick={handleClick}> {text}</button>;
  };

  const StatisticsLine = ({ text, value }) => {
    return (
      <tr>
        <td>
          {text} {value}
        </td>
      </tr>
    );
  };

  const Statistics = ({ good, neutral, bad }) => {
    const all = good + neutral + bad;

    const average = (good - bad) / all;

    const positives = (good / all) * 100 + "  %";

    if (all === 0) {
      return <p>No feedback given</p>;
    }

    return (
      <div>
        <table>
          <tbody>
            <StatisticsLine text="good" value={good} />
            <StatisticsLine text="neutral" value={neutral} />
            <StatisticsLine text="bad" value={bad} />
            <StatisticsLine text="all" value={all} />
            <StatisticsLine text="average" value={average} />
            <StatisticsLine text="positive" value={positives} />
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <Header text="give feedback" />
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <Header text="statistics" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
