import { CircleUserRound } from 'lucide-react'
import Image from 'next/image'
import avartar from './asset/avatar.png'
import React from 'react'

const PlayerComponent = ({ name, message, id, key }: { name: string, message: string, id: number, key: number }) => {
  return (
    <div key={id} className='flex w-max items-start gap-3 p-2'>
      <div className='flex relative flex-col gap-2 items-center'>
        <div><Image src={avartar} width={50} height={50} alt='' /></div>
        <div className='flex gap-2 items-center'>
          <span className='text-[8px]'>🔴</span>
          <span className='capitalize text-[14px]'>{name}</span>
        </div>
      </div>
      <span className='py-2 px-3 bg-white text-[12px] before:bg-red before:absolute before:w-[20px] before:content-none z-10 before:h-[20px] rounded-lg'>
        {message}
      </span>
    </div>
  )
}

export default PlayerComponent
