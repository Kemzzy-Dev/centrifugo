'use client'

import { Gamepad } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';

type FormFields = {
    name: string;
    id: string;
};


const JoinGameForm = ({params}: {params: {id: string}}) => {
    const [errMessage, setErrMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [formIsValid, setFormIsValid] = useState(false);
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<FormFields>();
    const watchForName = watch("name", "");
    const router = useRouter()
    
    useEffect(() => {
        const IsFormValid =
        watchForName.length > 5
        
        IsFormValid ? setFormIsValid(true) : setFormIsValid(false)
        
    }, [watchForName]);
    
    async function onSubmit(data: FormFields) {
        
        setLoading(true)
        if(formIsValid){
            sessionStorage.setItem('Joined', JSON.stringify(data.id))
            router.push(`/game-room?roomId=${params.id}`)
            setLoading(false)

            // Also add uer to room in centrifugo and database
        }
    }

    return (
        <div className="w-full justify-center items-center min-h-screen bg-primary flex flex-col ">
            <form
                className="flex w-full shadow-custom-inset flex-col gap-8 px-4 md:px-8 py-10 rounded-lg bg-white md:w-[40%]"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="flex flex-col gap-2">
                    <h3 className="text-[24px] text-heading-m text-black font-bold">Join Game</h3>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col w-full gap-2">
                        <label htmlFor="cuurent-password">Game Room ID</label>
                        <div className="flex items-center gap-2 relative w-full rounded-md border">
                            <input
                                className={`outline-none flex-1 relative border-gray px-4 p-4 focus:ring-1 focus:ring-primary rounded-lg ${errors.name && 'border-red focus:ring-0 border'}`}
                                {...register("id", {
                                    required: 'cant be empty',
                                })}
                                placeholder="Jungle justice"
                                type="text"
                                value={params.id}
                            />
                            {errors.name && <p className="text-red text-[12px] absolute right-2 top-[32%]">{errors.name.message}</p>}
                        </div>
                    </div>
                    <div className="flex flex-col w-full gap-2">
                        <label htmlFor="cuurent-password">Your name</label>
                        <div className="flex items-center gap-2 relative w-full rounded-md border">
                            <input
                                className={`outline-none flex-1 relative border-gray px-4 p-4 focus:ring-1 focus:ring-primary rounded-lg ${errors.name && 'border-red focus:ring-0 border'}`}
                                {...register("name", {
                                    required: 'cant be empty',
                                })}
                                placeholder="Jungle justice"
                                type="text"
                            />
                            {errors.name && <p className="text-red text-[12px] absolute right-2 top-[32%]">{errors.name.message}</p>}
                        </div>
                    </div>
                </div>
                {errMessage && <p className="text-red text-[18px] pb-2">{errMessage}</p>}
                <button type="submit" className="bg-primary-yellow border-secondary border shadow-custom-inset p-[11px] rounded-lg text-[18px] text-white">
                    {loading ? 'Loading...' : 'Join Game Room'}
                </button>
            </form>
        </div>
    )
}

export default JoinGameForm
