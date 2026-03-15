import TimerControls from "./TimerControls";
import TimerDisplay from "./TimerDisplay";

const FocusSessionView = () => {
  return (
    <div className="flex flex-col items-center gap-8">
      <TimerDisplay />
      <TimerControls />
    </div>
  );
};

export default FocusSessionView;
