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
  sendMessage,
} from "@/actions";
import { reducer } from "@/actions/SocketManager";
import { RoomType, InitialStateType } from "@/lib/types";
import { Centrifuge, SubscriptionState } from "centrifuge";
import appConfig from "@/config/appConfig";


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
  const [roomId, setRoomId] = useState('');
  const { user, setUser } = useAuthContext();
  const router = useRouter();
  const [realTimeStatus, setRealTimeStatus] = useState("🔴");

  const [messageQueue, setMessageQueue] = useState<any[]>([]);
  const [chatStateHandler, dispatch] = useReducer(reducer, initialChatState);
  const session = sessionStorage.getItem("Joined");
  const roomMessages = chatStateHandler.messagesByRoomId[roomId];


  useEffect(() => {
    setRoomId(searchParams.roomId)
  }, [])

  function belongsToRoom() {
    const rooms = chatStateHandler.roomsById;
    if (roomId in rooms) {
      const room: RoomType = rooms[roomId];
      const roomMembersIds = room.members.map((member) => member.id);
      return roomMembersIds.includes(user.id);
    }
    return false;
  }

  const handleSendMessage = async () => {
    console.log(text);
    const payload = {
      message: text,
      token: user.access_token,
      roomId,
    };

    const request =await sendMessage(payload)
    if (request.status_code === 401) {
      setUser(emptyContext)
      router.push('/')
    }
  };

  const oddLayout = mockUsers.length % 2 !== 0;
  const evenLayout = mockUsers.length % 2 === 0;

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
      return "";
    }
    if (request.status_code !== 200) {
      throw new Error("Error occured");
    }
    return request.token;
  };

  useEffect(() => {
    if (messageQueue.length === 0) {
      return;
    }

    const MessageProcessor = new SocketManager();

    async function processMessage() {
      const message = messageQueue[0];

      const { type, body } = message;

      switch (type) {
        case "message_added": {
          MessageProcessor.processNewMessage(body);
          break;
        }

        case "user_joined": {
          MessageProcessor.processUserJoined(body);
          break;
        }

        case "user_left": {
          MessageProcessor.processUserLeft(body);
          break;
        }
        default:
          console.log("Invalid message type");
      }

      setMessageQueue((prev) => prev.slice(1));
    }

    processMessage();
  }, [messageQueue, chatStateHandler]);


  useEffect(() => {
    let centrifuge: Centrifuge | null = null;
    const init = async () => {
      centrifuge = new Centrifuge(`${appConfig.socketUrl}`, {
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
        console.log(ctx.transport);
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
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `${appConfig.socketUrl}/bingo/join-game/${searchParams.roomId}`
      );

      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    }

    console.log(`${appConfig.socketUrl}/join-game/${searchParams.roomId}`);
  };

  return (
    <main className="flex flex-col min-h-screen pt-[90px] bg-primary">
      <GameCustomizeNavBar
        isCopied={isCopied}
        handleShareGameLink={handleShareGameLink}
      />
      <section className="md:px-20 min-h-[400px] flex flex-col justify-center  px-4">
        {oddLayout && <OddLayout content="" />}
        {/* {evenLayout && <EvenLayout />} */}
        {roomMessages?.map((message) => (
            <p key={message.id}>
                {message.content}
            </p>
        ))}
      </section>
      <div className="flex w-full justify-center">
        <div className="flex fixed md:border-none border border-black bottom-6 w-[80%] md:w-[40%] items-center gap-1g md:p-4">
          <InputEmoji
            value={text}
            onChange={setText}
            cleanOnEnter
            onEnter={handleSendMessage}
            borderColor="black"
            background="transparent"
            shouldReturn={true}
            shouldConvertEmojiToImage={false}
            placeholder="Type a message"
          />
          <button
            onClick={handleSendMessage}
            className="md:p-2 p-1 rounded-full bg-black text-white bg-opacity-50"
          >
            <ArrowUp size={"16px"} />
          </button>
        </div>
      </div>
    </main>
  );
};

export default GameRoom;
