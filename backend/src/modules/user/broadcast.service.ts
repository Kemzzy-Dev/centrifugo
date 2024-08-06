import { Injectable, Logger } from '@nestjs/common';

import authConfig from 'config/auth.config';

@Injectable()
export class BroadcastService {
  private readonly logger = new Logger(BroadcastService.name);
  private readonly centrifugoApiUrl = authConfig().centrifugo.apiUrl;
  private readonly centrifugoApiKey = authConfig().centrifugo.apiKey;

  async broadcastRoom(roomId: string, broadcastPayload: any): Promise<void> {
    const url = `${this.centrifugoApiUrl}/broadcast`;
    try {
      const request = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.centrifugoApiKey,
          'X-Centrifugo-Error-Mode': 'transport',
        },
        body: JSON.stringify(broadcastPayload),
      });
      const response = await request.json();
      console.log(response.result)
      console.log("broadcast complete")
      this.logger.log(`Broadcast to room ${roomId} successful, response: `);
    } catch (error) {
      console.log('Error: ', error);
      this.logger.error(`Failed to broadcast to room ${roomId}`, error.message);
    }
  }
}
