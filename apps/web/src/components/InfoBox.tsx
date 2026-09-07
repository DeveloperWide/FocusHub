import React from 'react'

const InfoBox = ({title, value}) => {
  return (
    <div className="info-box px-4 py-3 bg-blue-200 [&:nth-child(odd)]:bg-blue-100 [&:nth-child(even)]:bg-teal-1` flex rounded flex-col items-start w-[20%]">
        <div className="title text-lg text-[#333a] font-semibold">{title}</div>
        <div className="count text-2xl text-black font-semibold ">{value}</div>
    </div>
  )
}

export default InfoBox;