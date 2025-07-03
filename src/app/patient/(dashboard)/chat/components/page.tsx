// "use client";

// import { useEffect, useState } from "react";
// import { useSocket } from "@/src/lib/useSocket";
// import axios from "axios";

// export default function Chat({ appointmentId, currentUserId, receiverId }) {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const socket = useSocket();

//   useEffect(() => {
//     socket.emit("joinRoom", appointmentId);

//     socket.on("newMessage", (msg) => {
//       setMessages((prev) => [...prev, msg]);
//     });

//     return () => {
//       socket.off("newMessage");
//     };
//   }, [appointmentId]);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       const res = await axios.get(`/api/messages?appointmentId=${appointmentId}`);
//       setMessages(res.data);
//     };

//     fetchMessages();
//   }, [appointmentId]);

//   const handleSendMessage = () => {
//     socket.emit("sendMessage", {
//       appointmentId,
//       senderId: currentUserId,
//       receiverId,
//       content: newMessage,
//     });
//     setNewMessage("");
//   };

//   return (
//     <div className='w-full lg:w-[90%] lg:ml-14 h-[100vh] bg-[#F9FAFC] '>
//       <div className="space-y-2">
//         {messages.map((msg) => (
//           <div key={msg.id} className={`text-sm ${msg.senderId === currentUserId ? "text-right" : "text-left"}`}>
//             <span className="inline-block bg-gray-200 px-2 py-1 rounded">{msg.content}</span>
//           </div>
//         ))}
//       </div>
//       <div className="mt-2 flex gap-2">
//         <input
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           className="border px-2 py-1 rounded flex-1"
//           placeholder="Type your message..."
//         />
//         <button onClick={handleSendMessage} className="bg-green-500 text-white px-3 py-1 rounded">
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }