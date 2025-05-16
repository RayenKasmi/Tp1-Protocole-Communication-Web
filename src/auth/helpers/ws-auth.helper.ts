import { ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';
import { WsJwtGuard } from '../guards/ws-jwt.guard';

export class WsAuthHelper {
  /**
   * Authenticates a WebSocket connection using the WsJwtGuard
   * @param guard The WsJwtGuard instance
   * @param client The Socket client
   * @returns A promise that resolves to the authenticated user or null if authentication fails
   */
  static async authenticateConnection(
    guard: WsJwtGuard, 
    client: Socket
  ): Promise<any> {
    try {
      // Create a mock execution context that wraps the client
      const mockExecutionContext = {
        switchToWs: () => ({
          getClient: () => client,
        }),
      } as ExecutionContext;

      // Use the guard to authenticate the connection
      const isAuthenticated = await guard.canActivate(mockExecutionContext);
      
      // If authentication succeeds, the guard will have attached the user to the client
      return isAuthenticated ? client.data.user : null;
    } catch (error) {
      return null;
    }
  }
}
