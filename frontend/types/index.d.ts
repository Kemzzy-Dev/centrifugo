export type RoomType = {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    version: number;
    bumpedAt: number;
    members: UserType[];
    messages: MessageType[];
  };
  
  export type MessageType = {
    id: string;
    created_at: string;
    updated_at: string;
    content: string;
    user?: UserType;
  };
  
  export type UserType = {
    id: string;
    created_at: string;
    updated_at: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  };
  
  export type InitialStateType = {
    rooms: RoomType[];
    roomsById: Record<string, RoomType>;
    messagesByRoomId: Record<string, MessageType[]>;
  };
  
export interface SendMessagePayload {
    message: string
    token: string
    roomId: string
}