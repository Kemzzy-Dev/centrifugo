import { Room } from '../modules/user/entities/room.entity';
import Message from '../modules/user/entities/message.entity';
import { User } from '../modules/user/entities/user.entity';

export function MessageSerializer(message: Message) {
  
  const data = {
    id: message.id,
    content: message.content,
    created_at: message.created_at,
    user: {
      id: message.user.id,
      firstName: message.user.first_name,
      lastName: message.user.last_name,
      email: message.user.email,
    },
    room: {
      id: message.room.id,
      name: message.room.name,
      last_message: Serializemessage(message.room.last_message),
    },
  };
  return data;
}

function Serializemessage(message: Message) {
  const response = {
    id: message?.id,
    content: message?.content,
    created_at: message?.created_at,
  };
  return response;
}

function SerializeMember(member: User) {
  const response = {
    id: member?.id,
    firstName: member?.first_name,
    lastName: member?.last_name,
    email: member?.email,
  }
  return response;
}

export function RoomSerializer(room: Room) {
  return {
    id: room.id,
    name: room.name,
    last_message: room.last_message ? Serializemessage(room.last_message): {},
    messages: room.messages.map(message => Serializemessage(message)),
    members: room.members.map(member => SerializeMember(member))
  }
}