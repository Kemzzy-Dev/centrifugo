'use client'
import { useEffect, useReducer, useState } from "react";
import CustomerChat from "../components/CustomerChat";
import { roomMessages } from "../data";
import { reducer } from "@/actions/SocketManager";
import { emptyContext, useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getCentrifugeToken, getChannelSubscriptionToken, getRooms } from "@/actions";
import { Centrifuge, SubscriptionState } from "centrifuge";
import appConfig from "@/config/appConfig";
import { RoomType,InitialStateType } from "@/lib/types";


const initialChatState: InitialStateType = {
  rooms: [],
  roomsById: {},
  messagesByRoomId: {}
};



export default function ChatRoom() {
  const [roomId, setRoomId] = useState('1');
  const { user, setUser } = useAuthContext()
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const router = useRouter()
  const [realTimeStatus, setRealTimeStatus] = useState('🔴')
  const [activeTab, setActiveTab] = useState('allRooms');
  const [rooms, setRooms] = useState<RoomType[]>([])
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageQueue, setMessageQueue] = useState<any[]>([])
  const [chatStateHandler, dispatch] = useReducer(reducer,initialChatState)
  
  class SocketManager {
    public async processUserJoined(body: any) {}

    public async processUserLeft(body: any) {}

    public async processNewMessage(body: any) {

    }
  }

  function onPublication(publication: any) {
    setMessageQueue((prev) => [...prev, publication])
  }

  const getToken = async () => {
    const request = await getCentrifugeToken(user.access_token)
    if (request.status_code === 401) {
        setUser(emptyContext)
        return ""
    }  
    if (request.status_code !== 200) {
        throw new Error('Error occured')
    }
    return request.token
  }

  useEffect(() => {
    
  })


  useEffect(() => {
    if (messageQueue.length === 0) {return}

    const MessageProcessor = new SocketManager()

    async function processMessage() {
      console.log(messageQueue)
      const message = messageQueue[0]
      const { type, body} = message[0]
      
      switch (type) {
        case 'message_added': {
          MessageProcessor.processNewMessage(body)
          break
        }

        case 'user_joined': {
          MessageProcessor.processUserJoined(body)
          break
        };

        case 'user_left': {
          MessageProcessor.processUserLeft(body)
          break
        };
        default: console.log("Invalid message type")
      }

      setMessageQueue(prev => prev.slice(1))
    }

    processMessage()

  },[messageQueue,chatStateHandler])


  useEffect(() => {
        
    let centrifuge: Centrifuge | null = null
    const init = async () => {
        centrifuge = new Centrifuge(`ws://${appConfig.socketUrl}`,{
            debug: true,
            getToken: getToken
        })

        const rooms = await getRooms(user.access_token)
        console.log(user.access_token)
        console.log(rooms)
        dispatch({
          type: "SET_ROOM",
          payload: {
            room: rooms
          }
        })
    }
        init()

        centrifuge!.connect()

        const personalChannel = "personal:"+ user.email
        async function getPersonalChannelSubscriptionToken() {
            return await getChannelSubscriptionToken({channelTitle:personalChannel, token: user.access_token})
        }

        const subscription = centrifuge!.newSubscription(personalChannel,{
            getToken: getPersonalChannelSubscriptionToken
        })


        subscription.on('state',(ctx) => {
            console.log(ctx.newState)
            if (ctx.newState == SubscriptionState.Subscribed) {
                setRealTimeStatus("🟢")
            } else {
                setRealTimeStatus('🔴')
            }
        })
        centrifuge!.on('connecting',(ctx) => {
            console.log(ctx.code)
            console.log(ctx.reason)
        })

        centrifuge!.on('connected',(ctx) => {
            console.log(ctx.transport)
        })

        subscription.on('publication',(ctx) => {
          console.log("new publication")
          onPublication(ctx.data)
        })


        subscription.subscribe()
        

    return () => {
        if (centrifuge){
            console.log("Centrifuge disconnected")
            centrifuge?.disconnect()
        }
    }

},[])



  return (
    <main className=" flex items-center w-screen min-h-screen">
      <div className="w-[30%] bg-gray-200 h-screen p-4 border-r border-gray-300">
        <h2 className="text-lg font-semibold mb-4">Chat Rooms</h2>
        <ul>
          {chatStateHandler.rooms.map((room: RoomType) => (
            <li
              onClick={() => setRoomId(room.id)}
              key={room.id}
              className="p-2 cursor-pointer hover:bg-gray-300 rounded"
            >
              {room.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full">
        <CustomerChat roomId={roomId} />
      </div>
    </main>
  );
}
