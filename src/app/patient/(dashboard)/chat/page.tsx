"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoIosSend } from "react-icons/io";
import {
    Search,
    Phone,
    Video,
    MoreVertical,
    Paperclip,
    Plus
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { usePatientProfileStore } from "@/src/store/usePatientProfileStore";
import { useSocket } from "@/src/lib/useSocket";
import { useRef } from "react";
 import { useCallback } from "react";


type AppointmentDoctorData = {

    id: string;
    patientId: string;
    doctorId: string;
    date: string;
    timeSlot: string;
    reason?: string;
    status: string
    location: string

    // Relations
    doctor: {
        id: string;
        email?: string;
        doctorProfile: {
            fullName: string;
            specialization: string;
            imageUrl?: string | "";
            phone?: string;
            address?: string;
        }
    }

    patient?: {
        id: string;
        name: string;
    };

}

    type NewMessageEvent ={
      id?: string;
      senderId: string;
      receiverId: string;
      content: string;
      createdAt?: string;
    }

// type Message = {
//     id: number;
//     sender: "doctor" | "patient";
//     content: string;
//     time: string;
//     avatar?: string;
//     isFile?: boolean;
// };

// type MessagePayload = {
//     appointmentId: string;
//     senderId: string;
//     receiverId: string;
//     content: string;
// };

const Chat = () => {
    const [selectedChat, setSelectedChat] = useState(null as string | null);
    const [message, setMessage] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState("");
    const [messages, setMessages] = useState<any[]>([]);
    // const [showVideoCall, setShowVideoCall] = useState(false);
    // const [showFileAttachment, setShowFileAttachment] = useState(false);
    const [loading, setLoading] = useState(false);
    const { profile } = usePatientProfileStore(); // Assuming you have a store for patient profile
    const [appointmentsData, setAppointmentsData] = useState<AppointmentDoctorData[]>([]);
    const [appointmentLoading, setappointmentLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    const { socket } = useSocket(); // Custom hook to manage socket connection

 

    const selectedConversation = appointmentsData.find(c => c.id === selectedChat);
    const filteredConversations = appointmentsData.filter(conv =>
        conv.doctor.doctorProfile.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.doctor.doctorProfile.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        if (profile && profile.patientId) {
            fetchAppointments(profile.patientId);
        } else {
            console.warn("Profile or patientId not available yet");
        }


    }, [profile]);



    // Get all the previous messages that are already stored in the database
   

    const fetchMessages = useCallback(async (appointmentId: string) => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/messages/getMessages?appointmentId=${appointmentId}`);
            console.log("Fetching messages for appointment ID:", appointmentId);
            console.log("Response data:", response.data);
            if (response.status === 200) {
                const fetchedMessages = response.data.map((msg: any) => ({
                    id: msg.id,
                    sender: msg.senderId === selectedConversation?.patientId ? 'patient' : 'doctor',
                    content: msg.content,
                    time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    avatar: msg.senderId === selectedConversation?.patientId ? profile?.imageUrl : selectedConversation?.doctor.doctorProfile.imageUrl,
                }));
                setMessages(fetchedMessages);
                setLoading(false);
            } else {
                console.error("Failed to fetch messages:", response.statusText);
                setLoading(false);
            }
    
        } catch (error) {
            console.error("Error fetching messages:", error);
            toast.error("Failed to fetch messages");
    
        }
    }, [selectedConversation, profile?.imageUrl]);
    
    useEffect(() => {
        if (!socket || !selectedConversation) return;
    
        socket.emit("joinRoom", { appointmentId: selectedConversation.id });

        socket.on("newMessage", (msg: NewMessageEvent) => {
            const timeString = msg.createdAt
                ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    
            const newMsg = {
                id: msg.id ?? Date.now(),
                sender: msg.senderId === selectedConversation?.patientId ? "patient" : "doctor",
                content: msg.content,
                time: timeString,
                avatar: msg.senderId === selectedConversation?.patientId
                    ? profile?.imageUrl
                    : selectedConversation?.doctor?.doctorProfile?.imageUrl || profile?.imageUrl || "",
            };
    
            setMessages((prev) => [...prev, newMsg]);
        });
    
        fetchMessages(selectedConversation.id);
    
        return () => {
            socket.off("newMessage");
        };
    }, [socket, selectedConversation, fetchMessages, profile?.imageUrl]);
    
    const fetchAppointments = async (id: string) => {
        try {
            setappointmentLoading(true);
            console.log("Fetching appointments for patient ID:", id);
            const response = await axios.get(`/api/appointment/getAllForPatient?patientId=${id}`);
            if (response.status === 200) {
                console.log("Appointments fetched successfully:", response.data);
                setAppointmentsData(response.data);
                setappointmentLoading(false);
            } else {
                console.error("Failed to fetch appointments:", response.statusText);
               setappointmentLoading(false);
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
            setappointmentLoading(false);
        }
    };
    
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);



    const handleSendMessage = () => {
        if (!message.trim() || !socket || !selectedConversation) return;

        const msgData = {
            appointmentId: selectedConversation.id,
            senderId: selectedConversation.patientId,
            receiverId: selectedConversation.doctorId,
            content: message.trim(),
        };

        socket.emit("sendMessage", msgData);

        // You can still add optimistic update if you want, or just rely on the server push
        // setMessages(prev => [...prev, ...]);

        setMessage("");
    };


    const handleVoiceCall = () => {
        toast("Voice call feature is not implemented yet.");
    };

    const handleVideoCall = () => {
        toast("Video call feature is not implemented yet.");
        // setShowVideoCall(true);
    };

    // const handleSendFile = (files: File[]) => {
    //     files.forEach(file => {
    //         const newMessage = {
    //             id: messages.length + 1,
    //             sender: "patient" as const,
    //             content: `📎 Sent file: ${file.name}`,
    //             time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    //             isFile: true
    //         };
    //         setMessages(prev => [...prev, newMessage]);
    //     });

    //     toast.success("File(s) sent successfully!");
    // };

    const handleNewChat = () => {
        toast("To start a new chat, please have an conformed appointment \n with a doctor from the list.");
    };

    const chatListData = filteredConversations.filter((conversation) => conversation.status === "CONFIRMED");

    return (
        <>
            <div className='w-full lg:w-[90%] lg:ml-14 h-[100vh] bg-[#F9FAFC] md:flex'>
                {/* Chat List */}
                <Toaster position="top-right" reverseOrder={false} />
                <div className="w-full md:w-1/3 bg-white border-r flex flex-col">
                    <div className="p-2 border-b">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
                            <Button size="sm" onClick={handleNewChat} className="h-5 w-5 health-green">
                                <Plus className="h-2 w-2" />
                            </Button>
                        </div>
                        <div className="relative">
                            <Search className="absolute  left-3 top-0.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search conversations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-5"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {   
                        appointmentLoading ? (
                            <div className="h-full w-full center">
                                <div className="loading-animation h-10 w-10"></div>
                            </div>
                        )
                        
                        :
                        chatListData.filter((conversation) => conversation.status == "CONFIRMED").map((conversation) => (
                            <div
                                key={conversation.id}
                                onClick={() => setSelectedChat(conversation.id)}
                                className={`p-1 border-b cursor-pointer hover:bg-gray-50 transition-colors ${selectedChat === conversation.id ? 'bg-green-50 border-r-2 border-r-green-500' : ''
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={conversation.doctor.doctorProfile.imageUrl} />
                                            <AvatarFallback className="bg-health-100 text-health-700">
                                                {conversation.doctor.doctorProfile.fullName.split(" ").map(n => n[0]).join("")}
                                            </AvatarFallback>
                                        </Avatar>

                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center w-full justify-between">
                                            <h3 className="font-medium text-gray-900 truncate">{conversation.doctor.doctorProfile.fullName}</h3>
                                            {/* <span className="text-xs text-muted-foreground">{conversation.time}</span> */}
                                        </div>
                                        <p className="text-xs text-health-600 mb-1">{conversation.doctor.doctorProfile.specialization}</p>
                                        {/* <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p> */}
                                    </div>

                                    {/* {conversation.unread > 0 && (
                                        <Badge className="bg-health-500 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center">
                                            {conversation.unread}
                                        </Badge>
                                    )} */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                    {selectedConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-1 bg-white border-b flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Avatar className="h-5 w-5">
                                            <AvatarImage src={selectedConversation.doctor.doctorProfile.imageUrl} />
                                            <AvatarFallback className="bg-health-100 text-health-700">
                                                {selectedConversation.doctor.doctorProfile.fullName.split(" ").map(n => n[0]).join("")}
                                            </AvatarFallback>
                                        </Avatar>

                                    </div>
                                    <div>
                                        <h2 className="font-medium text-gray-900">{selectedConversation.doctor.doctorProfile.fullName}</h2>
                                        <p className="text-sm text-health-600">{selectedConversation.doctor.doctorProfile.specialization}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button className="h-3 w-3" variant="ghost" onClick={handleVoiceCall}>
                                        <Phone className="h-2 w-2" />
                                    </Button>
                                    <Button className="h-3 w-3" variant="ghost" onClick={handleVideoCall}>
                                        <Video className="h-2 w-2" />
                                    </Button>
                                    <Button className="h-3 w-3" variant="ghost" >
                                        <MoreVertical className="h-2 w-2" />
                                    </Button>
                                </div>
                            </div>

                            {/* Messages */}
                            {
                                loading ?
                                    (
                                        <div>
                                            <div className='w-full   h-[100vh] center'>
                                                <div className="loading-animation h-14 w-14 border-b-2 border-green-500"></div>
                                            </div>
                                        </div>
                                    ) :
                                    (
                                        <div className="flex-1 overflow-y-auto p-4 space-y-1">
                                            {messages.map((msg) => (
                                                <div
                                                    key={`${msg.id}-${msg.time}`}
                                                    className={`flex gap-1 ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    {msg.sender === 'doctor' && (
                                                        <Avatar className="h-3 w-3">
                                                            <AvatarImage src={msg.avatar} />
                                                            <AvatarFallback className="bg-health-100 text-health-700">
                                                                {selectedConversation.doctor.doctorProfile.fullName.split(" ").map(n => n[0]).join("")}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    )}

                                                    <div className={`max-w-xs lg:max-w-md px-4 py-1 rounded-lg ${msg.sender === 'patient'
                                                        ? 'health-green text-white'
                                                        : 'bg-gray-100 text-gray-900'
                                                        }`}>
                                                        <p className="text-sm">{msg.content}</p>
                                                        <p className={`text-xs mt-2 ml-1 ${msg.sender === 'patient' ? 'text-green-200' : 'text-muted-foreground'
                                                            }`}>
                                                            {msg.time}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            <div ref={bottomRef} />
                                        </div>

                                    )
                            }

                            {/* Message Input */}
                            <div className="p-1 bg-white border-t">
                                <div className="flex items-center gap-2">
                                    <Button className="h-5 w-5" variant="outline" >
                                        <Paperclip className="h-4 w-4" />
                                    </Button>
                                    <div className="flex-1 relative">
                                        <Input
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Type your message..."
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage();
                                                }
                                            }}
                                            className="pr-12 h-5"
                                        />
                                        {/* <Button
                                            size="sm"
                                            variant="ghost"
                                            className="absolute h-5 w-5 right-2 top-1/2 transform -translate-y-1/2"
                                        >
                                            <Smile className="h-4 w-4" />
                                        </Button> */}
                                    </div>
                                    <Button onClick={handleSendMessage} className="health-green h-5 w-5">
                                        <IoIosSend className=" text-white" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center bg-gray-50">
                            <div className="text-center">
                                <h2 className="text-xl font-medium text-gray-900 mb-2">Select a conversation</h2>
                                <p className="text-muted-foreground">Choose a doctor to start chatting</p>
                            </div>
                        </div>
                    )}
                </div >
            </div >

        </>
    );
};

export default Chat;
