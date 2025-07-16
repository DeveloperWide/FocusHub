import React, { useState } from 'react';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import OutlinedFlagRoundedIcon from '@mui/icons-material/OutlinedFlagRounded';
import AddTaskRoundedIcon from '@mui/icons-material/AddTaskRounded';
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import AccessAlarmsRoundedIcon from '@mui/icons-material/AccessAlarmsRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';

const SidebarLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    return (
        <div className="flex">
            {/* Sidebar Toggle Button */}
            <button
                onClick={toggleSidebar}
                type="button"
                className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:text-gray-900 dark:hover:cursor-pointer dark:focus:ring-gray-600"
                aria-controls="default-sidebar"
                aria-expanded={isSidebarOpen}
            >
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" />
                </svg>
            </button>

            {/* Sidebar */}
            <aside
                id="default-sidebar"
                className={`fixed top-0 flex justify-center items-center left-0 z-40 w-60 sm:w-50 h-screen transition-transform bg-gray-50 dark:bg-[#232428] overflow-y-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } sm:translate-x-0`}
                aria-label="Sidebar"
            >
                <div className="h-full w-full sm:w-[90%] px-3 py-4 flex flex-col">
                    <div className='flex justify-center items-center gap-3'>
                        <h2 className='text-3xl py-2 text-indigo-500 font-semibold flex gap-1'>FocusHub <i className='text-blue-500'><BarChartRoundedIcon /></i></h2>
                        <i className='self-end inline-block sm:hidden py-2'><ClearRoundedIcon sx={{ fontSize: "30px" }} /></i>
                    </div>
                    <ul className="space-y-2 font-medium">
                        {[
                            { label: 'Dashboard', icon: <QueryStatsRoundedIcon /> },
                            { label: 'Tasks', icon: <AddTaskRoundedIcon />, href: '#', badge: 'Pro' },
                            { label: 'Goals', icon: <OutlinedFlagRoundedIcon />, href: '#', badge: 3 },
                            { label: 'Time', icon: <AccessAlarmsRoundedIcon />, href: '#' },
                            { label: 'Calendar', icon: <CalendarMonthRoundedIcon />, href: '#' },
                        ].map((item, idx) => (
                            <li key={idx}>
                                <a className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    {/* Placeholder icon */}
                                    {item.icon}
                                    <span className="ms-3">{item.label}</span>
                                    {item.badge && (
                                        <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-900 dark:text-gray-300">
                                            {item.badge}
                                        </span>
                                    )}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>


        </div>
    );
};

const PlusIcon = () => (
    <svg className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
    </svg>
);

export default SidebarLayout;
