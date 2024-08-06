'use client'
import React, { Dispatch, useEffect, useState } from 'react';
import InputEmoji from "react-input-emoji";
import { ArrowUp } from 'lucide-react'
import { roomMessages } from '../data';
import { MessageType, RoomType, UserType } from '@/types';
import { dateFormatter } from '@/lib/utils';
import { joinRoom, leaveRoom, sendMessage } from '@/actions';
import { emptyContext, useAuthContext, UserContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { InitialStateType } from '@/lib/types';



const CustomerChat = ({ roomId, chatHandler, authContext, action }: { roomId: string, chatHandler: InitialStateType, authContext: UserContext, action: Dispatch<any> }) => {
  const [text, setText] = useState('');
  const {user, setUser} = useAuthContext()
  const router = useRouter()
  const userId = authContext.id
  const roomMessages = chatHandler.messagesByRoomId[roomId]

  function myMessage (message: MessageType) {
    return message.user?.id === userId
  }
  
  function belongsToRoom() {
    const rooms = chatHandler.roomsById
    if (roomId in rooms) {
      
      const room: RoomType = rooms[roomId]
      const roomMembersIds = room.members.map(member => member.id)
      return roomMembersIds.includes(userId) 

    }
    return false
  }

  async function handleLeaveRoom() {
    const request = await leaveRoom(authContext.access_token,roomId)
    if (request.status_code === 401) {
      setUser(emptyContext)
      router.push('/')
    }
    if (request.status_code === 200) {
      const rooms = request.data
      action({
        type: "LEAVE_ROOM",
        payload: {
          roomId,
          rooms: [rooms]
        }
      })
    }
  }

  async function handleJoinRoom() {
    const request = await joinRoom(authContext.access_token,roomId)
    if (request.status_code === 401) {
      setUser(emptyContext)
      router.push('/')
    }

    if (request.status_code === 200) {
      const rooms = request.data
      action({
        type: "JOIN_ROOM",
        payload: {
          roomId,
          rooms: [rooms]
        }
      })
    }
  }

  const handleSendMessage = async () => {
  
    const payload = {
      message: text,
      token: user.access_token,
      roomId
    }

    const request =await sendMessage(payload)
    if (request.status_code === 401) {
      setUser(emptyContext)
      router.push('/')
    }
  }

  let content;

  const body = (
    roomMessages?.map((message: MessageType) => (
      <div
        key={message.id}
        className={`flex w-full mt-2 space-x-3 max-w-xs ${myMessage(message) ? 'ml-auto justify-end' : ''
          }`}
      >
        { !myMessage(message) && (
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
        )}
        <div>
          <div
            className={`p-3 rounded-lg ${myMessage(message)
              ? 'bg-blue-600 text-white rounded-l-lg rounded-br-lg'
              : 'bg-gray-300 rounded-r-lg rounded-bl-lg'
              }`}
          >
            <p className="text-sm">{message.content}</p>
          </div>
          <span className="text-xs text-gray-500 leading-none">
            {dateFormatter(message.created_at)}
          </span>
        </div>
        {myMessage(message) && (
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
        )}
      </div>
    ))
  )

  if (!belongsToRoom()) {
    content = (<div>
        <p>You do not belong in this channel</p>
        <button onClick={handleJoinRoom} className='btn bg-blue-400 hover:bg-blue-500 p-2 rounded-sm text-white px-3'>Click Here To Join</button>
      </div>)

  } else if(belongsToRoom() && roomMessages.length < 1) {
    content = <p>No messeges found</p>
  } else {
    content = body
  }




  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-100 text-gray-800">
      {belongsToRoom()&&(<button onClick={handleLeaveRoom} className='btn bg-red-400 top-3 right-5 absolute rounded-sm px-3 py-2 text-white hover:bg-red-500'>Leave Room</button>)}
      <p>{user.email}</p>
      <div className="flex flex-col flex-grow w-full bg-white shadow-xl overflow-hidden pt-8">
        <div className="flex flex-col flex-grow h-0 p-4 overflow-auto">
          { content }
        </div>
        {belongsToRoom() && (<div className="bg-gray-300 flex items-center gap-2 p-4">
          <InputEmoji
            value={text}
            onChange={setText}
            cleanOnEnter
            onEnter={handleSendMessage}
            background='transparent'
            shouldReturn={true}
            shouldConvertEmojiToImage={false}
            placeholder="Type a message"
          />
          <button onClick={handleSendMessage} className='p-2 rounded-full bg-black text-white bg-opacity-50'>
            <ArrowUp size={'18px'} />
          </button>
        </div>)}
      </div>
    </div>
  );
};

export default CustomerChat;
