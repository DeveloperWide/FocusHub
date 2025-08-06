import React from 'react'
import { getUser } from '../utils/auth'

const UserInfo = () => {
  const user = getUser();
  return (
    <div className='flex justify-center items-center gap-1 '>
        <img src={`${user.profileImage.url}`} className='h-8 w-8 rounded-full' alt="Mahesh" />
        <div className="user-info">
            <p className="name font-semibold text-[12px`] p-0 m-0 hidden md:block">{user.name}</p>
            <p className="email text-[10px] font-semibold text-gray-500 hidden md:block">{user.email}</p>
        </div>
    </div>
  )
}

export default UserInfo