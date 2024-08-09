import {
    HttpStatus,
    Injectable,
    UnauthorizedException,
    BadRequestException,
    InternalServerErrorException,
    ForbiddenException,
    HttpException,
  } from '@nestjs/common';
  import * as bcrypt from 'bcrypt'
  import {
    FAILED_TO_CREATE_USER,
    USER_ACCOUNT_EXIST,
    USER_CREATED_SUCCESSFULLY,
    INVALID_CREDENTIALS,
    LOGIN_SUCCESSFUL,
    LOGIN_ERROR,
  } from '../../helpers/SystemMessages';
  import { JwtService } from '@nestjs/jwt';
  import { LoginResponseDto } from './dto/login-response.dto';
  import { CreateUserDTO } from './dto/create-user.dto';
  import UserService from '../user/user.service';
  import { LoginDto } from './dto/login.dto';
  import CustomExceptionHandler from '../../helpers/exceptionHandler';
  import authConfig from '../../../config/auth.config';
  
  @Injectable()
  export default class RoomService {
    constructor(
      private userService: UserService,
      private jwtService: JwtService
    ) {}

  
    public async createRoom(body: { title: string; version: number }) {
      const response = await this.userService.createRoom(body);
      return {status_code: HttpStatus.CREATED,message: "Room created successfully", data:response }
    }
  
    public async getAllRooms() {
      const payload = {
        status_code: 200,
        data: await this.userService.getAllRooms(),
      };
      return payload;
    }
  
    public async getRoom(roomId: string) {
      return await this.userService.getRoom(roomId);
    }
  
    public async addUserToRoom(addUserToRoomOptions: { userId: string; roomId: string }) {
      try {
        return await this.userService.addUserToRoom({...addUserToRoomOptions});
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException('Error occured');
      }
    }
  
    public async removeUserFromRoom(removeUserFromRoomPayload: { userId: string; roomId: string }) {
      try {
        return await this.userService.removeUserFromRoom(removeUserFromRoomPayload);
        
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException('Error occured');
      }
    }
  
    public async createMessage(createMessageOption: { userId: string; roomId: string; content: string }) {
      try {
        return await this.userService.createMessage(createMessageOption);
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException('Error occured');
      }
    }
  }
  