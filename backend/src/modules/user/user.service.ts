import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import UserResponseDTO from './dto/user-response.dto';
import { User } from './entities/user.entity';
import CreateNewUserOptions from './options/CreateNewUserOptions';
import UpdateUserRecordOption from './options/UpdateUserRecordOption';
import UserIdentifierOptionsType from './options/UserIdentifierOptions';
import { Room } from './entities/room.entity';
import Message from './entities/message.entity';
import { BroadcastService } from './broadcast.service';
import { MessageSerializer, RoomSerializer } from 'src/utils/serializer';
import { isValidUUID, subscribeUserId } from 'src/helpers/validate-uuid';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Room)
    private roomRepository: Repository<Room>,

    @InjectRepository(Message)
    private messageRepository: Repository<Message>,

    private broadcastService: BroadcastService
  ) {}

  async createUser(createUserPayload: CreateNewUserOptions): Promise<any> {
    const newUser = new User();
    Object.assign(newUser, createUserPayload);
    return await this.userRepository.save(newUser);
  }

  async updateUserRecord(userUpdateOptions: UpdateUserRecordOption) {
    const { updatePayload, identifierOptions } = userUpdateOptions;
    const user = await this.getUserRecord(identifierOptions);
    Object.assign(user, updatePayload);
    await this.userRepository.save(user);
  }

  private async getUserByEmail(email: string) {
    const user: UserResponseDTO = await this.userRepository.findOne({
      where: { email: email },
      relations: ['rooms'],
    });
    return user;
  }

  private async getUserById(identifier: string) {
    const user = await this.userRepository.findOne({
      where: { id: identifier },
      relations: ['rooms'],
    });
    return user;
  }

  async getUserRecord(identifierOptions: UserIdentifierOptionsType) {
    const { identifier, identifierType } = identifierOptions;

    const GetRecord = {
      id: async () => this.getUserById(String(identifier)),
      email: async () => this.getUserByEmail(String(identifier)),
    };

    return await GetRecord[identifierType]();
  }

  public async createRoom(body: { title: string; version: number }) {
    try {
      const newRoom = new Room();
      newRoom.name = body.title;
      newRoom.bumpedAt = 0;
      newRoom.version = body.version;
      return await this.roomRepository.save(newRoom);
    } catch (error) {
      console.log(error);
    }
  }

  public async getAllRooms() {
    return await this.roomRepository.find({ relations: ['members', 'messages.user', 'messages'] });
  }

  public async getRoom(id: string) {
    return await this.roomRepository.findOne({
      where: { id },
      relations: ['messages', 'messages.user', 'members', 'members.rooms'],
    });
  }

  public async addUserToRoom({ userId, roomId }: { userId: string; roomId: string }) {
    if(!isValidUUID(roomId)) {
      return {
        status_code: 400,
        message: 'Invalid room identifier',
        
      };
    }
    const currentRoom = await this.getRoom(roomId);
    if (!currentRoom) {
      return {
        status_code: 400,
        message: 'Invalid room identifier',
        
      };
    }

    const newMember = await this.getUserById(userId);
    const roomMembers = currentRoom.members;
    
    if (roomMembers.map(member => member.id).includes(newMember.id)) {
      const channels = await this.getRoomMembers(roomId);
      console.log(channels)
      const broadcastPayload = {
        channels: channels,
        data: {
          type: 'user_joined',
          body: JSON.stringify(RoomSerializer(currentRoom)),
        },
        idempotency_key: `user_joined_${newMember.id}`,
      };
  
      await this.broadcastService.broadcastRoom(roomId, broadcastPayload);
  
      return {
        status_code: 200,
        message: 'Request successful',
        data: currentRoom,
      };
    }

    currentRoom.members = [...roomMembers, newMember];
    const room = await this.roomRepository.save(currentRoom);
    const channels = await this.getRoomMembers(roomId);
    
    const broadcastPayload = {
      channels: channels,
      data: {
        type: 'user_joined',
        body: JSON.stringify(RoomSerializer(room)),
      },
      idempotency_key: `user_joined_${newMember.id}`,
    };

    await this.broadcastService.broadcastRoom(roomId, broadcastPayload);

    return {
      status_code: 200,
      message: 'Request successful',
      data: room,
    };
  }

  public async removeUserFromRoom({ userId, roomId }: { userId: string; roomId: string }) {
    if(!isValidUUID(roomId)) {
      return {
        status_code: 400,
        message: 'Invalid room identifier',
        
      };
    }
    const currentRoom = await this.getRoom(roomId);
    if (!currentRoom) {
      return {
        status_code: 400,
        message: 'Invalid room identifier',   
      };
    }
    const initChannels = await this.getRoomMembers(roomId);
    const leavingMember = await this.getUserById(userId);
    const updatedMembers = currentRoom.members.filter(member => member.id !== leavingMember.id);
    currentRoom.members = updatedMembers;
    const room = await this.roomRepository.save(currentRoom);
    const newSub = `personal:${leavingMember.email}`
    const channels = initChannels.includes(newSub) ? [...initChannels] : [...initChannels,newSub]
    
    const broadcastPayload = {
      channels: channels,
      data: {
        type: 'user_left',
        body: JSON.stringify(RoomSerializer(room)),
      },
      idempotency_key: `user_left_${leavingMember.email}`,
    };

    await this.broadcastService.broadcastRoom(roomId, broadcastPayload);
    
    return {
      status_code: 200,
      message: 'Request successful',
      data: room,
    };
  }

  public async getRoomMembers(roomId: string) {
    const members = (await this.getRoom(roomId)).members
    console.log("Members ",members)
    const result = members.map(member => `personal:${member.email}`);
    return result;
  }

  public async createMessage({ userId, roomId, content }: { userId: string; roomId: string; content: string }) {
    try {
      const user = await this.getUserById(userId);
      const room = await this.getRoom(roomId);
      const channels = await this.getRoomMembers(roomId);
      const message = new Message();
      message.content = content;
      message.user = user;
      message.room = room;
      const newMessage = await this.messageRepository.save(message);
      room.last_message = newMessage;
      room.messages = [...room.messages, newMessage];
      await this.roomRepository.save(room);
      console.log(channels)
      const broadcastPayload = {
        channels: channels,
        data: {
          type: 'message_added',
          body: MessageSerializer(newMessage),
        },
        idempotency_key: `messsage_${newMessage.id}`,
      };
      try {
        await this.broadcastService.broadcastRoom(roomId, broadcastPayload);
      } catch (error) {
        console.log("CreateMessage: ",error)
      }

      return {
        status_code: 200,
        message: 'Request successful',
        data: 'newMessage',
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error has occured');
    }
  }
}
