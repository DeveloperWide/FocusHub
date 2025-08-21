import {useTimer} from "../helper/userTimer"
import TimerDisplay from "../components/TimerDisplay";
import TimerControls from "../components/TimerControls";
import TimeInput from "../components/TimeInput";

const FocusTimer = () => {
  const { time, isRunning, start, reset, setMinutes } = useTimer(25);

  return (
    <div className="flex flex-col h-full justify-center">
      <TimerDisplay time={time} />
      <div className="flex flex-col gap-6">
        <TimerControls isRunning={isRunning} onStart={start} onReset={reset} />
        <TimeInput onChange={setMinutes} disabled={isRunning} />
      </div>
    </div>
  );
};

export default FocusTimer;
