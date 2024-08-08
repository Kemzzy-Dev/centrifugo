import React from 'react'
import { mockUsers } from './asset/mockUser'
import PlayerComponent from './PlayerComponent'

const EvenLayout = () => {
    const interval = mockUsers.length/2
    return (
        <div className='flex justify-between'>
            <div className='w-max flex flex-col justify-center gap-6'>
                {
                    mockUsers.slice(0, interval).map((user) => (
                        <PlayerComponent key={user.id} id={user.id} name={user.name} message={user.message} />
                    ))
                }
            </div>
            <div className='flex-1'>
                {/* Central Area */}
            </div>
            <div className='w-max flex flex-col gap-6 justify-center'>
                {
                    mockUsers.slice(interval, mockUsers.length).map((user) => (
                        <PlayerComponent key={user.id} id={user.id} name={user.name} message={user.message} />
                    ))
                }
            </div>
        </div>
    )
}

export default EvenLayout
