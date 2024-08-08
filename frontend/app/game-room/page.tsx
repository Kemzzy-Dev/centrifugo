'use client'
import React, { useEffect, useState } from 'react'
import PlayerComponent from '../components/PlayerComponent'
import InputEmoji from "react-input-emoji";
import { ArrowUp } from 'lucide-react';
import GameCustomizeNavBar from '../components/GameCustomizeNavBar';
import { useRouter } from 'next/navigation';
import { mockUsers } from '../components/asset/mockUser';
import OddLayout from '../components/OddLayout';
import EvenLayout from '../components/EvenLayout';


const GameRoom = ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
    const [text, setText] = useState('')
    const [isCopied, setIsCopied] = useState(false)
    const router = useRouter()
    const session = sessionStorage.getItem('Joined')
    const handleSendMessage = () => {
        console.log(text);
    }

    const oddLayout = mockUsers.length % 2 !== 0
    const evenLayout = mockUsers.length % 2 === 0



    useEffect(() => {
        if (!session) {
            router.push(`/join-game/${searchParams.roomId}`)
        }
    }, [])

    // handleShowMenu, handleGoBack, handleShareGameLink, handleHowToPlayClick
    const handleShareGameLink = () => {
        setIsCopied(true)
        if (navigator.clipboard) {
            navigator.clipboard.writeText(`http://localhost:3005/bingo/join-game/${searchParams.roomId}`)

            setTimeout(() => {
                setIsCopied(false)
            }, 1000);
        }

        console.log(`http://localhost:3005/join-game/${searchParams.roomId}`);

    }

    return (
        <main className='flex flex-col min-h-screen pt-[90px] bg-primary'>
            <GameCustomizeNavBar isCopied={isCopied} handleShareGameLink={handleShareGameLink} />
            <section className='md:px-20 min-h-[400px] flex flex-col justify-center  px-4'>
                {oddLayout && <OddLayout />}
                {evenLayout && <EvenLayout />}
            </section>
            <div className='flex w-full justify-center'>
                <div className="flex fixed md:border-none border border-black bottom-6 w-[80%] md:w-[40%] items-center gap-1g md:p-4">
                    <InputEmoji
                        value={text}
                        onChange={setText}
                        cleanOnEnter
                        onEnter={handleSendMessage}
                        borderColor='black'
                        background='transparent'
                        shouldReturn={true}
                        shouldConvertEmojiToImage={false}
                        placeholder="Type a message"
                    />
                    <button onClick={handleSendMessage} className='md:p-2 p-1 rounded-full bg-black text-white bg-opacity-50'>
                        <ArrowUp size={'16px'} />
                    </button>
                </div>
            </div>
        </main>
    )
}

export default GameRoom
