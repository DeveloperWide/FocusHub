import React, { useEffect, useState } from 'react'

const Time = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);
  return (
    <div className='h-full flex flex-col justify-center items-center'>
      <h1 className='text-6xl sm:text-8xl font-semibold text-gray-700'>{currentTime.toLocaleTimeString()}</h1>
      <div className='py-4'>
        <i className="fa-solid fa-hourglass-end"></i>
      </div>
    </div>
  )
}

export default Time