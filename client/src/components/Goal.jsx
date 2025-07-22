import { useState } from 'react'

const Goal = () => {
  let [inputValue, setInputValue] = useState("");
  let [tasks, setTasks] = useState(["Sample Task"]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  }

  

  const addTask = () => {
    if (inputValue.trim() != "") {
      setTasks(() => {
        return [...tasks , inputValue]
      })
      setInputValue(""); // Clear input after adding
    }
    }
 

  return (
    <div>
      <h1 className='text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl italic py-2 font-semibold'>Write Your <span className=' text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-orange-400'>Goals</span> here</h1>
      <div className='px-4 py-3 w-full  flex items-center justify-center'>

        <input type="text" name="goal" placeholder='Enter Your Goal here...' id="goal" className='border border-gray-400 outline-none px-2 py-2 rounded w-full md:w-[90%] lg:w-[80%]text-lg font-semibold' value={inputValue} onChange={handleChange} />
        <button onClick={addTask} className='px-5 py-2 bg-blue-700 hover:bg-blue-600 text-white font-semibold cursor-pointer ms-1 rounded'>Add</button>
      </div>
      <div className="tasks">
        <ul className='px-15 py-4'>
          {tasks.map((task, idx) => {
            return (
            <li key={idx} className='text-lg py-2 list-decimal font-semibold italic'>{task}</li>
          )
          })}
        </ul>
      </div>
    </div>
  )
}

export default Goal