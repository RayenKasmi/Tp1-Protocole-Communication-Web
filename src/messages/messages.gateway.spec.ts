// messages.gateway.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { MessagesGateway } from './messages.gateway';
import { MessagesService } from './messages.service';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';
import { Socket } from 'socket.io';
import { SendMessageDto } from './dto/send-message.dto';
import { PayloadInterface } from '../auth/strategies/jwt.strategy';
import { WsException } from '@nestjs/websockets';

describe('MessagesGateway', () => {
  let gateway: MessagesGateway;
  let messagesService: MessagesService;
  let wsJwtGuard: WsJwtGuard;

  const mockMessagesService = {
    sendMessage: jest.fn(),
  };

  const mockWsJwtGuard = {
    canActivate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesGateway,
        { provide: MessagesService, useValue: mockMessagesService },
        { provide: WsJwtGuard, useValue: mockWsJwtGuard },
      ],
    }).compile();

    gateway = module.get<MessagesGateway>(MessagesGateway);
    messagesService = module.get<MessagesService>(MessagesService);
    wsJwtGuard = module.get<WsJwtGuard>(WsJwtGuard);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should authenticate and store connected user', async () => {
      // Mock client socket
      const mockClient = {
        data: {},
        handshake: {
          auth: { token: 'valid-token' },
        },
        emit: jest.fn(),
        disconnect: jest.fn(),
      } as unknown as Socket;

      // Mock the authentication helper (via a spy)
      const mockUser = { username: 'testuser' } as PayloadInterface;
      jest.spyOn(gateway as any, 'disconnect');
      jest.spyOn(require('../auth/helpers/ws-auth.helper').WsAuthHelper, 'authenticateConnection')
        .mockResolvedValueOnce(mockUser);

      // Call handleConnection
      await gateway.handleConnection(mockClient);

      // Verify the user was stored
      expect(gateway['users'].has('testuser')).toBeTruthy();
      expect(gateway['users'].get('testuser')).toBe(mockClient);
    });

    it('should disconnect if authentication fails', async () => {
      // Mock client socket
      const mockClient = {
        data: {},
        handshake: {
          auth: { token: 'invalid-token' },
        },
        emit: jest.fn(),
        disconnect: jest.fn(),
      } as unknown as Socket;

      // Mock the authentication helper to fail
      jest.spyOn(require('../auth/helpers/ws-auth.helper').WsAuthHelper, 'authenticateConnection')
        .mockResolvedValueOnce(null);
      jest.spyOn(gateway as any, 'disconnect');

      // Call handleConnection
      await gateway.handleConnection(mockClient);

      // Verify disconnect was called
      expect(gateway['disconnect']).toHaveBeenCalledWith(mockClient, 'Authentication failed');
    });
  });

  describe('onSendMessage', () => {
    it('should send a message and notify the recipient', async () => {
      // Create test data
      const mockUser = { username: 'sender' } as PayloadInterface;
      const dto: SendMessageDto = { 
        receiverUsername: 'receiver', 
        content: 'Hello!' 
      };
      const mockClient = {
        emit: jest.fn(),
      } as unknown as Socket;
      const mockReceiverSocket = {
        emit: jest.fn(),
      } as unknown as Socket;
      
      // Create mock message result
      const mockMessage = {
        id: 1,
        content: 'Hello!',
        sender: { username: 'sender' },
        receiver: { username: 'receiver' },
      };
      
      // Setup mocks and spies
      messagesService.sendMessage = jest.fn().mockResolvedValue(mockMessage);
      gateway['users'] = new Map();
      gateway['users'].set('receiver', mockReceiverSocket as Socket);
      
      // Call the method
      const result = await gateway.onSendMessage(dto, mockClient, mockUser);
      
      // Verify the message was sent
      expect(messagesService.sendMessage).toHaveBeenCalledWith('sender', dto);
      
      // Verify the sender got a confirmation
      expect(mockClient.emit).toHaveBeenCalledWith('message_sent', {
        success: true,
        messageId: 1,
      });
      
      // Verify the receiver got the message
      expect(mockReceiverSocket.emit).toHaveBeenCalledWith('receive_message', mockMessage);
      
      // Verify the result
      expect(result).toEqual({ success: true });
    });
    
    it('should handle errors when sending messages', async () => {
      // Setup
      const mockUser = { username: 'sender' } as PayloadInterface;
      const dto: SendMessageDto = { 
        receiverUsername: 'receiver', 
        content: 'Hello!' 
      };
      const mockClient = {
        emit: jest.fn(),
      } as unknown as Socket;
      
      // Make the service throw an error
      const error = new Error('Test error');
      messagesService.sendMessage = jest.fn().mockRejectedValue(error);
      
      // Spy on logger to avoid console errors in tests
      jest.spyOn(gateway['logger'], 'error').mockImplementation();
      
      // Call and expect exception
      await expect(gateway.onSendMessage(dto, mockClient, mockUser))
        .rejects.toThrow(WsException);
    });
  });
});
