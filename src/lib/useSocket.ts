"use client";

import { useEffect, useState } from "react";
iimport io from "socket.io-client";

let socket: ReturnType<typeof io> | null = null;
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
