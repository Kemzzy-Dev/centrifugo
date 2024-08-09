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

}
