"use client";

import { useAuth } from "@/lib/store/use-auth";
import { AuthenticatedEvent, ExceptionEvent } from '@/lib/types/chat';
import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
  isAuthenticated: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  isAuthenticated: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { accessToken } = useAuth();

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!;
    const chatNamespaceUrl = `${backendUrl}/chat`;

    const socketInstance = io(chatNamespaceUrl, {
      auth: {
        token: accessToken,
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketInstance.on('connect', () => {
      console.log('[Socket] Connected to chat server:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('authenticated', (data: AuthenticatedEvent) => {
      console.log('[Socket] Authenticated successfully');
      console.log('[Socket] Pending messages:', data.pendingMessages);
      setIsAuthenticated(true);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
      setIsConnected(false);
      setIsAuthenticated(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error.message);
      setIsConnected(false);
      setIsAuthenticated(false);
    });

    socketInstance.on('exception', (error: ExceptionEvent) => {
      console.error('[Socket] Exception:', error.message);
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(() => socketInstance);

    return () => {
      socketInstance.disconnect();
      setSocket(null);
      setIsConnected(false);
      setIsAuthenticated(false);
    };
  }, [accessToken]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, isAuthenticated }}>
      {children}
    </SocketContext.Provider>
  );
};
