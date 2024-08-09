"use client";
import React, { useEffect, useState, useReducer } from "react";
import PlayerComponent from "../components/PlayerComponent";
import InputEmoji from "react-input-emoji";
import { ArrowUp } from "lucide-react";
import GameCustomizeNavBar from "../components/GameCustomizeNavBar";
import { useRouter } from "next/navigation";
import { mockUsers } from "../components/asset/mockUser";
import OddLayout from "../components/OddLayout";
import EvenLayout from "../components/EvenLayout";
import AuthContext, {
  useAuthContext,
  emptyContext,
} from "@/context/AuthContext";
import {
  getCentrifugeToken,
  getChannelSubscriptionToken,
  getRooms,
  getWebsocketUrl,
  joinRoom,
  leaveRoom,
  sendMessage,
} from "@/actions";
import { reducer } from "@/actions/SocketManager";
import { RoomType, InitialStateType, MessageType } from "@/lib/types";
import { Centrifuge, SubscriptionState } from "centrifuge";
import appConfig from "@/config/appConfig";
import { dateFormatter } from "@/lib/utils";



const initialChatState: InitialStateType = {
  rooms: [],
  roomsById: {},
  messagesByRoomId: {},
};

interface messageType {
  message: string;
  userId: string;
  roomId: string;
  created_at: string;
}

