import React from 'react'
import { getUser } from '../utils/auth'
import UserInfo from '../components/UserInfo';
import InfoBox from '../components/InfoBox';
import PieChart from '../components/PieChart';

const Dashboard = () => {
  const user = getUser();
  return (
    <div>
      <header className='bg-gray-100 py-2 shadow-md flex px-5 items-center justify-between'>
        <h1 className='text-2xl font-bold my-4 pe-3 border-r-2 border-[#3333] text-[#333a]'>Dashboard</h1>
        <UserInfo />
      </header>
      <div className='flex flex-col lg:flex-row  md:flex-wrap  lg:items-center justify-evenly mt-5 mx-3 gap-y-1.5'>
        <InfoBox title="Tasks" value={20}/>
        <InfoBox title="Completed Task" value={15}/>
        <InfoBox title="Pending Tasks" value={3}/>
        <InfoBox title="Todo Tasks" value={2}/>
      </div>
      <div>
        <PieChart />
      </div>
    </div>
  )
}

export default Dashboard