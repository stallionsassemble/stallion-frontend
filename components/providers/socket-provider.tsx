"use client";

import { useAuth } from "@/lib/store/use-auth";
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { accessToken } = useAuth();

  useEffect(() => {
    if (!accessToken) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Initialize Socket
    // Connecting to /chat Namespace on default path /socket.io
    // relying on Query Params for Auth to avoid CORS preflight issues with custom headers.
    const socketInstance = io(`${process.env.NEXT_PUBLIC_BACKEND_URL!}/chat`, {
      addTrailingSlash: false,
      transports: ["polling", "websocket"],
      // Auth via Query Params
      auth: {
        token: `Bearer ${accessToken}`,
      },
      query: {
        token: `Bearer ${accessToken}`,
        access_token: `Bearer ${accessToken}`,
        authorization: `Bearer ${accessToken}`,
      }
    });

    socketInstance.on("connect", () => {
      console.log("[Socket] Connected:", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected:", reason);
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("[Socket] Connection Error:", err.message);
      console.error("[Socket] Error Details:", err);
      // @ts-ignore
      if (err.data) console.error("[Socket] Error Data:", err.data);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [accessToken]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
