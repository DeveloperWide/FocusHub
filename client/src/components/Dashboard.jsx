import React from 'react'

const Dashboard = () => {
  return (
    <>
      <div className='font-bold text-4xl mx-10 my-10'>Dashboard</div>
      <div className='profile_box flex justify-center items-center'>
        <div className='bg-blue-700 w-4xl h-[30vh] rounded-3xl'>
          <div className='fixed top-35 right-53 text-white cursor-pointer'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
              <path d="M3.78181 16.3092L3 21L7.69086 20.2182C8.50544 20.0825 9.25725 19.6956 9.84119 19.1116L20.4198 8.53288C21.1934 7.75922 21.1934 6.5049 20.4197 5.73126L18.2687 3.58024C17.495 2.80658 16.2406 2.80659 15.4669 3.58027L4.88841 14.159C4.30447 14.7429 3.91757 15.4947 3.78181 16.3092Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M14 6L18 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </div>
          <div className='flex justify-center items-center my-5'>
            <div className='flex flex-col justify-center items-center gap-4'>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs42w7bN0-F5Dul_AhIss8Ibg7M1teHU7xlQ&s" className='h-32 w-32 border border-2 border-black rounded-full' alt="Mahesh" />
              <div className="user-info text-center gap-1">
                <p className="name font-semibold text-[20px] p-0 m-0">Mahesh Babu</p>
                <p className="email text-[15px] font-semibold text-gray-500">maheshbabu@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>


    </>
  )
}

export default Dashboard