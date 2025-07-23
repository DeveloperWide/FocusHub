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
    <div className='h-full flex justify-center items-center'>
      <h1 className='text-6xl sm:text-8xl font-semibold text-gray-700'>{currentTime.toLocaleTimeString()}</h1>
    </div>
  )
}

export default Time