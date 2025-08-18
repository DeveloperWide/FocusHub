import React, { useEffect, useState } from 'react'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { TrendingUp } from "lucide-react"
import BoltIcon from '@mui/icons-material/Bolt';

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
      <h1 className='text-6xl sm:text-8xl font-bold text-gray-900'>{currentTime.toLocaleTimeString()}</h1>
      <div className='py-5' style={{
        display: "flex",
        gap: "12px"
      }}>
        <div className='icon-box hover:bg-[rgba(37,99,235,0.15)]'>
          <TrendingUp />
        </div>

        <div className='icon-box hover:bg-[rgba(249,116,22,0.28)]'>
          <CalendarMonthIcon sx={{ color: "#F97316", fontSize: 28 }} titleAccess='Focus Hour Log'/>
        </div>

        <div className='icon-box hover:bg-[rgba(22,163,74,0.15)]'>
          <TrendingUpIcon sx={{ color: "#16A34A", fontSize: 28 }} titleAccess='Productivity Streak'/>
        </div>

        <div className='icon-box hover:bg-[rgba(234,178,8,0.32)]'>
          <BoltIcon sx={{ color: "#EAB308", fontSize: 28 }} titleAccess='Quick Start Timer'/>
        </div>
      </div>

    </div>
  )
}

export default Time