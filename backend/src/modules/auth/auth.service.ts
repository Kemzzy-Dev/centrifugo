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
export default class AuthenticationService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async createNewUser(creatUserDto: CreateUserDTO) {
    try {
      const userExists = await this.userService.getUserRecord({
        identifier: creatUserDto.email,
        identifierType: 'email',
      });

      if (userExists) {
        throw new BadRequestException({
          status_code: HttpStatus.BAD_REQUEST,
          message: USER_ACCOUNT_EXIST,
        });
      }

      await this.userService.createUser(creatUserDto);

      const user = await this.userService.getUserRecord({ identifier: creatUserDto.email, identifierType: 'email' });

      if (!user) {
        throw new BadRequestException({
          status_code: HttpStatus.BAD_REQUEST,
          message: FAILED_TO_CREATE_USER,
        });
      }

      const responsePayload = {
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          created_at: user.created_at,
        },
      };

      return {
        status_code: HttpStatus.CREATED,
        message: USER_CREATED_SUCCESSFULLY,
        data: responsePayload,
      };
    } catch (createNewUserError) {
      console.log('AuthenticationServiceError ~ createNewUserError ~', createNewUserError);
      CustomExceptionHandler(createNewUserError);
      throw new InternalServerErrorException('Error occured creating user');
    }
  }

  async generateCentrifugoJWT(userId: string) {
    const expiry = new Date().getSeconds() + 300;
    const payload = { sub: userId };
    const token = this.jwtService.sign(payload, { secret: authConfig().centrifugo.secret });
    return token;
  }

  async getCentrifugoJWT(userId: string) {
    const token = await this.generateCentrifugoJWT(userId);
    return {
      status_code: HttpStatus.OK,
      token,
    };
  }

  async generatePersonalizedToken({ channel, user }: { channel: string; user: any }) {
    if (channel !== `personal:${user.email}`) {
      throw new ForbiddenException("You don't have access to this channel");
    }
    const payload = {
      sub: user.email,
      channel,
    };
    const token = this.jwtService.sign(payload, { secret: authConfig().centrifugo.secret });
    return {
      status_code: HttpStatus.OK,
      token,
    };
  }

  async loginUser(loginDto: LoginDto): Promise<LoginResponseDto | { status_code: number; message: string }> {
    try {
      const { email, password } = loginDto;

      const user = await this.userService.getUserRecord({
        identifier: email,
        identifierType: 'email',
      });

      if (!user) {
        throw new UnauthorizedException({
          status_code: HttpStatus.UNAUTHORIZED,
          message: INVALID_CREDENTIALS,
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new UnauthorizedException({
          status_code: HttpStatus.UNAUTHORIZED,
          message: INVALID_CREDENTIALS,
        });
      }

      const access_token = this.jwtService.sign({ username: user.first_name, sub: user.id, email: user.email });

      const responsePayload = {
        access_token,

        status_code: HttpStatus.OK,
        data: {
          user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
          },
        },
      };

      return { message: LOGIN_SUCCESSFUL, ...responsePayload };
    } catch (error) {
      console.log('AuthenticationServiceError ~ loginError ~', error);
      CustomExceptionHandler(error);
      throw new InternalServerErrorException({
        message: LOGIN_ERROR,
        status_code: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  public async createRoom(body: { title: string; version: number }) {
    return await this.userService.createRoom(body);
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
      // return await this.userService.createMessage({...addUserToRoomOptions,content: "hi there"});
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
