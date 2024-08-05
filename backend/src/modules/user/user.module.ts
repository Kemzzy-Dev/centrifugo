import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import UserService from './user.service';
import Message from './entities/message.entity';
import { Room } from './entities/room.entity';
import { BroadcastService } from './broadcast.service';

@Module({
  controllers: [],
  providers: [UserService, Repository, BroadcastService],
  imports: [TypeOrmModule.forFeature([User, Room, Message])],
  exports: [UserService],
})
export class UserModule {}
