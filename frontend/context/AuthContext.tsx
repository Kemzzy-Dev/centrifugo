"use client"
import { useRouter } from 'next/navigation'
import React, { createContext, useContext, useEffect, useState } from 'react'

type Props = {
    children: React.ReactNode
}


export type UserContext = {
    access_token: string
    email: string,
    id: string
}

type UserContextType = {
    user: UserContext,
    setUser: (value: UserContext) => void
}

const ContextProvider = createContext<UserContextType | null>(null)

export const emptyContext = {
    access_token: "",
    email: "",
    id: ""
}

export default function AuthContext({children} :Props) {
    const defaultUserContext = localStorage.getItem('userContext') ? JSON.parse(localStorage.getItem('userContext')!) : emptyContext
    const [user,setUserContext] = useState<UserContext>(defaultUserContext)
    const router = useRouter()

    // useEffect(() => {
    //     const storedUserContext = localStorage.getItem('userContext');
    //     if (storedUserContext) {
    //       setUserContext(JSON.parse(storedUserContext));
    //     }
    //   }, []);
      
    useEffect(() => {
        if (!user.access_token) {
            console.log("Missing token")
            router.push('/')
            return
        }
    },[])

    function setUser(value: UserContext) {
        localStorage.setItem('userContext',JSON.stringify(value))

        setUserContext(value)
    }
    return(
        <ContextProvider.Provider value={{user,setUser}}>
            {children}
        </ContextProvider.Provider>
    )
} 

export function useAuthContext() {
    const context = useContext(ContextProvider)
    if (!context) {
        throw new Error('Context is not available')
    }
    return context
}



