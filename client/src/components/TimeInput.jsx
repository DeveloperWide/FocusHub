import { useReducer, useState, useRef } from "react";

const TimeInput = ({ onChange, disabled }) => {
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef(null)
    console.log(inputRef)
    // console.log(inputRef.current.value)
    const inputOnChangeHanlder = (e) => {
        setInputValue(parseInt(e.target.value));
    }

    return (
        <div className="flex justify-center">
            <input
                type="number"
                placeholder="Set Mins"
                ref={inputRef}
                value={inputValue}
                className="w-28 p-3 rounded-xl text-center bg-white/10 backdrop-blur-sm border border-text text-text placeholder-text focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300"
                onChange={inputOnChangeHanlder}
            />
            {parseInt(inputRef.current.value) >= 1 ? <button onClick={() => {
                onChange(Number(inputValue))
                setInputValue(null)
            }} disabled={disabled} className={`mx-2 px-3 py-2 rounded font-semibold text-white ${disabled ? "bg-gray-700 cursor-not-allowed" : "bg-green-600 cursor-pointer"}`}>Update Time</button> : "Please Enter At least 1 Min" }
        </div>
    );
};

export default TimeInput;
