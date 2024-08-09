import { Module } from '@nestjs/common';
import RegistrationController from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import appConfig from '../../../config/auth.config';
import { Repository } from 'typeorm';
import AuthenticationService from './auth.service';
import UserService from '../user/user.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { GoogleAuthService } from './google-auth.service';
import Message from '../user/entities/message.entity';
import { Room } from '../user/entities/room.entity';
import { BroadcastService } from '../user/broadcast.service';
import RoomService from './room.service';
import { RoomController } from './room.controller';


@Module({
  controllers: [RegistrationController,RoomController],
  providers: [AuthenticationService, Repository, UserService, GoogleStrategy, GoogleAuthService, BroadcastService, RoomService],
  imports: [
    TypeOrmModule.forFeature([User, Message, Room,]),
    PassportModule,
    JwtModule.register({
      global: true,
      secret: appConfig().jwtSecret,
      signOptions: { expiresIn: `${appConfig().jwtExpiry}s` },
    }),
  ],
  exports: [],
})
export class AuthModule {}




