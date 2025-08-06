import React from 'react';
import SearchAppBar from '../components/SearchAppBar';
import UserInfo from '../components/UserInfo';


const Header = () => {
  return (
    <div className='flex flex-col w-full my-3'>
      <div className='flex justify-between items-center mx-4 mb-2'>
        <SearchAppBar />
        <UserInfo />
      </div>
      <hr class="h-px bg-gray-200 border-0 dark:bg-gray-300" />
    </div>
  )
}

export default Header