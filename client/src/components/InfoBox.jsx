import React from 'react'

const InfoBox = ({title, value}) => {
  return (
    <div className="info-box px-1 py-2 border-l-4 [&:nth-child(odd)]:border-l-blue-400 [&:nth-child(even)]:border-l-teal-600 p-2  flex rounded flex-col items-start">
        <div className="title text-lg text-[#333a] font-semibold ps-5">{title}</div>
        <div className="count text-2xl text-black font-semibold ps-5">{value}</div>
    </div>
  )
}

export default InfoBox;