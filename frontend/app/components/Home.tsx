'use client'
import React, { useState } from 'react'
import Register from './auth/Register'
import Login from './auth/Login'

const Home = () => {
    const [loginIsDisplayed, setLoginIsDisplayed] = useState(true)
    return (
        <div  className='w-screen min-h-screen md:p-8 p-4 md:gap-[51px] md:bg-[#ccc] gap-30px flex flex-col md:items-center md:justify-center '>
            {
                loginIsDisplayed? (
                    <Login setLoginIsDisplayed={setLoginIsDisplayed} />
                ) : (
                    <Register setLoginIsDisplayed={setLoginIsDisplayed} />
                )
            }
        </div>
    )
}

export default Home
