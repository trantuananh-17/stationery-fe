import { io } from 'socket.io-client';

export const notificationSocket = io('http://localhost:3411/notifications', {
  autoConnect: false
});