const GameRoom = ({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) => {
  const [text, setText] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [roomId, setRoomId] = useState(searchParams.roomId);
  const { user, setUser } = useAuthContext();
  const router = useRouter();
  const [realTimeStatus, setRealTimeStatus] = useState("🔴");

  const [messageQueue, setMessageQueue] = useState<any[]>([]);
  const [chatStateHandler, dispatch] = useReducer(reducer, initialChatState);
  const roomMessages = chatStateHandler.messagesByRoomId[roomId];
  const room = chatStateHandler.roomsById[roomId];
  const [messageBubbles, setMessageBubbles] = useState<{ [userId: string]: boolean }>({});

  const showMessageBubble = (userId: string) => {
    setMessageBubbles({ ...messageBubbles, [userId]: true });
    setTimeout(() => {
        setMessageBubbles({ ...messageBubbles, [userId]: false });
    }, 10000); // Hide after 10 seconds
}

  function myMessage (message: MessageType) {
    return message.user?.id === user.id;
  }

  function belongsToRoom() {
    const rooms = chatStateHandler.roomsById;
    if (roomId in rooms) {
      const room: RoomType = rooms[roomId];
      const roomMembersIds = room.members.map((member) => member.id);
      return roomMembersIds.includes(user.id);
    }
    return false;
  }

  async function handleLeaveRoom() {
    const request = await leaveRoom(user.access_token,roomId)
    if (request.status_code === 401) {
      setUser(emptyContext)
      router.push('/create-game-room')
    }
    if (request.status_code === 200) {
      const rooms = request.data
      dispatch({
        type: "LEAVE_ROOM",
        payload: {
          roomId,
          rooms: [rooms]
        }
      })
    }
  }

  async function handleJoinRoom() {
    const request = await joinRoom(user.access_token,roomId)
    if (request.status_code === 401) {
      setUser(emptyContext)
      router.push('/')
    }

    if (request.status_code === 200) {
      const rooms = request.data
      dispatch({
        type: "JOIN_ROOM",
        payload: {
          roomId,
          rooms: [rooms]
        }
      })
    }
  }

  const handleSendMessage = async () => {
    console.log(text);
    const payload = {
      message: text,
      token: user.access_token,
      roomId,
    };
    setText("")

    const request =await sendMessage(payload)
    if (request.status_code === 401) {
      setUser(emptyContext)
      router.push('/')
    }
  };

  useEffect(() => {
    setRoomId(searchParams.roomId)
  }, []);
  

  function onPublication(publication: any) {
    const response = publication;
    console.log(response);
    // response.body = JSON.parse(response.body)

    setMessageQueue((prev) => [...prev, response]);
  }

  const getToken = async () => {
    const request = await getCentrifugeToken(user.access_token);
    if (request.status_code === 401) {
      setUser(emptyContext);
      router.push('/')
    }
    if (request.status_code !== 200) {
      throw new Error("Error occured");
    }
    console.log(request)
    return request.token;
  };

  useEffect(() => {
    if (messageQueue.length === 0) {
      return;
    }

    class SocketManager {
        public async processUserJoined(body: any) {
          dispatch({
            type: "JOIN_ROOM",
            payload: {
              roomId,
              rooms: [body],
            },
          });
        }
    
        public async processUserLeft(body: any) {
          dispatch({
            type: "LEAVE_ROOM",
            payload: {
              roomId,
              rooms: [body],
            },
          });
        }
    
        public async processNewMessage(body: any) {
          dispatch({
            type: "ADD_MESSAGES",
            payload: {
              roomId,
              messages: [body],
            },
          });
        }
      }

    const MessageProcessor = new SocketManager();

    async function processMessage() {
      const message = messageQueue[0];

      const { type, body } = message;

      switch (type) {
        case "message_added": {
          MessageProcessor.processNewMessage(body);
          showMessageBubble(body.user.id);
          break;
        }

        case "user_joined": {
          MessageProcessor.processUserJoined(body);
          break;
        }

        case "user_left": {
          MessageProcessor.processUserLeft(body);
        }
        default:
          console.log("Invalid message type");
      }

      setMessageQueue((prev) => prev.slice(1));
    }

    processMessage();
  }, [messageQueue, chatStateHandler, roomId, showMessageBubble]);

  useEffect( () => {
    let centrifuge: Centrifuge | null = null;
    
    const init = async () => {
      const socketUrl = (await getWebsocketUrl()) as string
      centrifuge = new Centrifuge(socketUrl, {
        debug: true,
        getToken: getToken,
      });

      const roomsRequest = await getRooms(user.access_token);
      console.log(roomsRequest)
      if (roomsRequest.status_code === 401) {
        setUser(emptyContext);
        router.push("/");
        return;
      }

      const rooms: RoomType[] = roomsRequest.data;
      dispatch({
        type: "INSTANTIATE_MESSAGES",
        payload: {
          rooms: rooms,
        },
      });

      centrifuge!.connect();

      const personalChannel = "personal:" + user.email;

      async function getPersonalChannelSubscriptionToken() {
        return await getChannelSubscriptionToken({
          channelTitle: personalChannel,
          token: user.access_token,
        });
      }

      const subscription = centrifuge!.newSubscription(personalChannel, {
        getToken: getPersonalChannelSubscriptionToken,
      });

      subscription.on("state", (ctx) => {
        console.log(ctx.newState);
        if (ctx.newState == SubscriptionState.Subscribed) {
          setRealTimeStatus("🟢");
        } else {
          setRealTimeStatus("🔴");
        }
      });
      centrifuge!.on("connecting", (ctx) => {
        console.log(ctx.code);
        console.log(ctx.reason);
      });

      centrifuge!.on("connected", (ctx) => {
        console.log("Web socket connected",ctx.transport);
      });

      subscription.on("publication", (ctx) => {
        console.log("new publication");
        onPublication(ctx.data);
      });

      subscription.subscribe();
    };
    init();
    return () => {
      if (centrifuge) {
        console.log("Centrifuge disconnected");
        centrifuge?.disconnect();
      }
    };
  }, []);
  

  // handleShowMenu, handleGoBack, handleShareGameLink, handleHowToPlayClick
  const handleShareGameLink = () => {
    setIsCopied(true);
    const returnToUrl = `${window.location.origin}/bingo/join-game/${searchParams.roomId}`
    if (navigator.clipboard) {
      navigator.clipboard.writeText(returnToUrl);

      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    }
  };

  const renderMembers = () => {
    const rooms = chatStateHandler.roomsById;
    if (roomId in rooms) {
        const room: RoomType = rooms[roomId];
        return room.members.map((member, index) => {
            const latestMessage = roomMessages.filter((msg: any) => msg.user?.id === member.id).pop()?.content; // Find latest message
            return (
                <div key={member.id} className={`flex flex-col items-center w-1/2 ${index % 2 === 0 ? 'mr-auto' : 'ml-auto'}`}>
                    <div className="flex-shrink-0 h-20 w-20 rounded-full bg-gray-300 mb-2"></div> 
                    <p>{member.first_name}</p>
                    <span className="ml-2">{realTimeStatus}</span>
                    {messageBubbles[member.id] && latestMessage && ( // Check if latestMessage exists
                        <div className="bg-blue-500 text-white p-2 rounded-lg mt-2">
                            {latestMessage} 
                        </div>
                    )}
                </div>
            )
        });
    }
    return null;
};


  return (
    <main className="flex flex-col min-h-screen pt-[90px] bg-primary relative">
      <GameCustomizeNavBar
        isCopied={isCopied}
        handleShareGameLink={handleShareGameLink}
      />

      <div className="flex flex-col flex-grow w-full bg-yellow-100 shadow-xl overflow-hidden pt-8">
        <div className="flex flex-row flex-wrap justify-around mb-4">
          {" "}
        
          {renderMembers()}
        </div>
        {belongsToRoom() && (
            
          <div className="bg-white-300 flex items-center gap-2 p-4 sticky bottom-0">
            <InputEmoji
              value={text}
              onChange={setText}
              cleanOnEnter
              onEnter={handleSendMessage}
              background="transparent"
              shouldReturn={true}
              shouldConvertEmojiToImage={false}
              placeholder="Type a message"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 rounded-full bg-black text-white bg-opacity-50"
            >
              <ArrowUp size={"18px"} />
            </button>
            <div className="absolute top-20 right-52"> {/* Position the buttons in the top right corner */}
            <button onClick={handleLeaveRoom} className='btn bg-red-400 rounded-sm px-3 py-2 text-white hover:bg-red-500'>Leave Game</button> {/* Leave Game button */}
            
          </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default GameRoom;
