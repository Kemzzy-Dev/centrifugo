import { Body, Controller, Get, HttpCode, Param, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import RoomService from './room.service';


@ApiTags('Rooms')
@Controller('')
export class RoomController {
    constructor(private roomService: RoomService) {}

    @Post('room')
    @ApiOperation({ summary: 'Create room' })
    @ApiResponse({ status: 200, description: 'Room created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @HttpCode(200)
    async message(@Body() body: { title: string; version: number }): Promise<any> {
      
      return this.roomService.createRoom(body);
    }

    @Post('rooms/:room_id/message')
    @ApiOperation({ summary: 'Send Message' })
    @ApiResponse({ status: 200, description: 'Message sent successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @HttpCode(200)
    async sendMessage(
      @Body() body: { message: string },
      @Param('room_id') roomId: string,
      @Req() request: Request
    ): Promise<any> {
      const userId = request['user'].sub;
      console.log('Request received :=>  ', { body, roomId });
      return this.roomService.createMessage({ roomId, userId, content: body.message });
    }
  
    @Post('rooms/:room_id/join')
    @ApiOperation({ summary: 'Join room' })
    @ApiResponse({ status: 200, description: 'Room joined successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @HttpCode(200)
    async joinRoom(@Param('room_id') roomId: string, @Req() request: Request): Promise<any> {
      const userId = request['user'].sub;
      return this.roomService.addUserToRoom({ roomId, userId });
    }
  
    @Post('rooms/:room_id/leave')
    @ApiOperation({ summary: 'Leave room' })
    @ApiResponse({ status: 200, description: 'Leave room' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @HttpCode(200)
    async leaveRoom(@Param('room_id') roomId: string, @Req() request: Request): Promise<any> {
      const userId = request['user'].sub;
      return this.roomService.removeUserFromRoom({ userId, roomId });
    }
  
    @Get('rooms')
    @ApiOperation({ summary: 'List rooms' })
    @ApiResponse({ status: 200, description: 'Operation successful' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @HttpCode(200)
    async listRooms(): Promise<any> {
      return this.roomService.getAllRooms();
    }
  
    @Get('rooms/:id')
    @ApiOperation({ summary: 'Get room details' })
    @ApiResponse({ status: 200, description: 'Room detail fetched successful',})
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @HttpCode(200)
    async getRoomDetail(
      @Param('id') roomId: string
    ) {
      return this.roomService.getRoom(roomId);
    }
}