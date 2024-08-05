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

      case 'ADD_ROOMS': {
        const newRooms = action.payload.rooms;
  
        // Update roomsById with new rooms, avoiding duplicates.
        const updatedRoomsById = { ...state.roomsById };
        newRooms.forEach((room: any) => {
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


      case 'DELETE_ROOM': {
        const roomId = action.payload.roomId;
  
        // Set the specified room to null instead of deleting it.
        const newRoomsById = {
          ...state.roomsById,
          [roomId]: null // On delete we set roomId to null. This allows to sync membership state of rooms on ChatSearch screen.
        };
  
        // Remove the room from the rooms array.
        const newRooms = state.rooms.filter((id: any) => id !== roomId);
  
        // Remove associated messages.
        const { [roomId]: deletedMessages, ...newMessagesByRoomId } = state.messagesByRoomId;
  
        return {
          ...state,
          roomsById: newRoomsById,
          rooms: newRooms,
          messagesByRoomId: newMessagesByRoomId
        };
      }

      case 'INSTANTIATE_MESSAGES': {
        const rooms: RoomType[] = action.payload.rooms;
        const messagesByRoomId = rooms.reduce<MessagesByRoomsById>((acc, room: RoomType) => {
          acc[room.id] = room.messages;
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

        const combinedMessages = [...currentMessages, ...newMessages]
        console.log(combinedMessages)
        // Combine current and new messages, then filter out duplicates.
        // const combinedMessages = [...currentMessages, ...newMessages].filter(
        //   (message, index, self) =>
        //     index === self.findIndex(m => m.id === message.id)
        // );
          
        // console.log("Combined: ",combinedMessages)
        // // Sort the combined messages by id in ascending order.
        // combinedMessages.sort((a, b) => a.id - b.id);
  
        // // Find the message with the highest ID.
        // const maxMessageId = combinedMessages.length > 0 ? combinedMessages[combinedMessages.length - 1].id : null;
  
        // let needSort = false;
  
        // // Update the roomsById object with the new last_message if necessary.
        // const updatedRoomsById = { ...state.roomsById };
        // // if (maxMessageId !== null && updatedRoomsById[roomId] && (!updatedRoomsById[roomId].last_message || maxMessageId > updatedRoomsById[roomId].last_message.id)) {
        // //   const newLastMessage = combinedMessages.find(message => message.id === maxMessageId);
        // //   updatedRoomsById[roomId].last_message = newLastMessage;
        // //   updatedRoomsById[roomId].bumped_at = newLastMessage.room.bumped_at;
        // //   needSort = true;
        // // }
  
        // let updatedRooms = [...state.rooms];
        
  
        return {
          ...state,
          messagesByRoomId: {
            ...state.messagesByRoomId,
            [roomId]: combinedMessages
          },
          roomsById: [],
          rooms: state.updatedRooms,
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
  