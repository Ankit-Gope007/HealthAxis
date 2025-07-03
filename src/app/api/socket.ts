// /pages/api/socket.ts (for Next.js Pages Router)
import { Server as HTTPServer } from "http";
import { Server as IOServer } from "socket.io";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Server as NetServer } from "http";
import type { Socket as NetSocket } from "net";
import {prisma} from "@/src/lib/prisma"; // Adjust the import path as needed

export const config = {
  api: {
    bodyParser: false,
  },
};

// Extend NextApiResponse to attach Socket.IO server
interface SocketServer extends NetServer {
  io?: IOServer;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (!res.socket.server.io) {
    console.log("🟢 Setting up new Socket.io server...");
    const io = new IOServer(res.socket.server as HTTPServer, {
      path: "/api/socket",
      addTrailingSlash: false,
    });

    io.on("connection", (socket) => {
      console.log("✅ New client connected:", socket.id);

      socket.on("joinRoom", ({ appointmentId }) => {
        console.log(`👥 Socket ${socket.id} joined room ${appointmentId}`);
        socket.join(appointmentId);
      });

      socket.on("sendMessage", async (msgData) => {
        // Save to DB
        await prisma.message.create({
          data: {
            content: msgData.content,
            senderId: msgData.senderId,
            receiverId: msgData.receiverId,
            appointmentId: msgData.appointmentId,
          },
        });

        io.to(msgData.appointmentId).emit("newMessage", msgData);
      });

      socket.on("disconnect", () => {
        console.log(`❌ Socket ${socket.id} disconnected`);
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("✅ Reusing existing Socket.io server");
  }

  res.end();
}