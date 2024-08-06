import { RoomType } from "@/lib/types";
import { sortString } from "@/lib/utils";
import { MessageType } from "@/types";

interface RoomsById {
  [key: string]: RoomType;
}


interface MessagesByRoomsById {
  [key: string]: MessageType[];
}


type IntialStateType = {
  rooms: RoomType[],
  roomsById: any,
  messagesByRoomId: any
}

const initialChatState: IntialStateType  = {
    rooms: [],
    roomsById: {},
    messagesByRoomId: {}
  };

export function reducer(state: any, action: any) {
    switch (action.type) {
      case 'CLEAR_CHAT_STATE': {
        return initialChatState;
      }

      case 'LEAVE_ROOM': {
    
        const payload: RoomType = action.payload.rooms[0];
        const rooms: RoomType[] = state.rooms
        const updatedRooms: RoomType[] =  rooms.map(room => {
          if (room.id === payload.id) {
            return payload
          }
          return room;
        });

        const messagesByRoomId = updatedRooms.reduce<MessagesByRoomsById>((acc, room: RoomType) => {
          const messages = [...room.messages]
          messages.reverse()
          acc[room.id] = messages;
          return acc;
        }, {});

        const roomsById = updatedRooms.reduce<RoomsById>((acc, room: RoomType) => {
          acc[room.id] = room;
          return acc;
        }, {});
  
  
        return {
          messagesByRoomId,
          roomsById,
          rooms,
        };
      }
      

      case 'JOIN_ROOM': {
        const payload: RoomType = action.payload.rooms[0];
        const rooms: RoomType[] = state.rooms
        const updatedRooms: RoomType[] =  rooms.map(room => {
          if (room.id === payload.id) {
            return payload
          }
          return room;
        });

        const messagesByRoomId = updatedRooms.reduce<MessagesByRoomsById>((acc, room: RoomType) => {
          const messages = [...room.messages]
          messages.reverse()
          acc[room.id] = messages;
          return acc;
        }, {});

        const roomsById = updatedRooms.reduce<RoomsById>((acc, room: RoomType) => {
          acc[room.id] = room;
          return acc;
        }, {});
  
  
        return {
          messagesByRoomId,
          roomsById,
          rooms,
        };
      }

      case 'SET_ROOMS': {
        const newRooms: RoomType[] = action.payload.rooms;

  
        // Update roomsById with new rooms, avoiding duplicates.
        const updatedRoomsById = { ...state.roomsById };
        
        newRooms.forEach((room: RoomType) => {
          if (!updatedRoomsById[room.id]) {
            updatedRoomsById[room.id] = room;
          }
        });
        
        
        return {
          ...state,
          roomsById: updatedRoomsById,
          rooms: newRooms
        };
      }

      case 'INSTANTIATE_MESSAGES': {
        const rooms: RoomType[] = action.payload.rooms;
        const messagesByRoomId = rooms.reduce<MessagesByRoomsById>((acc, room: RoomType) => {
          const messages = [...room.messages]
          messages.reverse()
          acc[room.id] = messages;
          return acc;
        }, {});

        const roomsById = rooms.reduce<RoomsById>((acc, room: RoomType) => {
          acc[room.id] = room;
          return acc;
        }, {});

        return {
          messagesByRoomId,
          roomsById,
          rooms,
        };
        
      }



      case 'ADD_MESSAGES': {
        const roomId = action.payload.roomId;
        const newMessages = action.payload.messages;

        let currentMessages = state.messagesByRoomId[roomId] || [];
     
        const combinedMessages = [...currentMessages, ...newMessages].filter(
          (message, index, self) =>
            index === self.findIndex(m => m.created_at === message.created_at)
        );
                 
  
        return {
          ...state,
          messagesByRoomId:
          {
            ...state.messagesByRoomId,
            [roomId]: combinedMessages
          },
          roomsById: state.roomsById,
          rooms: state.rooms,
        };
      }

      case 'SET_ROOM_MEMBER_COUNT': {
        const { roomId, version, memberCount } = action.payload;
  
        // Check if the roomId exists in roomsById.
        if (!state.roomsById[roomId]) {
          console.error(`Room with ID ${roomId} not found.`);
          return state;
        }
  
        // Check if the version in the event is greater than the version in the room object.
        if (version <= state.roomsById[roomId].version) {
          console.error(`Outdated version for room ID ${roomId}.`);
          return state;
        }
  
        // Update the member_count and version of the specified room.
        const updatedRoom = {
          ...state.roomsById[roomId],
          member_count: memberCount,
          version: version,
        };
  
        // Return the new state with the updated roomsById.
        return {
          ...state,
          roomsById: {
            ...state.roomsById,
            [roomId]: updatedRoom,
          },
        };
      }

      default:
        return state;
    }
  }
  