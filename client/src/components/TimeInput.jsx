import { useState } from "react";
import { updateTimer } from "../utils/helper";

const TimeInput = ({ onChange, disabled }) => {
  const [inputValue, setInputValue] = useState("");

  const inputOnChangeHandler = (e) => {
    const val = e.target.value;
    // Allow only numbers, prevent negatives
    if (val === "" || /^[0-9]+$/.test(val)) {
      setInputValue(val);
    }
  };
  const num = Number(inputValue);
  
  const handleUpdate = () => {
    updateTimer(num, onChange, setInputValue)
  };

  const onKeyDownHandler = (e) => {
    if(e.key === "Enter") updateTimer(num, onChange, setInputValue)
  }

  const isValid = inputValue && Number(inputValue) >= 1;

  return (
    <div className="flex justify-center items-center gap-3">
      {/* Input */}
      <input
        type="number"
        placeholder="Set Mins"
        value={inputValue}
        min="1"
        onKeyDown={onKeyDownHandler}
        className="w-32 p-3 rounded-xl text-center 
                   bg-white/10 backdrop-blur-md 
                   border border-gray-300 text-gray-400 font-semibold text-xl
                   placeholder-gray-400 
                   focus:outline-none focus:ring-2 focus:ring-blue-400 
                   transition-all duration-300"
        onChange={inputOnChangeHandler}
        disabled={disabled}
      />

      {/* Button */}
      <button
        onClick={handleUpdate}
        disabled={!isValid || disabled}
        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300
          ${!isValid || disabled
            ? "bg-gray-600 text-gray-300 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
          }`}
      >
        Update
      </button>
    </div>
  );
};

export default TimeInput;
