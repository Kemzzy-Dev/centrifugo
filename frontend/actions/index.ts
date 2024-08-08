"use server"

import appConfig from "@/config/appConfig"
import { SendMessagePayload } from "@/types"



export async function uploadImageToProvider(payload: any) {

}

const API_URL = appConfig.API_BASE_URL

export async function login(payload: LoginPayload): Promise<AuthResponseDto> {
    const request = await fetch(`${API_URL}/auth/login`,{
        headers: {
            'Content-Type': "application/json"
        },
        method: "POST",
        body: JSON.stringify(payload)
    })
    const response = await request.json()

    return response
}


export async function getChannelSubscriptionToken({channelTitle, token}:{channelTitle: string, token: string}): Promise<string> {
    const channel = channelTitle.split(':')
    console.log(channel)
    const request = await fetch(`${API_URL}/subscription/token/${channel[0]}/${channel[1]}`,{
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    const response = await request.json()
    console.log(response)
    return response.token
}


export async function getCentrifugeToken(token: string): Promise<GetTokenResponseType>{
    const request = await fetch(`${API_URL}/token/`,{
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    const response = await request.json()
    console.log(response)
    return response
}


export async function sendMessage (payload: SendMessagePayload) {
  const request =  await fetch(`${API_URL}/rooms/${payload.roomId}/message`,{
    headers: {
        "Authorization": `Bearer ${payload.token}`,
        'Content-Type': "application/json"

    },
    body: JSON.stringify({message: payload.message}),
    method: 'POST'
  })
  const response = await request.json()
  return response
}


export async function getRooms (token: string) {
  const request =  await fetch(`${API_URL}/rooms/`,{
    headers: {
        "Authorization": `Bearer ${token}`
    }
})
const response = await request.json()
console.log(response)
  return response
}

export async function joinRoom (token: string,roomId: string) {
  const request =  await fetch(`${API_URL}/rooms/${roomId}/join`,{
    headers: {
        "Authorization": `Bearer ${token}`,
        'Content-Type': "application/json"
    },
    method: "POST"
})
const response = await request.json()
console.log(response)
  return response
}


export async function leaveRoom (token: string,roomId: string) {
  const request =  await fetch(`${API_URL}/rooms/${roomId}/leave`,{
    headers: {
        "Authorization": `Bearer ${token}`
    },
    method: "POST"
  })
  const response = await request.json()
  console.log(response)
  return response
}


export async function signUp(payload: CreateUserDTO): Promise<AuthResponseDto> {
   try{ 
    const request = await fetch(`${API_URL}/auth/register`,{
        headers: {
            'Content-Type': "application/json"
        },
        method: "POST",
        body: JSON.stringify(payload)
    })
    const response = await request.json()
    return response
  } catch(error) {
    console.log(error)
    return ErrorResponse
  }
}


const ErrorResponse = {
  status_code: 500,
  message: "Error occured",
  data: {
    user: {
      id: "",
      first_name: "string",
      last_name: "",
      email: "",
    },
  },
  access_token: ""
}

type GetTokenResponseType = {
    status_code: number
    message: string;
    token: string
  }

type AuthResponseDto = {
    status_code: number
    message: string;
    data: {
      user: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
      };
    };
    access_token: string;
  }
  


type SuccessCreateUserResponse = {
    status_code: number;
    message: string;
    data: {
      user: {
        first_name: string;
        last_name: string;
        email: string;
        created_at: Date;
      };
    };
  }

type LoginPayload = {
    email: string
    password: string
}

type CreateUserDTO = {
  
    email: string;

    password: string;
}