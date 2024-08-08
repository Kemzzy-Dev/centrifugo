import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, HttpCode, Param, Post, Req } from '@nestjs/common';

import { CreateUserDTO } from './dto/create-user.dto';
import { skipAuth } from '../../helpers/skipAuth';
import AuthenticationService from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';

import { ErrorCreateUserResponse, SuccessCreateUserResponse } from '../user/dto/user-response.dto';

@ApiTags('Authentication')
@Controller('')
export default class RegistrationController {
  constructor(private authService: AuthenticationService) {}

  @skipAuth()
  @ApiOperation({ summary: 'User Registration' })
  @ApiResponse({ status: 201, description: 'Register a new user', type: SuccessCreateUserResponse })
  @ApiResponse({ status: 400, description: 'Bad request', type: ErrorCreateUserResponse })
  @Post('auth/register')
  @HttpCode(201)
  public async register(@Body() body: CreateUserDTO): Promise<any> {
    return this.authService.createNewUser(body);
  }

  @skipAuth()
  @Post('auth/login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'Login successful', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto | { status_code: number; message: string }> {
    return this.authService.loginUser(loginDto);
  }

  @Post('room')
  @ApiOperation({ summary: 'Create room' })
  @ApiResponse({ status: 200, description: 'Login successful', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(200)
  async message(@Body() body: { title: string; version: number }): Promise<any> {
    return this.authService.createRoom(body);
  }

  @Get('token')
  async getToken(@Req() request: Request) {
    const user = request['user'];
    return await this.authService.getCentrifugoJWT(user.email);
  }

  @Get('subscription/token/:channelId/:identifier')
  async getPersonalizedToken(@Param() params, @Req() request: Request) {
    const user = request['user'];
    const { channelId, identifier } = params;
    const channel = `${channelId}:${identifier}`;
    return await this.authService.generatePersonalizedToken({ channel, user });
  }

  @Post('rooms/:room_id/message')
  @ApiOperation({ summary: 'Send Message' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(200)
  async sendMessage(
    @Body() body: { message: string },
    @Param('room_id') roomId: string,
    @Req() request: Request
  ): Promise<any> {
    const userId = request['user'].sub;
    console.log('Request received :=>  ', { body, roomId });
    return this.authService.createMessage({ roomId, userId, content: body.message });
  }

  @Post('rooms/:room_id/join')
  @ApiOperation({ summary: 'Join room' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(200)
  async joinRoom(@Param('room_id') roomId: string, @Req() request: Request): Promise<any> {
    const userId = request['user'].sub;
    return this.authService.addUserToRoom({ roomId, userId });
  }

  @Post('rooms/:room_id/leave')
  @ApiOperation({ summary: 'Leave room' })
  @ApiResponse({ status: 200, description: 'Leave room', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(200)
  async leaveRoom(@Param('room_id') roomId: string, @Req() request: Request): Promise<any> {
    const userId = request['user'].sub;
    return this.authService.removeUserFromRoom({userId,roomId});
  }

  @Get('rooms')
  @ApiOperation({ summary: 'List rooms' })
  @ApiResponse({ status: 200, description: 'Operation successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(200)
  async listRooms(): Promise<any> {
    return this.authService.getAllRooms();
  }

  @Get('rooms/:id')
  @ApiOperation({ summary: 'Get room details' })
  @ApiResponse({ status: 200, description: 'Login successful', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(200)
  async getRoomDetail(
    @Body() loginDto: LoginDto
  ): Promise<LoginResponseDto | { status_code: number; message: string }> {
    return this.authService.loginUser(loginDto);
  }
}
