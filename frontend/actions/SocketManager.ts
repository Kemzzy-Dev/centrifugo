import { RoomType } from "@/lib/types";
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

// const initialChatState: InitialStateType = {
//   rooms: [],
//   roomsById: {},
//   messagesByRoomId: {}
// };
  

// export function reducer(state: InitialStateType = initialChatState, action: any) {
//   switch (action.type) {
//     case 'CREATE_ROOM': {
//       const room: RoomType = action.payload.room;
//       return {
//         ...state,
//         rooms: [room],
//         roomsById: { [room.id]: room },
//         messagesByRoomId: { [room.id]: [] },
//       };
//     }

//     case 'JOIN_ROOM': {
//       const { roomId, user }: { roomId: string; user: UserType } = action.payload;
//       if (!state.roomsById[roomId]) return state;

//       const updatedRoom = {
//         ...state.roomsById[roomId],
//         members: [...state.roomsById[roomId].members, user],
//       };

//       return {
//         ...state,
//         roomsById: {
//           ...state.roomsById,
//           [roomId]: updatedRoom,
//         },
//       };
//     }

//     case 'LEAVE_ROOM': {
//       const { roomId, userId }: { roomId: string; userId: string } = action.payload;
//       if (!state.roomsById[roomId]) return state;

//       const updatedRoom = {
//         ...state.roomsById[roomId],
//         members: state.roomsById[roomId].members.filter(member => member.id !== userId),
//       };

//       return {
//         ...state,
//         roomsById: {
//           ...state.roomsById,
//           [roomId]: updatedRoom,
//         },
//       };
//     }

//     case 'ADD_MESSAGE': {
//       const { roomId, message }: { roomId: string; message: MessageType } = action.payload;
//       if (!state.roomsById[roomId]) return state;

//       return {
//         ...state,
//         messagesByRoomId: {
//           ...state.messagesByRoomId,
//           [roomId]: [...state.messagesByRoomId[roomId], message],
//         },
//       };
//     }

//     case 'DELETE_ROOM': {
//       const { roomId, userId }: { roomId: string; userId: string } = action.payload;
//       const room = state.roomsById[roomId];

//       if (!room || room.members[0].id !== userId) {
//         console.error("Only the room creator can delete the room.");
//         return state;
//       }

//       return initialChatState;
//     }

//     // case 'INSTANTIATE_MESSAGES': {
//     //   const room: RoomType = action.payload.room;
      
//     //   // Initialize messages for the room and reverse them for chronological order.
//     //   const messages = [...room?.messages].reverse();
      
//     //   // Initialize the state with a single room.
//     //   const roomsById: RoomsById = { [room.id]: room };
//     //   const messagesByRoomId: MessagesByRoomsById = { [room.id]: messages };
      
//     //   return {
//     //     rooms: [room],
//     //     roomsById,
//     //     messagesByRoomId,
//     //   };
//     // }
    

//     case 'SET_ROOM_MEMBER_COUNT': {
//       const { roomId, version, memberCount }: { roomId: string; version: number; memberCount: number } = action.payload;
  
//       // Check if the roomId exists in roomsById.
//       if (!state.roomsById[roomId]) {
//         console.error(`Room with ID ${roomId} not found.`);
//         return state;
//       }
  
//       // Check if the version in the event is greater than the version in the room object.
//       if (version <= state.roomsById[roomId].version) {
//         console.error(`Outdated version for room ID ${roomId}.`);
//         return state;
//       }
  
//       // Update the member count and version of the specified room.
//       const updatedRoom = {
//         ...state.roomsById[roomId],
//         members: state.roomsById[roomId].members.slice(0, memberCount), // Adjusting the number of members
//         version: version,
//       };
  
//       // Return the new state with the updated roomsById.
//       return {
//         ...state,
//         roomsById: {
//           ...state.roomsById,
//           [roomId]: updatedRoom,
//         },
//       };
//     }

//     default:
//       return state;
//   }
// }
