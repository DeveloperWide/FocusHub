const TimerDisplay = ({ time }) => {
  const formatTime = (seconds) => {
    const abs = Math.abs(seconds);
    const mins = String(Math.floor(abs / 60)).padStart(2, "0");
    const secs = String(abs % 60).padStart(2, "0");
    return `${seconds < 0 ? "-" : ""}${mins}:${secs}`;
  };

  return (
    <div className="rounded-xl p-4 mb-4 text-center">
      <div className="text-8xl sm:text-9xl font-bold text-gray-900 tracking-wider">
        {formatTime(time)}
      </div>
    </div>
  );
};

export default TimerDisplay;
