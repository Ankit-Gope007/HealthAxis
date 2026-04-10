"use client";

import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export const useSocket = () => {
  const [connected, setConnected] = useState(false);
  const [socketInstance, setSocketInstance] = useState<Socket | null>(socket);

  useEffect(() => {
    let currentSocket: Socket | null = null;

    const handleConnect = () => {
      console.log("Socket connected");
      setConnected(true);
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
      setConnected(false);
    };

    const setupSocket = async () => {
      try {
        // Initialize the Next.js API route so Socket.IO is attached to the HTTP server.
        await fetch("/api/socket");
      } catch (error) {
        console.error("Failed to initialize socket API route:", error);
      }

      if (!socket) {
        socket = io({
          path: "/api/socket",
          addTrailingSlash: false,
          autoConnect: false,
        });
      }

      currentSocket = socket;
      setSocketInstance(currentSocket);

      currentSocket.on("connect", handleConnect);
      currentSocket.on("disconnect", handleDisconnect);

      if (!currentSocket.connected) {
        currentSocket.connect();
      } else {
        setConnected(true);
      }
    };

    void setupSocket();

    return () => {
      if (currentSocket) {
        currentSocket.off("connect", handleConnect);
        currentSocket.off("disconnect", handleDisconnect);
      }
    };
  }, []);

  return { socket: socketInstance, connected };
};
