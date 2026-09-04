import { io } from 'socket.io-client';

export const notificationSocket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/notifications`, {
  autoConnect: false
});
