export type RoomType = {
    id: string
    created_at: string
    updated_at: string
    name: string
    version: 1,
    bumpedAt: 0,
    members: UserType[]
    messages: MessageType[]
    }

export interface SendMessagePayload {
    message: string
    token: string
    roomId: string
}


export type IntialStateType = {
    rooms: RoomType[],
    roomsById: any,
    messagesByRoomId: any
}

export type MessageType = {
    id: string
    created_at: string
    updated_at: string
    content: string
    user?: UserType
}

export type UserType = {
    id: string
    created_at: string
    updated_at: string
    first_name: string
    last_name: string
    email: string
    password: string
}


export interface messageType {
    message: string,
    userId: string,
    roomId: string
    created_at: string
  }