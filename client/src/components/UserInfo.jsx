import React from 'react'
import { getUser } from '../utils/auth'

const UserInfo = () => {
  return (
    <div className='flex justify-center items-center gap-1'>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs42w7bN0-F5Dul_AhIss8Ibg7M1teHU7xlQ&s" className='h-8 w-8 rounded-full' alt="Mahesh" />
        <div className="user-info">
            <p className="name font-semibold text-[12px`] p-0 m-0 hidden md:block">Mahesh rana</p>
            <p className="email text-[10px] font-semibold text-gray-500 hidden md:block">maheshbabu@gmail.com</p>
        </div>
    </div>
  )
}

export default UserInfo