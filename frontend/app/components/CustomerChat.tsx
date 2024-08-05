'use client'
import React, { useEffect, useState } from 'react';
import InputEmoji from "react-input-emoji";
import { ArrowUp } from 'lucide-react'
import { roomMessages } from '../data';



const CustomerChat = ({ roomId }: { roomId: string }) => {
  const [text, setText] = useState('');

// Mocking fetch for chat rooms 
useEffect(() => {

},[roomId])


  const messageToDisplay = roomMessages.find((room) => room.id === roomId)?.messages || [];

  const content = messageToDisplay.length < 1 ? <p>No messeges found</p> : (
    messageToDisplay?.map((message) => (
      <div
        key={message.id}
        className={`flex w-full mt-2 space-x-3 max-w-xs ${message.sentByMe ? 'ml-auto justify-end' : ''
          }`}
      >
        {!message.sentByMe && (
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
        )}
        <div>
          <div
            className={`p-3 rounded-lg ${message.sentByMe
              ? 'bg-blue-600 text-white rounded-l-lg rounded-br-lg'
              : 'bg-gray-300 rounded-r-lg rounded-bl-lg'
              }`}
          >
            <p className="text-sm">{message.text}</p>
          </div>
          <span className="text-xs text-gray-500 leading-none">
            2 min ago
          </span>
        </div>
        {message.sentByMe && (
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
        )}
      </div>
    ))
  )

  const handleOnEnter = () => {
    console.log('ssubmitted');
  }


  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-100 text-gray-800">
      <div className="flex flex-col flex-grow w-full bg-white shadow-xl overflow-hidden">
        <div className="flex flex-col flex-grow h-0 p-4 overflow-auto">
          { content }
        </div>
        <div className="bg-gray-300 flex items-center gap-2 p-4">
          <InputEmoji
            value={text}
            onChange={setText}
            cleanOnEnter
            onEnter={handleOnEnter}
            background='transparent'
            shouldReturn={true}
            shouldConvertEmojiToImage={false}
            placeholder="Type a message"
          />
          <button className='p-2 rounded-full bg-black text-white bg-opacity-50'>
            <ArrowUp size={'18px'} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerChat;
