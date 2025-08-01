"use client";

import { useEffect, useState } from "react";
import io, { Socket as SocketType } from "socket.io-client";

let socket: SocketType | null = null;

export const useSocket = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!socket) {
      socket = io({
        path: "/api/socket",
      });
    }

    socket.on("connect", () => {
      console.log("Socket connected");
      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setConnected(false);
    });

    return () => {
      socket?.disconnect();
    };
  }, []);

  return { socket, connected };
};
