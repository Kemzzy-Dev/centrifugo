import React from 'react'
import PlayerComponent from './PlayerComponent'
import { mockUsers } from './asset/mockUser'


const OddLayout = ({content}: {content: string}) => {
    const interval = mockUsers.length/3
    return (
        <div className='flex flex-col gap-10'>
            <div className='h-max flex justify-around'>
                {
                    mockUsers.slice(0, 3).map((user) => (
                        <PlayerComponent key={user.id} id={user.id} name={user.name} message={user.message} />
                    ))
                }
            </div>
            <div className='flex justify-between'>
                <div className='w-max flex flex-col gap-6'>
                    {
                        mockUsers.slice(3, 6).map((user) => (
                            <PlayerComponent key={user.id} id={user.id} name={user.name} message={user.message} />
                        ))
                    }
                </div>
                <div className='flex-1 flex flex-col items-center'>
                {/* Central Area */}
                </div>
                <div className='w-max flex flex-col gap-6'>
                    {
                        mockUsers.slice(6, 9).map((user) => (
                            <PlayerComponent key={user.id} id={user.id} name={user.name} message={user.message} />
                        ))
                    }
                </div>
            </div>
        </div>

    )
}

export default OddLayout
